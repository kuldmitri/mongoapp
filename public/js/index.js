/**
 * Created by dmitr on 08.01.2018.
 */
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

function issueBook(id, number) {
    $.ajax({
        url: "/books/issue",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
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

function returnBook(id) {
    $.ajax({
        url: "books/return",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: id
        }),
        error: function (error) {
            alert(error.responseText);
        }, success: function (result) {
            $('#searchBooks').triggerHandler('click');
        }
    });
}

function deleteBook(id) {
    $.ajax({
        url: "books/delete",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
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
    (name) ? $("#nameValid").hide() : $("#nameValid").show();
    (author) ? $("#authorValid").hide() : $("#authorValid").show();
    if (!name || !author) return;
    $.ajax({
        url: "/books/add",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: name,
            author: author
        }),
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#searchBooks').triggerHandler('click');
});


$("#addBooks").click(function (e) {
    const form = document.forms["findBooks"];
    const name = form.elements["bookName"].value;
    const author = form.elements["author"].value;
    (name) ? $("#nameValid").hide() : $("#nameValid").show();
    (author) ? $("#authorValid").hide() : $("#authorValid").show();
    if (!name || !author) return;
    $.ajax({
        url: "/books/add",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: name,
            author: author
        }),
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#searchBooks').triggerHandler('click');
});


$("body").on("click", ".issueLink", function () {
    var id = this.id;
    var number = prompt('Введите номер читательского билета абонента, которому будет выдана книга');
    issueBook(id, number);
    $('#searchBooks').triggerHandler('click');
});

$("body").on("click", ".returnLink", function () {
    var id = this.id;
    returnBook(id);
});

$("body").on("click", ".deleteLink", function () {
    var id = this.id;
    deleteBook(id);
});

var data = {};
var template = Handlebars.compile($('#template').html());
$('#searchBooks').triggerHandler('click');