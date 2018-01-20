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
const bookService = require('../../src/services/bookService');
const userService = require('../../src/services/userService');

chai.use(chaiHttp);
describe('Book Tests', () => {
    beforeEach('clear database', (done) => {
        async.parallel([
            (cb) => {
                BookModel.remove({}, cb)
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

    it('it should not create a book with an empty name', (done) => {
        const obj = {
            book: {
                name: '',
                author: chance.first() + ' ' + chance.last()
            },
            base: 'Mongo'
        }
        bookService.addNewBook(obj, (err) => {
            err.name.should.eql('ValidationError');
            err.message.should.eql('Book validation failed: name: Path `name` is required.');
            done();
        });
    });

    it('it should create a book ', (done) => {
        const obj = {
            book: {
                name: chance.sentence({words: 4}),
                author: chance.first() + ' ' + chance.last()
            },
            base: 'Mongo'
        }
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
                    base: 'Mongo'
                }
                bookService.addNewBook(obj, (err, result) => {
                    should.not.exist(err);
                    cb(null, JSON.parse(JSON.stringify(result._doc)));
                });
            }, (err, booksDB) => {
                books = booksDB;
                done();
            });
        });

        it('it should GET books', (done) => {
            bookService.findAll((err, doc) => {
                should.not.exist(err);
                doc.should.be.a('array');
                doc.should.be.lengthOf(books.length);
                _.forEach(JSON.parse(JSON.stringify(doc)), (book) => {
                    books.should.deep.include(_.omit(book, 'base'));
                });
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
                let arr = [doc[0]._doc];
                arr[0]._id = arr[0]._id.toString();

                should.not.exist(err);
                arr.should.be.a('array');
                arr.should.be.lengthOf(1);
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
                bookService.issueBook({id: books[0]._id, number: userDB.number, base: 'Mongo'}, (err, doc) => {
                    should.not.exist(err);
                    doc.should.be.a('object');
                    doc.should.have.property('issued');
                    doc.issuedto.toString().should.eql(userDB._id);
                    done();
                });
            });

            describe('when a book is issued', () => {
                beforeEach('issue a book', (done) => {
                    bookService.issueBook({id: books[0]._id, number: userDB.number, base: 'Mongo'}, (err) => {
                        should.not.exist(err);
                        done();
                    });
                });

                it('it should set a book as unissued', (done) => {
                    bookService.returnBook({id: books[0]._id, base: 'Mongo'}, (err, doc) => {
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