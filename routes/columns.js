'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Column = require('../models/column');
const Task = require('../models/task');
const User = require('../models/user');

const router = express.Router();

function validateColumnId(columnId, userId) {
  if (columnId === undefined) {
    const err = new Error('Missing `columnId`');
    err.status = 400;
    return Promise.reject(err);
  }

  if (!mongoose.Types.ObjectId.isValid(columnId)) {
    const err = new Error('The `columnId` is not valid');
    err.status = 400;
    return Promise.reject(err);
  }

  return Column.count({ _id: columnId, userId })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `columnId` is not valid');
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

/* ========== GET/READ ALL COLUMNS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  let filter = { userId };

  validateUserId(userId)
    .then(() => Column
      .find(filter)
      .populate('tasks')
    )
    // .sort({ id: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE COLUMN ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  validateUserId(userId)
    .then(() => Column.findOne({ _id: id, userId }))
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

/* ========== POST/CREATE COLUMN ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newColumn = { name, userId };

  validateUserId(userId)
    .then(() => Column.create(newColumn))
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE COLUMN ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const toUpdate = {};
  const updateableFields = ['name', 'tasks'];

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
    validateColumnId(id, userId)
  ])
    .then(() => Column.findByIdAndUpdate(id , toUpdate, { new: true }))
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
    .then(() => Column.findOneAndRemove({ _id: id, userId }))
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
