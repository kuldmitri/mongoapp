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
const userService = require('../../src/services/userService.js');

chai.use(chaiHttp);
describe('User Tests', () => {
    beforeEach('clear database', (done) => {
        User.remove({}, (err) => {
            should.not.exist(err);
            done();
        });
    });

    it('it should GET an empty array books for clear database', (done) => {
        userService.findAll((err, doc) => {
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
        userService.addUser(obj, (err, doc) => {
            err.name.should.eql('ValidationError');
            done();
        });
    });

    it('it should create a user ', (done) => {
        let user = {
            name: chance.first() + ' ' + chance.last(),
            number: chance.integer().toString(),
            mail: chance.email()
        };
        userService.addUser(user, (err, doc) => {
            doc.should.be.a('object');
            doc.should.have.property('name').eql(user.name);
            doc.should.have.property('number').eql(user.number);
            doc.should.have.property('mail').eql(user.mail);
            done();
        })
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

        it('it should NOT create a user if number already exist', (done) => {
            let user = {
                name: chance.first() + ' ' + chance.last(),
                number: users[0].number,
                mail: chance.email()
            };
            chai.request(app)
                .post('/users/add')
                .send(user)
                .end(function (err, res) {
                    res.should.have.status(422);
                    res.text.should.be.eql('Данный номер читательского билета уже зарегистрирован ');
                    done();
                });
        });

        it('it should GET users', (done) => {
            userService.findAll((err, doc) => {
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

        it('it should delete a user ', (done) => {
            const userDB = users[0];
            userService.deleteUser({id: userDB._id}, (err, doc) => {
                doc.should.be.a('object');
                doc.should.have.property('name').eql(userDB.name);
                doc.should.have.property('number').eql(userDB.number);
                doc.should.have.property('mail').eql(userDB.mail);
                done();
            });
        });
    });
});