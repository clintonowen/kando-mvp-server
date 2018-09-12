'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Column = require('../models/column');

const router = express.Router();

/* ========== GET/READ ALL COLUMNS ========== */
router.get('/', (req, res, next) => {
  // const userId = req.user.id;

  // let filter = { userId };

  Column.find()
    // .sort({ id: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE TASK ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  // const userId = req.user.id;

  const toUpdate = {};
  const updateableFields = ['name'];

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

  Column.findByIdAndUpdate(id, toUpdate, { new: true })
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
