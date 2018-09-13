'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Task = require('../models/task');
const Column = require('../models/column');

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

/* ========== GET/READ ALL TASKS ========== */
router.get('/', (req, res, next) => {
  // const userId = req.user.id;

  // let filter = { userId };

  Task.find()
    // .sort({ id: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE TASK ========== */
router.post('/', (req, res, next) => {
  const { name, columnId, description } = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!columnId) {
    const err = new Error('Missing `columnId` in request body');
    err.status = 400;
    return next(err);
  }

  const newTask = { name, columnId, description, userId };

  validateColumnId(columnId, userId)
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
  const updateableFields = ['columnId', 'name', 'time', 'description'];

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

  Task.findByIdAndUpdate(id, toUpdate, { new: true })
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

module.exports = router;
