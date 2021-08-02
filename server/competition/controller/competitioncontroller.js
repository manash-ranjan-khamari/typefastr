const BaseController = require('../../common/controller/basecontroller.js');
const competitionService = require('../service/competitionservice.js');
const CustomError = require('../../common/error/customerror.js');

class CompetitionController extends BaseController {
    constructor() {
        super();
    }

    async joinCompetition(req, res) {
        try {
            const joinCompetitionResponse = await competitionService.joinCompetition({
                userId: req.body.userId,
                identifier: req.body.identifier
            });

            return this.sendApiResponse({res, status: this.StatusCodes.OK, model: joinCompetitionResponse});
        } catch (err) {
            if (err instanceof CustomError) {
                switch(err?.status) {
                    case 'CLOSED':
                    case 'USERLIMITREACHED':
                        return this.sendApiResponse({res, status: this.StatusCodes.FORBIDDEN, model: err.message});
                        break;

                    default:
                        return this.sendApiResponse({res, status: this.StatusCodes.INTERNAL_SERVER_ERROR, model:err?.message});
                }
            } else {
                return this.sendApiResponse({res, status: this.StatusCodes.INTERNAL_SERVER_ERROR, model:err?.message});
            }
        }
    }

    async updateCompetition(req, res) {
        try {
            const updateCompetitionResponse = await competitionService.updateCompetition({
                competitionId: req.body.competitionId,
                userId: req.body.userId
            }, req.body.unitTest);

            return this.sendApiResponse({res, status: this.StatusCodes.OK, model: updateCompetitionResponse});
        } catch (err) {
            return this.sendApiResponse({res, status: this.StatusCodes.INTERNAL_SERVER_ERROR, model:err?.message});
        }
    } 

    async getCompetitionStatus(req, res) {
        try {
            const competitionData = await competitionService.getCompetitionStatus({
                competitionId: req.query.id
            });

            return this.sendApiResponse({res, status: this.StatusCodes.OK, model: competitionData});
        } catch (err) {
            return this.sendApiResponse({res, status: this.StatusCodes.INTERNAL_SERVER_ERROR, model:err});
        }
    }
}

module.exports = CompetitionController;
