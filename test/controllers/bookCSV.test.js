require('dotenv').config({path: 'test.env'});

const Chance = require('chance');
const chance = new Chance();
const _ = require('lodash');
const async = require('async');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const {BookModel} = require('../../src/db/bookShema');
const {UserModel} = require('../../src/db/userShema');
const fs = require('fs');

chai.use(chaiHttp);
describe('Book Tests', () => {
  beforeEach('clear database', (done) => {
    async.parallel([
      (cb) => {
        fs.writeFile(process.env.pathBookCSVdb, '', cb);
      },
      (cb) => {
        BookModel.remove({}, cb);
      },
      (cb) => {
        UserModel.remove({}, cb);
      }
    ], (err) => {
      should.not.exist(err);
      done();
    });
  });

  it('it should GET an empty array books for clear database', (done) => {
    chai.request(app)
      .get('/books/all')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it('it should not create a book with an empty name', (done) => {
    const req = {
      book: {
        name: '',
        author: 'petrow'
      },
      base: 'CSV'
    };
    chai.request(app)
      .post('/books/add')
      .send(req)
      .end((err, res) => {
        res.should.have.status(400);
        res.text.should.eql('Invalid request data');
        done();
      });
  });

  it('it should create a book ', (done) => {
    const req = {
      book: {
        name: chance.sentence({words: 4}),
        author: `${chance.first()} ${chance.last()}`
      },
      base: 'CSV'
    };
    chai.request(app)
      .post('/books/add')
      .send(req)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.book.should.have.property('name').eql(req.book.name);
        res.body.book.should.have.property('author').eql(req.book.author);
        done();
      });
  });

  describe('when several books are created', () => {
    let books;
    beforeEach('create several books', (done) => {
      async.timesSeries(3, (n, cb) => {
        const book = new BookModel({
          name: chance.sentence({words: 4}),
          author: `${chance.first()} ${chance.last()}`
        });
        book.save((err, result) => {
          should.not.exist(err);
          cb(null, JSON.parse(JSON.stringify(result._doc)));
        });
      }, (err, booksDB) => {
        books = booksDB;
        done();
      });
    });

    it('it should GET books', (done) => {
      chai.request(app)
        .get('/books/all')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.be.lengthOf(books.length);
          _.forEach(res.body, (book) => {
            books.should.deep.include(_.omit(book, 'base'));
          });
          done();
        });
    });

    it('it should find books by name', (done) => {
      chai.request(app)
        .post('/books/find')
        .send({name: books[0].name})
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.be.lengthOf(1);
          _.omit(res.body[0], 'base').should.eql(books[0]);
          done();
        });
    });

    it('it should find books by author', (done) => {
      chai.request(app)
        .post('/books/find')
        .send({author: books[1].author})
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.be.lengthOf(1);
          _.omit(res.body[0], 'base').should.eql(books[1]);
          done();
        });
    });

    it('it should find books by name and author', (done) => {
      chai.request(app)
        .post('/books/find')
        .send({name: books[2].name, author: books[2].author})
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.be.lengthOf(1);
          _.omit(res.body[0], 'base').should.eql(books[2]);
          done();
        });
    });

    describe('when a user is created', () => {
      let user;
      beforeEach('create a user', (done) => {
        const userModel = new UserModel({
          name: `${chance.first()} ${chance.last()}`,
          number: '1',
          mail: chance.email()
        });
        userModel.save((err, result) => {
          should.not.exist(err);
          user = JSON.parse(JSON.stringify(result._doc));
          done();
        });
      });

      it('it should issue a book to user given the id', (done) => {
        chai.request(app)
          .post('/books/issue')
          .send({id: books[0]._id, number: user.number, base: 'Mongo'})
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.book.should.have.property('issued');
            res.body.book.should.have.property('issuedto').eql(user._id);
            done();
          });
      });

      describe('when a book is issued', () => {
        beforeEach('issue a book', (done) => {
          chai.request(app)
            .post('/books/issue')
            .send({id: books[0]._id, number: user.number, base: 'Mongo'})
            .end((err) => {
              should.not.exist(err);
              done();
            });
        });

        it('it should set a book as unissued', (done) => {
          chai.request(app)
            .post('/books/return')
            .send({id: books[0]._id, base: 'CSV'})
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.book.should.have.property('issued').eql(null);
              res.body.book.should.have.property('issuedto').eql(null);
              done();
            });
        });
      });
    });
  });
});
