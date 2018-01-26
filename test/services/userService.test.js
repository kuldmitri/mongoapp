require('dotenv').config({path: 'test.env'});
const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');
const async = require('async');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const {UserModel} = require('../../src/db/userShema');
const {userService} = require('../../src/services');

chai.use(chaiHttp);
describe('User Tests', () => {
  beforeEach('clear database', (done) => {
    UserModel.remove({}, (err) => {
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
    const obj = {
      name: '',
      author: 'petrow'
    };
    userService.addUser(obj, (err) => {
      err.name.should.eql('ValidationError');
      done();
    });
  });

  it('it should create a user ', (done) => {
    const user = {
      name: `${chance.first()} ${chance.last()}`,
      number: chance.integer().toString(),
      mail: chance.email()
    };
    userService.addUser(user, (err, added) => {
      added.should.be.a('object');
      added.should.have.property('name').eql(user.name);
      added.should.have.property('number').eql(user.number);
      added.should.have.property('mail').eql(user.mail);
      done();
    });
  });

  describe('when several users are created', () => {
    let users;
    beforeEach('create several users', (done) => {
      async.timesSeries(3, (n, cb) => {
        const user = new UserModel({
          name: `${chance.first()} ${chance.last()}`,
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
      const user = {
        name: `${chance.first()} ${chance.last()}`,
        number: users[0].number,
        mail: chance.email()
      };
      chai.request(app)
        .post('/users/add')
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          res.text.should.be.eql('Данный номер читательского билета уже зарегистрирован ');
          done();
        });
    });

    it('it should GET users', (done) => {
      userService.findAll((err, doc) => {
        doc = JSON.parse(JSON.stringify(doc));
        should.not.exist(err);
        doc.should.be.a('array');
        doc.should.be.lengthOf(users.length);
        _.forEach(JSON.parse(JSON.stringify(doc)), (user) => {
          users.should.deep.include(user);
        });
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
