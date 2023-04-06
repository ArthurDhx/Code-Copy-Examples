import express from 'express';

import { userMap } from '../db/index.js';

const app = express.Router();
export default app;

// authorization
app.use('/', (req, res, next) => {
  const email = req.user.emails[0].value;
  // doesn't have the right
  if (!userMap.has(email)) {
    res.sendStatus(403);
  } else {
    next();
  }
});

app.get('/progress', (req, res) => {
  const email = req.user.emails[0].value;
  // send the array corresponding to the user
  res.json(userMap.get(email));
});

app.post('/progress', (req, res) => {
  const email = req.user.emails[0].value;
  const checkboxes = userMap.get(email);

  const data = req.body;
  const oldData = checkboxes.find(c => c.stage === data.stage && c.example === data.example);

  const invalidityMessage = validateCheckbox(data, oldData);
  if (invalidityMessage) {
    res.status(400).send(invalidityMessage);
    return;
  }


  if (oldData && typeof oldData.done === 'number' && data.done === true) {
    data.done = oldData.done;
  }
  if (data.done === true) {
    data.done = Date.now();
  }


  for (let i = 0; i < data.extras.length; i = i + 1) {
    if (oldData && typeof oldData.extras[i] === 'number' && data.extras[i] === true) {
      data.extras[i] = oldData.extras[i];
    }
    if (data.extras[i] === true) {
      data.extras[i] = Date.now();
    }
  }

  // if we haven't seen this example, add the data to the user's array,
  // otherwise overwrite the old entry
  if (!oldData) {
    checkboxes.push(data);
  } else {
    oldData.done = data.done;
    oldData.extras = data.extras;
  }

  res.sendStatus(204);
});

function validateCheckbox(newData, oldData) {
  // todo employ json schema?

  if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
    return 'checkbox data must be an object';
  }

  if (!newData.example || typeof newData.example !== 'string') {
    return 'there must be an example string';
  }

  if (!newData.stage || typeof newData.stage !== 'string') {
    return 'there must be a stage string';
  }

  if (typeof newData.done === 'number' && newData.done !== oldData?.done) {
    return 'timestamp mismatch';
  }
}
