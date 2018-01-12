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
const Book = require('../../src/db/bookShema.js').BookModel;
const User = require('../../src/db/userShema.js').UserModel;
const book = require('../../src/services/bookService.js');

chai.use(chaiHttp);
describe('Book Tests', () => {
    beforeEach('clear database', (done) => {
        async.parallel([
            (cb) => {
                Book.remove({}, cb)
            },
            (cb) => {
                User.remove({}, cb)
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
        let book = {
            name: '',
            author: 'petrow'
        };
        chai.request(app)
            .post('/books/add')
            .send(book)
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.eql('Invalid request data');
                done();
            });
    });

    it('it should create a book ', (done) => {
        let book = {
            name: chance.sentence({words: 4}),
            author: chance.first() + ' ' + chance.last()
        };
        chai.request(app)
            .post('/books/add')
            .send(book)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.book.should.have.property('name').eql(book.name);
                res.body.book.should.have.property('author').eql(book.author);
                done();
            });
    });

    describe('when several books are created', () => {
        let books;
        beforeEach('create several books', (done) => {
            async.timesSeries(3, (n, cb) => {
                const book = new Book({
                    name: chance.sentence({words: 4}),
                    author: chance.first() + ' ' + chance.last()
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
                    (res.body.sort()).should.eql(books.sort());
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
                    (res.body).should.eql([books[0]]);
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
                    (res.body).should.eql([books[1]]);
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
                    (res.body).should.eql([books[2]]);
                    done();
                });
        });

        describe('when a user is created', () => {
            let user;
            beforeEach('create a user', (done) => {
                const userModel = new User({
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

            it('it should issue a book to user given the id', (done) => {
                chai.request(app)
                    .post('/books/issue')
                    .send({id: books[0]._id, number: user.number})
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
                        .send({id: books[0]._id, number: user.number})
                        .end((err) => {
                            should.not.exist(err);
                            done();
                        });
                });

                it('it should set a book as unissued', function (done) {
                    chai.request(app)
                        .post('/books/return')
                        .send({id: books[0]._id})
                        .end(function (err, res) {
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