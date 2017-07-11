const User = require('../models/User');
const config = require('./config.test.js');

const assert = require('assert');
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.createConnection(config.MONGODB_URI);

mongoose.Promise = global.Promise;

describe('User model validations', () => {
  User.collection.drop();

  beforeEach( (done) => {
    const joe = new User({
      name: 'joe',
      email: 'mail@mail.com'
    });
    joe.save( (err) => {
      done();
    });
  });

  afterEach( (done) => {
    User.collection.drop();
    done();
  });

  it('Should require unique email', (done) => {
    const jane = new User({ 
      name: 'jane',
      email: 'mail@mail.com',
    })
    .save()
      .then()
      .catch((err) => {
          assert(err.message.includes('duplicate key error'));
          done();
      })
  });
  
  it('Should require valid email', (done) => {
    const jane = new User({ 
      name: 'jane',
      email: 'mm.'
    });
    const validationResult = jane.validateSync();
    const message = validationResult.errors.email.message;
    assert(message === 'Email must be valid');
    done()
  });

  it('Should require name to be more than 2 chars', (done) => {
    const jo = new User({ 
      name: 'jo',
      email: 'jo@mail.com'
    });
    const validationResult = jo.validateSync();
    const message = validationResult.errors.name.message;
    assert(message === 'Name must be valid length');
    done()
  });

  it('Should require name to be less then 100 chars', (done) => {
    const jo = new User({ 
      name: 'j'.repeat(100),
      email: 'jo@mail.com'
    });
    const validationResult = jo.validateSync();
    const message = validationResult.errors.name.message;
    assert(message === 'Name must be valid length');
    done()
  });

});
