"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hgRepositoryForEditor = hgRepositoryForEditor;

function _nuclideVcsBase() {
  const data = require("../../nuclide-vcs-base");

  _nuclideVcsBase = function () {
    return data;
  };

  return data;
}

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
function hgRepositoryForEditor(editor) {
  const repo = (0, _nuclideVcsBase().repositoryForPath)(editor.getPath() || '');

  if (!repo || repo.getType() !== 'hg') {
    return null;
  }

  return repo;
}