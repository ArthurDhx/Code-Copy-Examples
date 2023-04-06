import express from 'express';

import { admins, userMap } from '../db/index.js';

const app = express.Router();
export default app;

app.use('/', (req, res, next) => {
  const email = req.user.emails[0].value;
  if (admins.includes(email)) {
    next();
  } else {
    res.sendStatus(403);
    res.end();
  }
});

app.get('/users', (req, res) => {
  const users = [];

  for (const [email, checkboxes] of userMap.entries()) {
    const filtered = checkboxes.filter(c => c.done !== false);
    const progress = filtered.length;
    let extraProgress = 0;
    let extraTotal = 0;
    for (const checkbox of filtered) {
      extraTotal += checkbox.extras.length;
      for (const extra of checkbox.extras) {
        if (extra !== false) {
          extraProgress += 1;
        }
      }
    }

    users.push({
      email,
      progress,
      total: checkboxes.length,
      extraProgress,
      extraTotal,
    });
  }

  res.json(users);
});

app.post('/users', (req, res) => {
  const newUsers = req.body;

  for (const newUser of newUsers) {
    if (!userMap.has(newUser)) {
      userMap.set(newUser, []);
    }
  }

  res.sendStatus(204);
});

app.delete('/users/:email', (req, res) => {
  const email = req.params.email;
  userMap.delete(email);
  res.sendStatus(204);
});
