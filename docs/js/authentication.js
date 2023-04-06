async function onSignIn(googleUser) {
  const idToken = googleUser.getAuthResponse().id_token;

  const signout = document.querySelector('#signout');
  signout.classList.remove('hidden');

  const response = await fetch('/api/progress', {
    credentials: 'same-origin',
    method: 'GET',
    headers: { Authorization: 'Bearer ' + idToken },
  });
  if (response.ok) {
    showCheckboxes();
    const errorMessage = document.querySelector('#errorUser');
    errorMessage.classList.add('hidden');

    const examplesData = await response.json();

    for (const exampleData of examplesData) {
      const section = document.querySelector(`section[data-stage="${exampleData.stage}"][data-example="${exampleData.example}"]`);

      const mainChk = section.querySelector('.checkbox:not(.extra)');
      // exampleData is false or a time stamp (number)
      mainChk.checked = exampleData.done !== false;

      const chks = section.querySelectorAll('.checkbox.extra');
      for (let i = 0; i < exampleData.extras.length; i += 1) {
        const extra = exampleData.extras[i];
        if (chks[i]) {
          // extra is false or a time stamp (number)
          chks[i].checked = extra !== false;
        } else {
          console.warn('server returned too many extras', exampleData);
          break;
        }
      }
    }
  } else {
    hideCheckboxes();
  }
}

function signOut() {
  const signout = document.querySelector('#signout');
  signout.classList.add('hidden');

  hideCheckboxes();
  const errorMessage = document.querySelector('#errorUser');
  errorMessage.classList.remove('hidden');

  const auth2 = window.gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function showCheckboxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of checkboxes) {
    checkbox.classList.remove('hidden');
  }
}

function hideCheckboxes() {
  const checkboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of checkboxes) {
    checkbox.classList.add('hidden');
  }
}

function checkCheckbox(e) {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const data = extractProgressData(e.target);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + idToken,
    },
    body: JSON.stringify(data),
  };

  fetch('/api/progress', options);
}

function extractProgressData(el) {
  const section = el.closest('section');

  const data = {
    stage: section.dataset.stage,
    example: section.dataset.example,
    done: false,
    extras: [],
  };

  // find the main checkbox
  const mainChk = section.querySelector('.checkbox:not(.extra)');
  data.done = mainChk.checked;

  // find checkboxes for the extra challenges
  const chks = section.querySelectorAll('.checkbox.extra');
  for (const chk of chks) {
    data.extras.push(chk.checked);
  }

  return data;
}


function init() {
  const checkboxes = document.querySelectorAll('.checkbox');
  for (const checkbox of checkboxes) {
    checkbox.addEventListener('click', checkCheckbox);
  }

  document.querySelector('#signout').addEventListener('click', signOut);
}

// this function is used by the google sign-in and sign-out buttons
window.onSignIn = onSignIn;

window.addEventListener('load', init);
