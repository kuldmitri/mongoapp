process.env.NODE_ENV = 'test';
process.env.urlMongodb = 'mongodb://localhost:27017/LibraryTest';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let Book = require('../src/db/bookShema.js').BookModel;
let User = require('../src/db/userShema.js').UserModel;

chai.use(chaiHttp);
describe('Books', function () {
    beforeEach(function (done) { //Перед каждым тестом чистим базу
        Book.remove({}, function (err) {
            done();
        });
        User.remove({}, function (err) {
            done();
        });
    });
    describe('/GET book', function () {
        it('it should GET all the books', function (done) {
            chai.request(app)
                .get('/books')
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/POST book', function () {
        it('it should not POST a book without name field', function (done) {
            let book = {
                name: '',
                author: 'petrow'
            };
            chai.request(app)
                .post('/books/add')
                .send(book)
                .end(function (err, res) {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name');
                    res.body.errors.name.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('it should POST a book ', function (done) {
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
                    res.body.should.have.status('OK');
                    res.body.book.should.have.property('name');
                    res.body.book.should.have.property('author');
                    done();
                });
        });

    });
    describe('issue and return book', function () {
        let book = new Book({name: "The Chronicles of Narnia", author: "C.S. Lewis"});
        let user = new User({name: "Charli", number: "1", mail: 'dfdfdf.com'});
        var idBook;
        var idUser;
        before(function () {
            book.save(function (err, book) {
                idBook = book._id.toString();
            });
            user.save(function (err, user) {
                idUser = user._id.toString();
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
                    res.body.book.should.have.property('issued');
                    res.body.book.should.have.property('issuedto');
                    //res.body.should.have.property('issued');
                    //res.body.should.have.property('issuedto').eql(user._id.toString);
                    done();
                });
        });
    });
});

