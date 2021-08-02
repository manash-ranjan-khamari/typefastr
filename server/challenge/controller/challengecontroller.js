const BaseController = require('../../common/controller/basecontroller');
const challengeService = require('../service/challengeservice.js');

class ChallengeController extends BaseController {
    constructor() {
        super();
    }

    async getChallenge(req, res, next) {
        try {
            const challenge = await challengeService.getChallenge();

            return this.sendApiResponse({res, status: this.StatusCodes.OK, model: challenge?.[0]});
        } catch(err) {
            return this.sendApiResponse({res, status: this.StatusCodes.INTERNAL_SERVER_ERROR, model: err.message});
        }
    }
}

module.exports = ChallengeController;
