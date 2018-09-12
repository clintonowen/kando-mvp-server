// node ./utils/seed-database.js
// DATABASE_URL=mLab_URI node ./utils/seed-database.js

'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');

const Column = require('../models/column');
const Task = require('../models/task');
const User = require('../models/user');

const seedColumns = require('../db/seed/columns');
const seedTasks = require('../db/seed/tasks');
const seedUsers = require('../db/seed/users');

console.log(`Connecting to mongodb at ${DATABASE_URL}`);
mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([

      Task.insertMany(seedTasks),

      Column.insertMany(seedColumns),
      Column.createIndexes(),

      User.insertMany(seedUsers),
      User.createIndexes(),
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    return mongoose.disconnect();
  });
