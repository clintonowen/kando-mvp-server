# KanDo - Server

<!-- [![NPM Version][npm-image]][npm-url] -->
[![Build Status](https://travis-ci.org/clintonowen/kando-mvp-server.svg?branch=master)](https://travis-ci.org/clintonowen/kando-mvp-server)
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

## [Live App](https://kando-mvp.herokuapp.com)

## More Information
### See: [Client GitHub Repo](https://github.com/clintonowen/kando-mvp-client)

## Main Project Structure

```
kando-mvp-server/
├── models/ (Mongoose)
├── node_modules/ (see "Development Setup")
├── passport/ (Auth strategies)
├── routes/ (Express Routers)
├── test/
├── config.js
├── LICENSE (GNU GPLv3)
├── package.json (NPM dependencies)
├── README.md
└── server.js (Express App)
```

## Development setup

To clone the repo to your local development environment and verify that the test-suite passes, execute the following commands (requires [Node](https://nodejs.org)).

```sh
# Clone the repo
git clone https://github.com/clintonowen/kando-mvp-server.git

# Move into the project directory
cd kando-mvp-server

# Install dependencies (in /node_modules/)
npm i

# Run the test-suite:
npm test

# Run the app:
npm start
```

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- ## Release History

* 0.2.1
    * CHANGE: Update docs (module code remains unchanged)
* 0.2.0
    * CHANGE: Remove `setDefaultXYZ()`
    * ADD: Add `init()`
* 0.1.1
    * FIX: Crash when calling `baz()` (Thanks @GenerousContributorName!)
* 0.1.0
    * The first proper release
    * CHANGE: Rename `foo()` to `bar()`
* 0.0.1
    * Work in progress -->

## Meta

by Clinton Owen – [@CoderClint](https://twitter.com/CoderClint) │ clint@clintonowen.com │ [https://github.com/clintonowen](https://github.com/clintonowen)

Distributed under the GNU GPLv3 License. See ``LICENSE`` for more information.

[https://github.com/yourname/github-link](https://github.com/dbader/) -->

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[wiki]: https://github.com/yourname/yourproject/wiki
