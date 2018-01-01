process.env.NODE_ENV = 'test';
process.env.urlMongodb = 'mongodb://localhost:27017/LibraryTest';

const mongoose = require("mongoose");
const chance = require('chance');
const async = require('async');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const should = chai.should();
const Book = require('../../src/db/bookShema.js').BookModel;
const User = require('../../src/db/userShema.js').UserModel;


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

    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
            chai.request(app)
                .get('/books')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST book', () => {
        it('it should not POST a book without name field', (done) => {
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
        it('it should add a book ', (done) => {
            let book = {
                name: 'The Lord of the Rings',
                author: 'J.R.R. Tolkien'
            };
            chai.request(app)
                .post('/books/add')
                .send(book)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.book.should.have.property('name');
                    res.body.book.should.have.property('author');
                    done();
                });
        });
    });

    describe('issue and return book', () => {
        let book = new Book({name: "The Chronicles of Narnia", author: "C.S. Lewis"});
        let user = new User({name: "Charli", number: "1", mail: 'dfdfdf.com'});
        let idBook;
        let idUser;
        before('create initial data', (done) => {
            async.parallel([
                (cb) => {
                    book.save((err, book) => {
                        idBook = book._id.toString();
                        cb();
                    });
                },
                (cb) => {
                    user.save((err, user) => {
                        idUser = user._id.toString();
                        cb();
                    });
                }
            ], (err) => {
                should.not.exist(err);
                done();
            });
        });
        it('it should issue a book to user given the id', function (done) {
            chai.request(app)
                .post('/books/issue')
                .send({id: idBook, number: '1'})
                .end(function (err, res) {
                    Book.find(function (err, books) {
                        console.log('res' + books);
                    });
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //res.body.book.should.have.property('issued');
                    // res.body.book.should.have.property('issuedto');
                    //res.body.should.have.property('issued');
                    //res.body.should.have.property('issuedto').eql(user._id.toString);
                    done();
                });
        });
    });
});

