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
const user = require('../../src/services/userService.js');

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
        book.all((err, doc) => {
            doc.should.be.a('array');
            doc.length.should.be.eql(0);
            done();
        });
    });

    it('it should not create a book with an empty name', (done) => {
        let obj = {
            name: '',
            author: 'petrow'
        };
        book.add(obj, (err, doc) => {
            err.status.should.eql(400);
            err.message.should.eql('Invalid request data');
            done();
        });
    });

    it('it should create a book ', (done) => {
        let obj = {
            name: chance.sentence({words: 4}),
            author: chance.first() + ' ' + chance.last()
        };
        book.add(obj, (err, doc) => {
            doc.should.be.a('object');
            doc.should.have.property('name').eql(obj.name);
            doc.should.have.property('author').eql(obj.author);
            done();
        });
    });

    describe('when several books are created', () => {
        let books;
        beforeEach('create several books', (done) => {
            async.timesSeries(3, (n, cb) => {
                const obj = {
                    name: chance.sentence({words: 4}),
                    author: chance.first() + ' ' + chance.last()
                };
                book.add(obj, (err, result) => {
                    should.not.exist(err);
                    cb(null, JSON.parse(JSON.stringify(result._doc)));
                });
            }, (err, booksDB) => {
                books = booksDB;
                done();
            });
        });

        it('it should GET books', (done) => {
            book.all((err, doc) => {
                let arr = [doc[0]._doc, doc[1]._doc, doc[2]._doc];
                arr[0]._id = arr[0]._id.toString();
                arr[1]._id = arr[1]._id.toString();
                arr[2]._id = arr[2]._id.toString();

                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(books.length);
                (arr.sort()).should.eql(books.sort());
                done();
            });
        });

        it('it should find books by name', (done) => {
            book.find({name: books[0].name}, (err, doc) => {
                let arr = [doc[0]._doc];
                arr[0]._id = arr[0]._id.toString();

                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(1);
                arr.should.eql([books[0]]);
                done();
            });
        });

        it('it should find books by author', (done) => {
            book.find({author: books[1].author}, (err, doc) => {
                let arr = [doc[0]._doc];
                arr[0]._id = arr[0]._id.toString();

                should.not.exist(err);
                arr.should.be.a('array');
                arr.should.be.lengthOf(1);
                arr.should.eql([books[1]]);
                done();
            });
        });

        it('it should find books by name and author', (done) => {
            book.find({name: books[2].name, author: books[2].author}, (err, doc) => {
                let arr = [doc[0]._doc];
                arr[0]._id = arr[0]._id.toString();

                should.not.exist(err);
                arr.should.be.a('array');
                arr.should.be.lengthOf(1);
                arr.should.eql([books[2]]);
                done();
            });
        });

        describe('when a user is created', () => {
            let userDB;
            beforeEach('create a user', (done) => {
                const obj = {
                    name: chance.first() + ' ' + chance.last(),
                    number: "1",
                    mail: chance.email()
                };
                user.add(obj, (err, result) => {
                    should.not.exist(err);
                    userDB = JSON.parse(JSON.stringify(result._doc));
                    done();
                });
            });

            it('it should issue a book to user given the id', (done) => {
                book.issue({id: books[0]._id, number: userDB.number}, (err, doc) => {
                    should.not.exist(err);
                    doc.should.be.a('object');
                    doc.should.have.property('issued');
                    doc.issuedto.toString().should.eql(userDB._id);
                    done();
                });
            });

            describe('when a book is issued', () => {
                beforeEach('issue a book', (done) => {
                    chai.request(app)
                        .post('/books/issue')
                        .send({id: books[0]._id, number: userDB.number})
                        .end((err) => {
                            should.not.exist(err);
                            done();
                        });
                });

                it('it should set a book as unissued', function (done) {
                    book.return({id: books[0]._id}, (err, doc) => {
                        doc.should.be.a('object');
                        doc.should.have.property('issued').eql(null);
                        doc.should.have.property('issuedto').eql(null);
                        done();
                    });
                });
            });
        });
    });
});