var objectId = require("mongodb").ObjectID;


exports.getBooks = function (req, res) {
    global.db.collection("book").find({}).toArray(function (err, books) {
        res.render('books.hbs', {books: books});
    });
};

exports.hbs = function (req, res) {
    console.log('books.hbs');
    res.render('books.hbs');
};


exports.issueBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    var idAbonent;
    var number = req.body.number;
    var date = new Date();
    date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


    global.db.collection("user").findOne({number: number}, function (err, result) {
        if (!result) {
            res.send(null);
        } else {
            idAbonent = new objectId(result._id);
            db.collection("book").findOneAndUpdate({_id: id}, {
                    $set: {
                        issued: date,
                        issuedto: idAbonent
                    }
                },
                {returnOriginal: false}, function (err, result) {
                    if (err) return res.status(400).send();
                    var book = result.value;
                    res.send(book);
                    console.log(result);
                });
        }
    });
};

exports.returnBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    global.db.collection("book").findOneAndUpdate({_id: id}, {$set: {issued: null, issuedto: null}},
        {returnOriginal: false}, function (err, result) {
            if (err) return res.status(400).send();
            var book = result.value;
            res.send(book);
        });
};

exports.findBooks = function (req, res) {
    var name = req.body.name;
    var author = req.body.author;
    global.db.collection("book").find({
        name: new RegExp(name, "i"),
        author: new RegExp(author, "i")
    }).toArray(function (err, books) {
        console.log('find');
        res.send(books);
    });
};

exports.addBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var book = {};
    book.author = req.body.author;
    book.name = req.body.name;
    book.issuedto = req.body.abonent;
    book.issued = req.body.issued;
    global.db.collection("book").insertOne(book, function (err, result) {
        if (err) return res.status(400).send();
        res.send(result.value);
    });
};

exports.deleteBook = function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var id = new objectId(req.body.id);
    global.db.collection("book").findOneAndDelete({_id: id}, function (err, result) {
        if (err) return res.status(400).send();
        var book = result.value;
        res.send(book);
    });
};