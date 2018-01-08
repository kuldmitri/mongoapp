/**
 * Created by dmitr on 08.01.2018.
 */
$("#Create").click(function (e) {
    //  e.preventDefault();
    const form = document.forms["createUser"];
    const number = form.elements["number"].value;
    const name = form.elements["name"].value;
    const mail = form.elements["mail"].value;

    (name) ? $("#nameValid").hide() : $("#nameValid").show();
    (number) ? $("#numberValid").hide() : $("#numberValid").show();
    (mail) ? $("#mailValid").hide() : $("#mailValid").show();
    if (!name || !number || !mail) return;

    $.ajax({
        url: "users/add",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            number: number,
            name: name,
            mail: mail
        }),
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#ShowUsers').triggerHandler('click');
});

$("#ShowUsers").click(function (e) {
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            data.users = users;
            $('#search').html(template(data));
        },
        error: function (error) {
            alert(error.responseText);
        }
    });
});

$("body").on("click", ".deleteLink", function () {
    const id = this.id;
    deleteUser(id);
});

function deleteUser(id) {
    $.ajax({
        url: "users/delete",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: id
        }),
        error: function (error) {
            alert(error.responseText);
        }
    });
    $('#ShowUsers').triggerHandler('click');
}
let data = {};
let template = Handlebars.compile($('#template').html());
$('#ShowUsers').triggerHandler('click');