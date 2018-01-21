$("#All").click(function (e) {
    $.ajax({
        url: "/books",
        type: "GET",
        contentType: "application/json",
        success: function (books) {
            data.books = books;
            $('#search').html(template(data));
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
});

$("#searchBooks").click(function (e) {
    const form = document.forms["searchBar"];
    const name = form.elements["searchName"].value;
    const author = form.elements["searchAuthor"].value;

    $.ajax({
        url: "/books/find",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: name,
            author: author
        }),
        success: function (books) {
            data.books = books;
            $('#search').html(template(data));
            console.log(data);
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
});

$("#findAll").click(function (e) {
    $.ajax({
        url: "/books/all",
        contentType: "application/json",
        method: "GET",
        success: function (books) {
            data.books = books;
            $('#search').html(template(data));
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
});

function issueBook(base, id, number) {
    console.log(base);
    $.ajax({
        url: "/books/issue",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            base: base,
            id: id,
            number: number
        }),
        success: function (result) {
            $('#searchBooks').triggerHandler('click');
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
}

function returnBook(base, id) {
    $.ajax({
        url: "books/return",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            base: base,
            id: id
        }),
        error: function (error) {
            alert(error.responseText);
        }, success: function (result) {
            $('#searchBooks').triggerHandler('click');
        }
    });
}

function deleteBook(base, id) {
    $.ajax({
        url: "books/delete",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            base: base,
            id: id
        }),
        success: function (result) {
            $('#searchBooks').triggerHandler('click');
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
}

$("#cleanSearch").click(function (e) {
    const form = document.forms["searchBar"];
    form.elements["searchName"].value = '';
    form.elements["searchAuthor"].value = '';
});

$("#Create").click(function (e) {
    const form = document.forms["findBooks"];
    const name = form.elements["bookName"].value;
    const author = form.elements["author"].value;
    let base ='';
    if (form.elements["MongoDB"].checked) {
        base = 'Mongo'
    } else {
        base = 'CSV'
    }
    (name) ? $("#nameValid").hide() : $("#nameValid").show();
    (author) ? $("#authorValid").hide() : $("#authorValid").show();
    if (!name || !author) return;
    $.ajax({
        url: "/books/add",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            book: {
                name: name,
                author: author,
            },
            base: base
        }),
        success: function (result) {
            $('#searchBooks').triggerHandler('click');
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
});

$("body").on("click", ".issueLink", function () {
    let id = this.id;
    let base = this.title;
    let number = prompt('Введите номер читательского билета абонента, которому будет выдана книга');
    console.log(base, id, number);
    issueBook(base, id, number);
    $('#searchBooks').triggerHandler('click');
});

$("body").on("click", ".returnLink", function () {
    let base = this.title;
    let id = this.id;
    returnBook(base, id);
});

$("body").on("click", ".deleteLink", function () {
    let base = this.title;
    let id = this.id;
    deleteBook(base, id);
});

let data = {};
let template = Handlebars.compile($('#template').html());
$('#searchBooks').triggerHandler('click');