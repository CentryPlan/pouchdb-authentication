'use strict';

var PouchDB = require('pouchdb-memory');
var Authentication = require('../lib');
PouchDB.plugin(Authentication);
var chai = require('chai');
var should = chai.should();
chai.use(require('chai-as-promised'));

var users = ['batman', 'superman', 'green_lantern', 'robin', 'aquaman', 'spiderman'];

describe('users', function () {

  var dbName = 'http://localhost:5984/testdb';

  var db;

  beforeEach(function () {
    db = new PouchDB(dbName);
    return db;
  });
  afterEach(function () {
    return db.logout().then(function () {
      return db.destroy().then(function () {
        var usersUrl = db.getUsersDatabaseUrl();
        var usersDb = new PouchDB(usersUrl);
        // remove the fake users, hopefully we're in the admin party
        return usersDb.allDocs({
          include_docs: true,
          keys: users.map(function (user) {
            return 'org.couchdb.user:' + user;
          })
        }).then(function (res) {
          var rows = res.rows.filter(function (row) {
            return row.doc;
          });
          var docs = rows.map(function (row) {
            row.doc._deleted = true;
            return row.doc;
          });
          return usersDb.bulkDocs({docs: docs});
        });
      });
    });
  });

  it('Test signup', function () {
    return db.signup('batman', 'brucewayne').then(function (res) {
      res.ok.should.equal(true);
      res.id.should.equal('org.couchdb.user:batman');
    });
  });

  it('Test signup conflict', function () {
    return db.signup('superman', 'clarkkent').then(function (res) {
      res.ok.should.equal(true);
      return db.signup('superman', 'notclarkkent').then(function (res) {
        should.not.exist(res);
      }).catch(function (err) {
        err.name.should.equal('conflict');
      });
    });
  });

  it('Test bad signup args', function () {
    return db.signup().catch(function (err) {
      should.exist(err);
    });
  });

  it('Test bad signup args 2', function () {
    return db.signup('green_lantern').catch(function (err) {
      should.exist(err);
    });
  });

  it('Test that admin can change roles', function () {
    var roles = ['sidekick'];
    var newRoles = ['superhero', 'villain'];
    return db.signup('robin', 'dickgrayson', {roles: roles}).then(function (res) {
      res.ok.should.equal(true);
      return db.getUser('robin');
    }).then(function (user) {
      user.roles.should.deep.equal(roles);
    }).then(function () {
      return db.putUser('robin', {roles: newRoles});
    }).then(function (res) {
      res.ok.should.equal(true);
      return db.getUser('robin');
    }).then(function (user) {
      user.roles.should.deep.equal(newRoles);
    }).catch(function (err) {
      should.not.exist(err);
    });
  });

  it('Test that user cannot change roles', function () {
    var roles = ['sidekick'];
    var newRoles = ['superhero', 'villain'];
    // We can't test for initial roles as we are in admin party
    // Let us have faith in CouchDB
    return db.signup('robin', 'dickgrayson', {roles: roles}).then(function (res) {
      res.ok.should.equal(true);
      return db.login('robin', 'dickgrayson');
    }).then(function () {
      return db.getUser('robin');
    }).then(function (user) {
      user.roles.should.deep.equal(roles);
    }).then(function () {
      return db.putUser('robin', {roles: newRoles});
    }).then(function (res) {
      res.ok.should.not.equal(true);
      return db.getUser('robin').then(function (user) {
        user.roles.should.deep.equal(roles);
      });
    }).catch(function (err) {
      should.exist(err);
    });
  });

  it('Test wrong user for getUser', function () {
    return db.signup('robin', 'dickgrayson').then(function () {
      return db.signup('aquaman', 'sleeps_with_fishes');
    }).then(function () {
      return db.login('robin', 'dickgrayson');
    }).then(function () {
      return db.getUser('robin');
    }).then(function (res) {
      res.name.should.equal('robin');
      return db.getUser('aquaman').then(function (res) {
        should.not.exist(res);
      }).catch(function (err) {
        should.exist(err);
        return db.login('aquaman', 'sleeps_with_fishes').then(function () {
          return db.getUser('aquaman').then(function (res) {
            res.name.should.equal('aquaman');
            return db.getSession();
          }).then(function (res) {
            res.userCtx.name.should.equal('aquaman');
            return db.getUser('robin').then(function (res) {
              should.not.exist(res);
            }).catch(function (err) {
              should.exist(err);
            });
          });
        });
      });
    });
  });

  it('Test change password', function () {
    return db.signup('spiderman', 'will-forget').then(function () {
      return db.changePassword('spiderman', 'will-remember').then(function (res) {
        res.ok.should.equal(true);
      }).then(function () {
        return db.login('spiderman', 'will-remember');
      }).then(function (res) {
        res.ok.should.equal(true);
      });
    });
  });

  it('Test change username', function () {
    return db.signup('spiderman', 'will-forget').then(function () {
      return db.changeUsername('spiderman', 'batman').then(function () {
        return db.login('batman', 'will-forget');
      }).then(function (res) {
        res.ok.should.equal(true);
      });
    });
  });

  it('Shouldn\'t change username if new username already exists', function () {
    return db.signup('spiderman', 'will-forget').then(function () {
      return db.signup('batman', 'will-remember');
    }).then(function () {
      return db.changeUsername('spiderman', 'batman');
    }).then(function () {
      throw new Error('shouldn\'t have worked');
    }, function (err) {
      should.exist(err);
    });
  });
});
