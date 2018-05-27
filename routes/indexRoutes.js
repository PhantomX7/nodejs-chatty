const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const middleware = require('../middleware');
const chatkit = require('../tools/chatkit');

router.get('/', (req, res) => {
  res.render('landing', { page: null });
});

router.get('/dashboard', middleware.isLoggedIn, async (req, res) => {
  const joinableRooms = await chatkit.getUserJoinableRooms({
    userId: 'phantom',
  });
  const userRooms = await chatkit.getUserRooms({
    userId: 'phantom',
  });
  res.render('dashboard', {
    page: 'dashboard',
    rooms: [...joinableRooms, ...userRooms],
  });
});

router.get('/register', (req, res) => {
  res.render('register', { page: 'register' });
});
//handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  const user = User.register(newUser, req.body.password, function(err, user) {
    console.log(err);
    if (err) {
      return res.render('register', { page: 'register', error: err.message });
    }

    chatkit
      .createUser({
        id: user.username,
        name: user.username,
      })
      .then(() => {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/dashboard');
        });
      })
      .catch(err => {
        if (err.error === 'services/chatkit/user_already_exists') {
          console.log(`User already exists: ${username}`);
        }
      });
  });
});

// show login form
router.get('/login', (req, res) => {
  res.render('login', { page: 'login' });
});
// handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  })
);

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
