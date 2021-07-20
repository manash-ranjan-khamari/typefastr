const request = require('supertest');
const mysql = require('mysql');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('../config/appconfig.js');
const mockData = require('./mockdata.js');
chai.use(chaiAsPromised);

const expect = chai.expect;
let testTableName;
const baseUrl = config.appUrl;

describe('/todolist', function() {
    
    before(function(beforeDone) {
        testTableName = 'todolist_test';
        const connection = mysql.createConnection(config.mysql);
        connection.connect();
    
        connection.query(`DROP TABLE IF EXISTS ${testTableName}`);
        connection.query(`CREATE TABLE ${testTableName}(
            id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(200) NOT NULL,
            description VARCHAR(500) DEFAULT NULL,
            active BOOLEAN DEFAULT TRUE,
            createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
            lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
            PRIMARY KEY (id)
        )`, function (error, results, fields) {
            if (error) console.log(error);
            testTableName = 'task_test';
            connection.query(`DROP TABLE IF EXISTS ${testTableName}`);
            connection.query(`CREATE TABLE ${testTableName}(
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(200) NOT NULL,
                description VARCHAR(500) DEFAULT NULL,
                todoListId INT NOT NULL,
                dueDateTime TIMESTAMP(3) NULL DEFAULT NULL,
                timeSpent INT DEFAULT 0,
                active BOOLEAN DEFAULT TRUE,
                createdTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3),
                lastModifiedTime TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                PRIMARY KEY (id),
                UNIQUE KEY (title, todoListId),
                CONSTRAINT fkTodolistIdTest FOREIGN KEY(todoListId) REFERENCES todolist(id) ON DELETE NO ACTION ON UPDATE NO ACTION
            )`, function (error, results, fields) {        
                if (error) console.log(error);
                connection.end();
                beforeDone();
            });
        });
    });
    
    describe('POST /todolist', function() {
        before(function(beforeDone) {
            url = '/todolist';
            beforeDone();
        });

        it('Should return bad request when no request body specified', function(done) {
            request(baseUrl).post(url)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request a single character title is specified', function(done) {
            request(baseUrl).post(url).send(mockData.addTodoList.singleName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when title length exceeds 200', function(done) {
            request(baseUrl).post(url).send(mockData.addTodoList.largeName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when < 20 char description provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTodoList.smallDescription)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('description');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 20 chars & at max 500 chars');

                    done();
                });
        });

        it('Should return 201 response when a legit title, description is provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTodoList.legitProduct).expect(201).end(() => done());
        });
    });

    describe('POST /todolist/task', function() {
        before(function(beforeDone) {
            url = '/todolist/task';
            beforeDone();
        });

        it('Should return bad request when no request body specified', function(done) {
            request(baseUrl).post(url)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request a single character title is specified', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.singleName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when title length exceeds 200', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.largeName)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('title');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 2 chars & at max 200 chars');

                    done();
                });
        });

        it('Should return bad request when < 20 char description provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.smallDescription)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('description');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be at least 20 chars & at max 500 chars');

                    done();
                });
        });

        it('Should return bad request when wrong dueDate is provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.wrongDueDate)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('dueDateTime');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('Invalid value');
                    expect(res.body).to.have.property('errors').to.have.property(1).to.have.property('field')
                        .and.equal('dueDateTime');
                    expect(res.body).to.have.property('errors').to.have.property(1).to.have.property('message')
                        .and.equal('must be a valid datetime in the format YYYY-MM-DD HH:MM');

                    done();
                });
        });

        it('Should return bad request when non-existent todoListId is provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.wrongToDoListId)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    done();
                });
        });

        it('Should return 201 response when a legit title, description is provided', function(done) {
            request(baseUrl).post(url).send(mockData.addTask.legitProduct).expect(201).end((err, res) => done());
        });
    });

    describe('GET /todolist', function() {
        before(function(beforeDone) {
            url = '/todolist';
            beforeDone();
        });

        it('Should return bad request when invalid id is specified', function(done) {
            request(baseUrl).get(`${url}?id=asd`)
                .expect('Content-type', /json/).expect(400).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property('errors').to.be.an('array').to.have.property(0).to.be.a('object');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('field')
                        .and.equal('id');
                    expect(res.body).to.have.property('errors').to.have.property(0).to.have.property('message')
                        .and.equal('must be an integer value');

                    done();
                });
        });
        
        it('Should return valid data when a matching record(s) is/are found', function(done) {
            request(baseUrl).get(`${url}?unitTest=true`)
                .expect('Content-type', /json/).expect(200).end(function(err, res) {
                    expect(res.body).to.be.a('object');
                    
                    expect(res.body).to.have.property(1).to.be.a('object');
                    expect(res.body).to.have.property(1).to.have.property('status')
                        .and.equal(1);
                    
                    done();
                });
        });
    });
});
