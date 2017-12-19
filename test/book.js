process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Подключаем dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let Book = require('../db/mongoose.js').BookModel;
let User = require('../db/mongoose.js').UserModel;

chai.use(chaiHttp);
describe('Books', function () {
    beforeEach(function (done) { //Перед каждым тестом чистим базу
        Book.remove({}, function (err) {
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
                .post('/addBook')
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
                .post('/addBook')
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
        it('it should issue a book to user given the id', function (done) {
            let book = new Book({name: "The Chronicles of Narnia", author: "C.S. Lewis"});
            book.save(function (err, book) {
                let user = new User({name: "Charli", number: "1", mail: 'dfdfdf.com'});
                user.save(function (err, user) {
                    chai.request(app)
                        .post('/issueBook')
                        .send({id: book._id.toString, number: '1'})
                        .end(function (err, res) {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('issued');
                            res.body.should.have.property('issuedto').eql(user._id.toString);
                            done();
                        });
                });
            });
        });
    });
});

