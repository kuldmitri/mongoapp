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


$("#Find").click(function (e) {
    var form = document.forms["findBooks"];
    var name = form.elements["bookName"].value;
    var author = form.elements["author"].value;

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
            if (result == 'Not found') alert('Введенный номер билета не зарегистрирован')
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#All').triggerHandler('click');
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
        }
    });
    $('#All').triggerHandler('click');
}

function deleteBook(id) {
    $.ajax({
        url: "books/delete",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: id
        }),
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#All').triggerHandler('click');
}

$("#Create").click(function (e) {
    let form = document.forms["findBooks"];
    let name = form.elements["bookName"].value;
    let author = form.elements["author"].value;
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
    $('#All').triggerHandler('click');
});


$("body").on("click", ".issueLink", function () {
    var id = this.id;
    var number = prompt('Введите номер читательского билета абонента, которому будет выдана книга');
    issueBook(id, number);
    $('#All').triggerHandler('click');
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
$('#All').triggerHandler('click');