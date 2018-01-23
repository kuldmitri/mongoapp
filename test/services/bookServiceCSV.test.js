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
const {BookModel} = require('../../src/db/bookShema');
const {UserModel} = require('../../src/db/userShema');
const {bookService} = require('../../src/services');
const {userService} = require('../../src/services');
const csv = require('csv');
const csvDatabase = require('../../src/db/csvDatabase');
const fs = require("fs");

chai.use(chaiHttp);
describe('Book Tests', () => {
    beforeEach('clear database', (done) => {
        async.parallel([
            (cb) => {
                fs.writeFile(process.env.pathBookCSVdb, '', cb)
            },
            (cb) => {
                BookModel.remove({}, cb);
            },
            (cb) => {
                UserModel.remove({}, cb)
            }
        ], (err) => {
            should.not.exist(err);
            done();
        });
    });

    it('it should GET an empty array books for clear database', (done) => {
        bookService.findAll((err, doc) => {
            doc.should.be.a('array');
            doc.length.should.be.eql(0);
            done();
        });
    });

    it('it should create a book ', (done) => {
        const obj = {
            book: {
                name: chance.sentence({words: 4}),
                author: chance.first() + ' ' + chance.last()
            },
            base: 'CSV'
        };
        bookService.addNewBook(obj, (err, doc) => {
            doc.should.be.a('object');
            doc.should.have.property('name').eql(obj.book.name);
            doc.should.have.property('author').eql(obj.book.author);
            done();
        });
    });

    describe('when several books are created', () => {
        let books;
        beforeEach('create several books', (done) => {
            async.timesSeries(3, (n, cb) => {
                const obj = {
                    book: {
                        name: chance.sentence({words: 4}),
                        author: chance.first() + ' ' + chance.last()
                    },
                    base: 'CSV'
                };
                bookService.addNewBook(obj, (err, result) => {
                    should.not.exist(err);
                    cb(null, JSON.parse(JSON.stringify(result)));
                });
            }, (err, booksDB) => {
                books = booksDB;
                done();
            });
        });

        it('it should GET books', (done) => {
            bookService.findAll((err, doc) => {
                should.not.exist(err);
                _.forEach(doc, (book, index) => {
                    doc[index] = _.omit(book, 'base');
                });
                doc.should.be.a('array');
                doc.should.be.lengthOf(books.length);
                (doc.sort()).should.eql(books.sort());
                done();
            });
        });

        it('it should find books by name', (done) => {
            bookService.findByNameAndAuthor({name: books[0].name}, (err, doc) => {
                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(1);
                _.omit(JSON.parse(JSON.stringify(doc[0])), 'base').should.eql(books[0]);
                done();
            });
        });

        it('it should find books by author', (done) => {
            bookService.findByNameAndAuthor({author: books[1].author}, (err, doc) => {
                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(1);
                _.omit(JSON.parse(JSON.stringify(doc[0])), 'base').should.eql(books[1]);
                done();
            });
        });

        it('it should find books by name and author', (done) => {
            bookService.findByNameAndAuthor({name: books[2].name, author: books[2].author}, (err, doc) => {
                should.not.exist(err);
                doc[0]._id = doc[0]._id.toString();
                doc.should.be.a('array');
                doc.should.be.lengthOf(1);
                _.omit(JSON.parse(JSON.stringify(doc[0])), 'base').should.eql(books[2]);
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
                userService.addUser(obj, (err, result) => {
                    should.not.exist(err);
                    userDB = JSON.parse(JSON.stringify(result._doc));
                    done();
                });
            });

            it('it should issue a book to user given the id', (done) => {
                bookService.issueBook({id: books[0]._id, number: userDB.number, base: 'CSV'}, (err, doc) => {
                    should.not.exist(err);
                    doc.should.be.a('object');
                    doc.should.have.property('issued');
                    doc.issuedto.toString().should.eql(userDB._id);
                    done();
                });
            });

            describe('when a book is issued', () => {
                beforeEach('issue a book', (done) => {
                    bookService.issueBook({id: books[0]._id, number: userDB.number, base: 'CSV'}, (err) => {
                        should.not.exist(err);
                        done();
                    });
                });

                it('it should set a book as unissued', (done) => {
                    bookService.returnBook({id: books[0]._id, base: 'CSV'}, (err, doc) => {
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