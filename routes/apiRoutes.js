const express = require('express');
const router = express.Router();
const middleware = require('../middleware')
const chatkit = require('../tools/chatkit');

router.post('/createuser', (req, res) => {
  const { username } = req.body;
  chatkit
    .createUser({
      id: username,
      name: username,
    })
    .then(() => {
      console.log(`User created: ${username}`);
      res.sendStatus(201);
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`);
        res.sendStatus(200);
      } else {
        res.status(err.status).json(err);
      }
    });
});

router.get('/getme', middleware.isLoggedIn, (req, res) => {
  const user = req.user;
  res.json({ username: user.username });
});

router.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id });
  res.status(authData.status).send(authData.body);
});

module.exports = router;
