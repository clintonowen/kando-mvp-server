'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Task = require('../models/task');
const Column = require('../models/column');
const User = require('../models/user');

const router = express.Router();

function validateTaskId(taskId, userId) {
  if (taskId === undefined) {
    const err = new Error('Missing `taskId`');
    err.status = 400;
    return Promise.reject(err);
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const err = new Error('The `taskId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }

  return Task.count({ _id: taskId, userId })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `taskId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
}

function validateUserId(userId) {
  if (userId === undefined) {
    const err = new Error('Missing `userId`');
    err.status = 400;
    return Promise.reject(err);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error('The `userId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }

  return User.count({ _id: userId })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `userId` is not valid');
        err.status = 400;
        return Promise.reject(err);
      }
    });
}

/* ========== GET/READ ALL TASKS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  let filter = { userId };

  validateUserId(userId)
    .then(() => Task.find(filter))
    // .sort({ id: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE TASK ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  validateUserId(userId)
    .then(() => Task.findOne({ _id: id, userId }))
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE TASK ========== */
router.post('/', (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newTask = { name, description, userId };
  

  validateUserId(userId)
    .then(() => Task.create(newTask))
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE TASK ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const toUpdate = {};
  const updateableFields = ['name', 'time', 'description'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Promise.all([
    validateUserId(userId),
    validateTaskId(id, userId)
  ])
    .then(() => Task.findByIdAndUpdate(id, toUpdate, { new: true }))
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE TASK ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  validateUserId(userId)
    .then(() => Task.findOneAndRemove({ _id: id, userId }))
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
