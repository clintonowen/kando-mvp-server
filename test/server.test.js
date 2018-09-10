'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { app } = require('../server');

chai.use(chaiHttp);

describe('Reality', () => {

  it('should verify the one universal truth', () => {
    expect(true).to.be.true;
  });

  it('should verify the laws of mathematics', () => {
    expect(2 + 2).to.equal(4);
    expect(2 - 2).to.equal(0);
    expect(2 * 2).to.equal(4);
    expect(2 / 2).to.equal(1);
  });

});

describe('Environment', () => {

  it('should verify that NODE_ENV is set to "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });

});

describe('404 handler', () => {

  it('should respond with 404 when given a bad path', () => {
    return chai.request(app)
      .get('/bad/path')
      .then(res => {
        expect(res).to.have.status(404);
        expect(res).to.be.json;
        expect(res.body).to.have.keys(['status', 'message']);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Not Found');
      });
  });

});
