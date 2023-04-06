import * as SortTable from './components/sort-table.js';


function init() {
  document.querySelector('#signout').addEventListener('click', signOut);
  document.querySelector('#textAreaButton').addEventListener('click', sendText);

  const table = document.querySelector('#userTable');
  SortTable.instrumentSortableTable(table, 0, 'asc');
}

function signOut() {
  const auth2 = window.gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  hideAdminContent();
}

function clearElement(element) {
  element.textContent = '';
}

function addToTable(table, userData) {
  const tr = document.createElement('tr');

  const email = document.createElement('td');
  email.textContent = userData.email;

  const progress = document.createElement('td');
  progress.textContent = `${userData.progress} done`;
  if (userData.total - userData.progress > 0) {
    progress.textContent += `, ${userData.total - userData.progress} unchecked`;
  }

  const extraProgress = document.createElement('td');
  extraProgress.textContent = `${userData.extraProgress} out of ${userData.extraTotal}`;

  const buttonTd = document.createElement('td');

  const button = document.createElement('button');
  button.id = userData.email;
  button.textContent = 'Delete';
  button.addEventListener('click', deleteUser);

  buttonTd.append(button);

  tr.append(email, progress, extraProgress, buttonTd);
  table.append(tr);
}

async function sendText() {
  const textArea = document.querySelector('#addUser');

  const emails = textArea.value.split('\n');
  const trimmed = emails.map(email => email.trim()).filter(e => e !== '');

  if (!validateEmails(trimmed)) return;

  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken,
    },
    body: JSON.stringify(trimmed),
  };

  const response = await fetch('/api/admin/users', options);
  if (response.ok) {
    // clear out the input now that it's submitted
    textArea.value = '';

    await loadTable();
  } else {
    const errorDiv = document.querySelector('#errorEmail');
    errorDiv.textContent = 'error submitting data';
    console.error('error submitting data', response);
  }
}

function validateEmails(emails) {
  const errorDiv = document.querySelector('#errorEmail');
  clearElement(errorDiv);

  const re = new RegExp(/^[^@ ]+@[^@ ]+\.[^@ ]+$/);

  let retval = true;
  for (const email of emails) {
    if (!re.test(email)) {
      const errorPar = document.createElement('p');
      errorPar.textContent = email + ' is not a valid email!';
      errorDiv.append(errorPar);
      retval = false;
    }
  }

  return retval;
}

async function deleteUser(e) {
  const email = e.target.id;
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const options = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + idToken,
    },
  };

  await fetch('/api/admin/users/' + email, options);
  await loadTable();
}

async function loadTable() {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const tbody = document.querySelector('#tableBody');
  if (idToken !== undefined) {
    const response = await fetch('/api/admin/users', {
      credentials: 'same-origin',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + idToken },
    });
    const pError = document.querySelector('#errorAdmin');
    clearElement(pError);
    if (response.ok) {
      clearElement(tbody);
      const usersData = await response.json();
      for (const userData of usersData) {
        addToTable(tbody, userData);
      }
      showAdminContent();
    } else {
      pError.textContent = 'You are not an admin';
      hideAdminContent();
    }

    // after reload, sort the table again
    SortTable.sortTable(tbody.parentElement);
  }
}

function showAdminContent() {
  const element = document.querySelector('#adminContent');
  element.classList.remove('hidden');
}

function hideAdminContent() {
  const element = document.querySelector('#adminContent');
  element.classList.add('hidden');
}

window.onSignIn = loadTable;
window.addEventListener('load', init);
