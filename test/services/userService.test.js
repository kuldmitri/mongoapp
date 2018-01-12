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
const User = require('../../src/db/userShema.js').UserModel;
const user = require('../../src/services/userService.js');

chai.use(chaiHttp);
describe('User Tests', () => {
    beforeEach('clear database', (done) => {
        User.remove({}, (err) => {
            should.not.exist(err);
            done();
        });
    });

    it('it should GET an empty array books for clear database', (done) => {
        user.all((err, doc) => {
            doc.should.be.a('array');
            doc.length.should.be.eql(0);
            done();
        });
    });

    it('it should not create a user with an empty name', (done) => {
        let obj = {
            name: '',
            author: 'petrow'
        };
        user.add(obj, (err, doc) => {
            err.status.should.eql(400);
            err.message.should.eql('Invalid request data');
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
                const user = new User({
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
            user.all((err, doc) => {
                let arr = [doc[0]._doc, doc[1]._doc, doc[2]._doc];
                arr[0]._id = arr[0]._id.toString();
                arr[1]._id = arr[1]._id.toString();
                arr[2]._id = arr[2]._id.toString();

                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(users.length);
                (arr.sort()).should.eql(users.sort());
                done();
            });
        });

        describe('when a user is created', () => {
            let userDB;
            beforeEach('create a user', (done) => {
                const userModel = new User({
                    name: chance.first() + ' ' + chance.last(),
                    number: "1",
                    mail: chance.email()
                });
                userModel.save((err, result) => {
                    should.not.exist(err);
                    userDB = JSON.parse(JSON.stringify(result._doc));
                    done();
                });
            });

            it('it should delete a user ', (done) => {
                user.delete({id: userDB._id}, (err, doc) => {
                    doc.should.be.a('object');
                    doc.should.have.property('name').eql(userDB.name);
                    doc.should.have.property('number').eql(userDB.number);
                    doc.should.have.property('mail').eql(userDB.mail);
                    done();
                });
            });
        });
    });
});