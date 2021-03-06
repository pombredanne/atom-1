"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeNodeComponent = void 0;

var React = _interopRequireWildcard(require("react"));

function _classnames() {
  const data = _interopRequireDefault(require("classnames"));

  _classnames = function () {
    return data;
  };

  return data;
}

function _nullthrows() {
  const data = _interopRequireDefault(require("nullthrows"));

  _nullthrows = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
const INDENT_IN_PX = 10;
const INDENT_PER_LEVEL_IN_PX = 15;
const DOWN_ARROW = '\uF0A3';
const RIGHT_ARROW = '\uF078';
const SPINNER = '\uF087';

/**
 * Represents one entry in a TreeComponent.
 */
class TreeNodeComponent extends React.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this._onClick = event => {
      // $FlowFixMe
      if ((0, _nullthrows().default)(this._arrow).contains(event.target)) {
        this.props.onClickArrow(event, this.props.node);
      } else {
        this.props.onClick(event, this.props.node);
      }
    }, this._onDoubleClick = event => {
      this.props.onDoubleClick(event, this.props.node);
    }, this._onMouseDown = event => {
      this.props.onMouseDown(event, this.props.node);
    }, _temp;
  }

  render() {
    const rowClassNameObj = {
      // Support for selectors in the "file-icons" package.
      // @see {@link https://atom.io/packages/file-icons|file-icons}
      'entry file list-item': true,
      'nuclide-tree-component-item': true,
      'nuclide-tree-component-selected': this.props.isSelected
    };

    if (this.props.rowClassName) {
      rowClassNameObj[this.props.rowClassName] = true;
    }

    const itemStyle = {
      paddingLeft: INDENT_IN_PX + this.props.depth * INDENT_PER_LEVEL_IN_PX
    };
    let arrow;

    if (this.props.isContainer) {
      if (this.props.isExpanded) {
        if (this.props.isLoading) {
          arrow = React.createElement("span", {
            className: "nuclide-tree-component-item-arrow-spinner"
          }, SPINNER);
        } else {
          arrow = DOWN_ARROW;
        }
      } else {
        arrow = RIGHT_ARROW;
      }
    }

    return React.createElement("div", {
      className: (0, _classnames().default)(rowClassNameObj),
      style: itemStyle,
      onClick: this._onClick,
      onDoubleClick: this._onDoubleClick,
      onMouseDown: this._onMouseDown
    }, React.createElement("span", {
      className: "nuclide-tree-component-item-arrow",
      ref: el => {
        this._arrow = el;
      }
    }, arrow), this.props.labelElement != null ? this.props.labelElement : React.createElement("span", {
      className: this.props.labelClassName // `data-name` is support for selectors in the "file-icons" package.
      // @see {@link https://atom.io/packages/file-icons|file-icons}
      ,
      "data-name": this.props.label,
      "data-path": this.props.path
    }, this.props.label));
  }

}

exports.TreeNodeComponent = TreeNodeComponent;