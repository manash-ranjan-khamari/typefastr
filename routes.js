const CompetitionController = require('./server/competition/controller/competitioncontroller.js');
const CompetitionValidator = require('./server/competition/validator/competitionvalidator.js');
const UserController = require('./server/user/controller/usercontroller.js');
const UserValidator = require('./server/user/validator/uservalidator.js');
const ChallengeController = require('./server/challenge/controller/challengecontroller.js');

class Routes {
    _getMethodLoader(Obj, method) {
        return function (req, res, next) {
            const controller = new Obj();

            controller[method].bind(controller)(req, res, next);
        };
    }

    exposeRoutes(app) {
        app.get('/', (req, res) => {
            res.send('Welcome to API Codebase');
        });
        app.get('/health', (req, res) => {
            res.send('Service is up.');
        });
        app.post('/competition', CompetitionValidator.joinCompetition, this._getMethodLoader(CompetitionController, 'joinCompetition'));
        app.put('/competition', CompetitionValidator.updateCompetition, this._getMethodLoader(CompetitionController, 'updateCompetition'));
        app.get('/competition/status', CompetitionValidator.getCompetitionStatus, this._getMethodLoader(CompetitionController, 'getCompetitionStatus'));
        
        app.get('/challenge', this._getMethodLoader(ChallengeController, 'getChallenge'));
        
        app.get('*', (req, res) => {
            res.send('Final fallback');
        });
    }
}

module.exports = new Routes();
