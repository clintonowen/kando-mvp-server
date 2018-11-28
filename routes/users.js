'use strict';

const express = require('express');
const passport = require('passport');

const jwtStrategy = require('../passport/jwt');

const User = require('../models/user');
const Column = require('../models/column');
const Task = require('../models/task');

const router = express.Router();

passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

/* ========== POST/CREATE A USER ========== */
router.post('/', (req, res, next) => {

  const requiredFields = ['username', 'password', 'email'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    let err;
    if (missingField === 'email') {
      err = new Error('Please provide an email');
    } else {
      err = new Error(`Please provide a '${missingField}'`);
    }
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = missingField;
    return next(err);
  }

  const stringFields = ['username', 'password', 'email'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = new Error(`${nonStringField.charAt(0).toUpperCase()}${nonStringField.slice(1)} must be type: String`);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = nonStringField;
    return next(err);
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error('Cannot start or end with whitespace');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = nonTrimmedField;
    return next(err);
  }

  const sizedFields = {
    username: { min: 6, max: 30 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    const field = tooSmallField || tooLargeField;
    const min = sizedFields[field].min;
    const max = sizedFields[field].max;
    const err = new Error(`Use between ${min} and ${max} characters for your ${field}`);
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = field;
    return next(err);
  }
  
  // Username and password were validated as pre-trimmed
  let { username, password, email, demo } = req.body;
  email = email.trim();

  const usernameRegExp = new RegExp(/^[a-zA-Z0-9_]+$/);

  if (!demo && !usernameRegExp.test(username)) {
    const err = new Error('Sorry, only letters (a-z), numbers (0-9), and underscores ( _ ) are allowed');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = 'username';
    return next(err);
  }
  
  const emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  
  if (!emailRegExp.test(email)) {
    const err = new Error('Please enter a valid email address');
    err.status = 422;
    err.reason = 'ValidationError';
    err.location = 'email';
    return next(err);
  }

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        email
      };
      return User.create(newUser);
    })
    .then(user => {
      let defaultColumns = [
        {name: 'To Do', userId: user.id},
        {name: 'Do Today', userId: user.id},
        {name: 'In Progress', userId: user.id},
        {name: 'Done', userId: user.id}
      ];
      if (demo) {
        Task.insertMany([
          {
            '_id': '999999999999999999999901',
            'name': 'Scan receipts',
            'time': 0,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999902',
            'name': 'Weekly meal planning',
            'time': 0,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999903',
            'name': 'File tax return',
            'time': 0,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999904',
            'name': 'Post garage sale advertisement',
            'time': 0,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999905',
            'name': 'Prepare for interview',
            'time': 0,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999906',
            'name': 'Schedule an oil change',
            'time': 1380000,
            'userId': user.id
          },
          {
            '_id': '999999999999999999999907',
            'name': 'Work on budget',
            'time': 2300000,
            'userId': user.id
          }
        ]
        );
        defaultColumns = [
          {
            name: 'To Do',
            userId: user.id,
            tasks: [
              '999999999999999999999901',
              '999999999999999999999902',
              '999999999999999999999903'
            ]
          },
          {
            name: 'Do Today',
            userId: user.id,
            'tasks': [
              '999999999999999999999904',
              '999999999999999999999905'
            ]
          },
          {
            name: 'In Progress',
            userId: user.id,
            'tasks': [
              '999999999999999999999906'
            ]
          },
          {
            name: 'Done',
            userId: user.id,
            'tasks': [
              '999999999999999999999907'
            ]
          }
        ];
      }
      return Promise.all([
        Promise.resolve(user),
        Column.insertMany(defaultColumns)
      ]);
    })
    .then(result => {
      const user = result[0];
      return res.status(201).location(`/api/users/${user.id}`).json(user);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 422;
        err.reason = 'ValidationError';
        err.location = 'username';
      }
      next(err);
    });
});

/* ========== DELETE A USER ========== */
router.delete('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;

  Promise.all([
    Column.deleteMany({ userId }),
    Task.deleteMany({ userId }),
    User.findByIdAndRemove(userId)
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
