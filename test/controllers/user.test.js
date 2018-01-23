require('dotenv').config({path: 'test.env'});

const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');
const mongoose = require("mongoose");
const async = require('async');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const {UserModel} = require('../../src/db/userShema');

chai.use(chaiHttp);
describe('User Tests', () => {
    beforeEach('clear database', (done) => {
        UserModel.remove({}, (err) => {
            should.not.exist(err);
            done();
        });
    });

    it('it should GET an empty array books for clear database', (done) => {
        chai.request(app)
            .get('/users/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('it should not create a user with an empty name', (done) => {
        let user = {
            name: '',
            number: chance.integer().toString(),
            mail: chance.email()
        };
        chai.request(app)
            .post('/users/add')
            .send(user)
            .end((err, res) => {
                res.should.have.status(422);
                res.text.should.eql('User validation failed: name: Path `name` is required.');
                done();
            });
    });

    it('it should create a user ', (done) => {
        let user = {
            name: chance.first() + ' ' + chance.last(),
            number: chance.integer().toString(),
            mail: chance.email()
        };
        chai.request(app)
            .post('/users/add')
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.user.should.have.property('name').eql(user.name);
                res.body.user.should.have.property('number').eql(user.number);
                res.body.user.should.have.property('mail').eql(user.mail);
                done();
            });
    });

    describe('when several users are created', () => {
        let users;
        beforeEach('create several users', (done) => {
            async.timesSeries(3, (n, cb) => {
                const user = new UserModel({
                    name: chance.first() + ' ' + chance.last(),
                    number: chance.integer().toString(),
                    mail: chance.email()
                });
                user.save((err, result) => {
                    should.not.exist(err);
                    cb(null, JSON.parse(JSON.stringify(result._doc)));
                });
            }, (err, usersDB) => {
                users = usersDB;
                done();
            });
        });

        it('it should GET users', (done) => {
            chai.request(app)
                .get('/users/all')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.be.lengthOf(users.length);
                    (res.body.sort()).should.eql(users.sort());
                    done();
                });
        });

        describe('when a user is created', () => {
            let user;
            beforeEach('create a user', (done) => {
                const userModel = new UserModel({
                    name: chance.first() + ' ' + chance.last(),
                    number: "1",
                    mail: chance.email()
                });
                userModel.save((err, result) => {
                    should.not.exist(err);
                    user = JSON.parse(JSON.stringify(result._doc));
                    done();
                });
            });

            it('it should delete a user ', (done) => {
                chai.request(app)
                    .post('/users/delete')
                    .send({id: user._id})
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.body.user.should.be.a('object');
                        res.body.user.should.have.property('name').eql(user.name);
                        res.body.user.should.have.property('number').eql(user.number);
                        res.body.user.should.have.property('mail').eql(user.mail);
                        done();
                    });
            });
        });
    });
});