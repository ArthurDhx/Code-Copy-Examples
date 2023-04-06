import express from 'express';
import GoogleAuth from 'simple-google-openid';
import config from '../config.json';

import userApi from './api/user.js';
import adminApi from './api/admin.js';

const app = express();

app.use(GoogleAuth(config.clientId));
app.use('/api', GoogleAuth.guardMiddleware());

app.use(express.static('docs'));
app.use(express.json());

app.use('/api/admin', adminApi);
app.use('/api', userApi);

app.listen(8080, () => { console.log('listening on 8080'); });
