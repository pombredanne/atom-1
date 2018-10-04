/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @noflow
 */
'use strict';

/* eslint
  comma-dangle: [1, always-multiline],
  prefer-object-spread/prefer-object-spread: 0,
  nuclide-internal/no-commonjs: 0,
  */

const log4js = require('log4js');
const os = require('os');
const pathModule = require('path');

log4js.configure({
  appenders: [
    {
      type: 'file',
      filename: pathModule.join(os.tmpdir(), 'big-dig-vscode.log'),
    },
    {
      type: 'console',
    },
  ],
});

require('../loadTranspiler');
module.exports = require('./extension');
