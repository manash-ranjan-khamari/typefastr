const MysqlDBService = require('../../common/service/mysqldbservice.js');
const userService = require('../../user/service/userservice.js');
const CustomError = require('../../common/error/customerror.js');

class CompetitionService extends MysqlDBService {
    constructor() {
        super();
    }

    async checkCompetitionStatus({identifier, competitionId}) {
        let competitionDataObj = {};

        const competitionData = await this.executeQuery(`SELECT id, status FROM competition WHERE ${identifier ? 'url' : 'id'} = ?`, [identifier || competitionId]);

        if (competitionData?.length) {
            competitionDataObj.status = competitionData[0].status.replace(/ /g, '-').toLowerCase();
            competitionDataObj.id = competitionData[0].id;
        } else {
            competitionDataObj.status = 'not-started';
        }
        
        return competitionDataObj;
    }

    async registerUserForCompetition(userid, competitionId) {
        const userRegistrationData = await this.executeQuery(`CALL sp_INSERT_USER_FOR_COMPETITION(?, ?)`, [userid, competitionId]);

        if (userRegistrationData?.[0]?.[0]['@userRegisteredForCompetition'] === 0) {
            return Promise.reject(new CustomError({status: 'USERLIMITREACHED', message: 'Maximum user limit reached'}))
        } 
        return userRegistrationData;
    }

    async getUserCompetitionRecord({userId, competitionId}) {
        if (!competitionId)
            return Promise.reject(new Error('CompetitionId must for fetching record'));

        if (!userId) {
            return await this.executeQuery('SELECT id, startTime, endTime, gameTime FROM user_competition WHERE fkCompetitionId = ? ORDER BY gameTime ASC', [competitionId]);
        } else {
            return await this.executeQuery('SELECT id, startTime, endTime, gameTime FROM user_competition WHERE fkCompetitionId = ? AND fkUserId = ?', [competitionId, userId]);
        }
    }

    async updateUserCompetitionRecord({userCompetitionId, competitionStatus, gameTimeUpdate = false, winnerUpdate = false}) {
        let updateQuery, updateParam = [userCompetitionId];

        if(['Start', 'End'].includes(competitionStatus)) {
            updateQuery = `UPDATE user_competition SET ${competitionStatus === 'Start' ? 'startTime' : 'endTime'} = ? WHERE id = ? AND gameTime IS NULL`;
            updateParam.unshift(new Date());
        }
        if (gameTimeUpdate) {
            updateQuery = 'UPDATE user_competition SET gameTime = endTime - startTime WHERE id = ? AND gameTime is NULL';
        }
        if (winnerUpdate) {
            updateQuery = 'UPDATE user_competition SET winner = true WHERE id = ?';
        }
        updateQuery && await this.executeQuery(updateQuery, updateParam);
    }

    async joinCompetition({userId, identifier}) {
        const competitionStatusData = await this.checkCompetitionStatus({identifier});

        // if (competitionStatus?.open) {
            const [competitionData, userData] = await Promise.all([
                ['not-started', 'completed'].includes(competitionStatusData.status) && this.executeQuery('INSERT INTO competition (url) VALUES (?)', [identifier]),
                !userId ? userService.insertUser() : null
            ]);
            await this.registerUserForCompetition(userId || userData.insertId, competitionData.insertId || competitionStatusData.id);
            return {
                userId: userId || userData.insertId,
                competitionId: competitionData.insertId || competitionStatusData.id
            };
        /*} else if (!competitionStatus?.open) {
            return Promise.reject(new CustomError({status: 'CLOSED', message: 'Competition is Closed'}))
        } else if (competitionStatus.maxUserJoined) {
            return Promise.reject(new CustomError({status: 'USERLIMITREACHED', message: 'Maximum user limit reached'}))
        }*/
    }

    async updateCompetition({userId, competitionId}) {
        const [competitionStatus, userCompetitionData] = await Promise.all([
            this.checkCompetitionStatus({competitionId}),
            this.getUserCompetitionRecord({userId, competitionId})
        ]);

        if (userCompetitionData?.length && (competitionStatus?.status !== 'not started' || competitionStatus?.status === 'completed')) {
            if (!userCompetitionData[0].startTime && competitionStatus?.status !== 'completed') {
                await this.updateUserCompetitionRecord({userCompetitionId: userCompetitionData[0].id, competitionStatus: 'Start'});
                competitionStatus.status !== 'in-progress' && this.executeQuery(`UPDATE competition SET status = 'In Progress' WHERE id = ?`, [competitionId]);
                return 'started';
            } else {
                await this.updateUserCompetitionRecord({userCompetitionId: userCompetitionData[0].id, competitionStatus: 'End'});
                await this.updateUserCompetitionRecord({userCompetitionId: userCompetitionData[0].id, gameTimeUpdate: true});
                competitionStatus.status !== 'completed' && await this.executeQuery(`UPDATE competition SET status = 'Completed' WHERE id = ?`, [competitionId]);

                const competitionStatusData = await this.getCompetitionStatus({competitionId});

                if (competitionStatusData?.[0]['id'] === userId) {
                    return 'winner'
                } else {
                    return 'loser';
                }
            }
        } else if (!userCompetitionData?.length) {
            return Promise.reject(new Error('Can\'t find user record against the competiton'));
        } else {
            return Promise.reject(new CustomError({status: 'CLOSED', message: 'Competition is either not started yet or closed. No further change can be done'}));
        }
    }

    async getCompetitionStatus({competitionId}) {
        return await this.executeQuery(`SELECT u.id, u.name
            FROM user_competition uc 
                INNER JOIN user u ON uc.fkUserId = u.id 
            WHERE fkCompetitionId = ? AND gameTime is NOT NULL
            ORDER BY gameTime ASC
            LIMIT 1`, [competitionId]);
    }
};

module.exports = new CompetitionService();
