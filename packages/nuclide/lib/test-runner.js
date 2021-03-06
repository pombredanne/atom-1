"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _testHelpers() {
  const data = require("../modules/nuclide-commons/test-helpers");

  _testHelpers = function () {
    return data;
  };

  return data;
}

function _patchAtomConsole() {
  const data = _interopRequireDefault(require("../modules/nuclide-commons/patch-atom-console"));

  _patchAtomConsole = function () {
    return data;
  };

  return data;
}

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */
// eslint-disable-next-line nuclide-internal/prefer-nuclide-uri
(0, _patchAtomConsole().default)();

const integrationTestsDir = _path.default.join(__dirname, '../spec');

var _default = async function _default(params) {
  const isIntegrationTest = params.testPaths.some(testPath => testPath.startsWith(integrationTestsDir));
  const isApmTest = !isIntegrationTest; // It's assumed that all of the tests belong to the same package.

  const pkg = getPackage(params.testPaths[0]);

  if (pkg == null) {
    throw new Error(`Couldn't find a parent "package.json" for ${params.testPaths[0]}`);
  }

  const nuclideConfig = pkg.atomConfig || pkg.nuclide && pkg.nuclide.config;
  const statusCode = await params.legacyTestRunner({
    logFile: params.logFile,
    headless: params.headless,
    testPaths: params.testPaths,

    buildAtomEnvironment(buildEnvParams) {
      const atomGlobal = params.buildAtomEnvironment(buildEnvParams);

      if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
        // circumvent React Dev Tools console warning
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
      }

      if (isIntegrationTest) {
        jasmine.getEnv().beforeEach(() => {
          // Integration tests have to activate all Nuclide packages.
          jasmine.getEnv().defaultTimeoutInterval = 20000; // If we're running integration tests in parallel, double the timeout.

          if (process.env.SANDCASTLE === '1') {
            jasmine.getEnv().defaultTimeoutInterval *= 2;
          } // `atom.confirm` blocks Atom and stops the integration tests.


          spyOn(atomGlobal, 'confirm'); // Ensure 3rd-party packages are not installed via the
          // 'atom-package-deps' package when the 'nuclide' package is activated.
          // They are assumed to be already in ~/.atom/packages. js_test_runner.py
          // handles installing them during automated testing.

          atomGlobal.config.set('nuclide.installRecommendedPackages', false);
        });
        jasmine.getEnv().afterEach(() => {
          if (atomGlobal.confirm.calls.length) {
            const details = atomGlobal.confirm.argsForCall.map((args, i) => `call #${i} with ${JSON.stringify(args)}`);
            throw new Error('atom.confirm was called.\n' + details);
          }
        });
      }

      if (isApmTest && nuclideConfig) {
        jasmine.getEnv().beforeEach(() => {
          // Since the UP loader creates the config for all feature packages,
          // and it doesn't load for unit tests, it's necessary to manually
          // construct any default config that they define.
          Object.keys(nuclideConfig).forEach(key => {
            atomGlobal.config.setSchema(`${pkg.name}.${key}`, nuclideConfig[key]);
          });
        });
      }

      return atomGlobal;
    }

  });
  await new Promise(resolve => {
    const temp = require('temp');

    if (statusCode === 0) {
      (0, _testHelpers().writeCoverage)(); // Atom intercepts "process.exit" so we have to do our own manual cleanup.

      temp.cleanup((err, stats) => {
        resolve();

        if (err && err.message !== 'not tracking') {
          // eslint-disable-next-line no-console
          console.log('temp.cleanup() failed.', err);
        }
      });
    } else {
      // When the test fails, we keep the temp contents for debugging.
      temp.track(false);
      resolve();
    }
  });
  return statusCode;
};

exports.default = _default;

function getPackage(start) {
  let current = _path.default.resolve(start);

  while (true) {
    const filename = _path.default.join(current, 'package.json');

    if (_fs.default.existsSync(filename)) {
      return JSON.parse(_fs.default.readFileSync(filename, 'utf8'));
    } else {
      const next = _path.default.join(current, '..');

      if (next === current) {
        return null;
      } else {
        current = next;
      }
    }
  }
}