const request = require('supertest');
const mysql = require('mysql');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('../config/appconfig.js');
const mockData = require('./mockdata.js');
chai.use(chaiAsPromised);

const expect = chai.expect;
const baseUrl = config.appUrl;

describe('/competition', function() {
    
    before(function(beforeDone) {
        beforeDone();
    });
    
    describe('POST /competition', function() {
        before(function(beforeDone) {
            url = '/competition';
            beforeDone();
        });

        it('Should return bad request when no request body specified', function(done) {
            request(baseUrl).post(url)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('identifier');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 20 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request a single character identifier is specified', function(done) {
            request(baseUrl).post(url).send(mockData.joinChallenge.singleName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('identifier');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 20 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when title identifier exceeds 200', function(done) {
            request(baseUrl).post(url).send(mockData.joinChallenge.largeName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('identifier');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 20 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when invalid userId provided', function(done) {
            request(baseUrl).post(url).send(mockData.joinChallenge.invalidUserId)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('userId');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be an integer value');

                    done();
                });
        });
    });
});
