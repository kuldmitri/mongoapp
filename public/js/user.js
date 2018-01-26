$('#Create').click((e) => {
  //  e.preventDefault();
  const form = document.forms['createUser'];
  const number = form.elements['number'].value;
  const name = form.elements['name'].value;
  const mail = form.elements['mail'].value;

  (name) ? $('#nameValid').hide() : $('#nameValid').show();
  (number) ? $('#numberValid').hide() : $('#numberValid').show();
  (mail) ? $('#mailValid').hide() : $('#mailValid').show();
  if (!name || !number || !mail) return;

  $.ajax({
    url: 'users/add',
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
      number: number,
      name: name,
      mail: mail
    }),
    success: function(result) {
      $('#searchUsers').triggerHandler('click');
    },
    error: function(error) {

      alert(error.responseText);
    }
  });
});

$('#cleanSearch').click((e) => {
  const form = document.forms['searchBar'];
  form.elements['searchName'].value = '';
  form.elements['searchNumber'].value = '';
  form.elements['searchMail'].value = '';
});

$('body').on('click', '.deleteLink', function() {
  const id = this.id;
  deleteUser(id);
});

$('#searchUsers').click((e) => {
  const form = document.forms['searchBar'];
  const name = form.elements['searchName'].value;
  const number = form.elements['searchNumber'].value;
  const mail = form.elements['searchMail'].value;

  $.ajax({
    url: '/users/find',
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
      name: name,
      number: number,
      mail: mail
    }),
    success: function(users) {
      data.users = users;
      console.log(users);
      $('#search').html(template(data));
    },
    error: function(error) {
      alert(error.responseText);
    }
  });
});

function deleteUser(id) {
  $.ajax({
    url: 'users/delete',
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
      id: id
    }),
    success: function(result) {
      $('#searchUsers').triggerHandler('click');
    },
    error: function(error) {
      alert(error.responseText);
    }
  });
}

const data = {};
const template = Handlebars.compile($('#template').html());
$('#searchUsers').triggerHandler('click');
