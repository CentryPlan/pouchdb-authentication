# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/pouchdb-community/pouchdb-authentication/compare/v0.5.5...v1.0.0) (2017-12-17)


### Bug Fixes

* **ajax:** correctly handle Basic authentication ([19f547b](https://github.com/pouchdb-community/pouchdb-authentication/commit/19f547b)), closes [#109](https://github.com/pouchdb-community/pouchdb-authentication/issues/109)
* **browser:** plugin registration bug introduced in ES6 move ([cd12d06](https://github.com/pouchdb-community/pouchdb-authentication/commit/cd12d06))
* **nodejs:** correctly set ajax request's body for login ([5b61b00](https://github.com/pouchdb-community/pouchdb-authentication/commit/5b61b00)), closes [#127](https://github.com/pouchdb-community/pouchdb-authentication/issues/127) [#130](https://github.com/pouchdb-community/pouchdb-authentication/issues/130) [#141](https://github.com/pouchdb-community/pouchdb-authentication/issues/141)
* **package:** update pouchdb to version ~6.4.0 ([f0c45b5](https://github.com/pouchdb-community/pouchdb-authentication/commit/f0c45b5))
* **putUser:** ensure reserved words are enforced in metadata ([b1ea26a](https://github.com/pouchdb-community/pouchdb-authentication/commit/b1ea26a))
* **urls:** replace base URL regex with url-parse ([7472135](https://github.com/pouchdb-community/pouchdb-authentication/commit/7472135)), closes [#150](https://github.com/pouchdb-community/pouchdb-authentication/issues/150) [#160](https://github.com/pouchdb-community/pouchdb-authentication/issues/160)
* **urls:** respect DB prefix for base URL if set ([d600426](https://github.com/pouchdb-community/pouchdb-authentication/commit/d600426)), closes [#158](https://github.com/pouchdb-community/pouchdb-authentication/issues/158)


### Features

* **admins:** add signUpAdmin and deleteAdmin ([cb8991d](https://github.com/pouchdb-community/pouchdb-authentication/commit/cb8991d))
* **package:** move to ES6 with rollup build ([b420ad4](https://github.com/pouchdb-community/pouchdb-authentication/commit/b420ad4))
* **putUser:** take roles in account ([7f44c9e](https://github.com/pouchdb-community/pouchdb-authentication/commit/7f44c9e)), closes [#114](https://github.com/pouchdb-community/pouchdb-authentication/issues/114)
* **users:** add deleteUser ([8e187e7](https://github.com/pouchdb-community/pouchdb-authentication/commit/8e187e7))


### BREAKING CHANGES

* **putUser:** In both signUp and putUser, '_id', '_rev', 'name',
'type', 'roles', 'password', 'password_scheme', 'iterations',
'derived_key', 'salt' are now all reserved words, and 'metadata' is
not a reserved word anymore.
