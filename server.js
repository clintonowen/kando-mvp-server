'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');

const columnsRouter = require('./routes/columns');
const tasksRouter = require('./routes/tasks');

// Create an Express application
const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
  })
);

// Allow requests from client domain/origin
app.use(cors({
  origin: CLIENT_ORIGIN
}));

// Parse request body
app.use(express.json());

// Mount routers
app.use('/api/columns', columnsRouter);
app.use('/api/tasks', tasksRouter);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
    if (err.name !== 'FakeError') { console.log(err); }
  }
});

// Listen for incoming connections
if (require.main === module) {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(DATABASE_URL, { useNewUrlParser: true })
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on port ${this.address().port}`);
  }).on('error', err => {
    console.error('Express failed to start');
    console.error(err);
  });
}

// Export for testing
module.exports = { app };
