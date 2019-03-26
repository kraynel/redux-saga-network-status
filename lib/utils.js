"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.once = once;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a promise which resolves
 * once a particular event is dispatched by the given DOM EventTarget.
 * @param  {EventTarget}  target An EventTarget
 * @param  {string}       type   The type of event
 * @return {Promise<any>}        Resolves with the event once it's dispatched
 */
function once(target, type) {
  return new _promise2.default(function (resolve) {
    var listener = function listener(e) {
      target.removeEventListener(type, listener);
      resolve(e);
    };
    target.addEventListener(type, listener);
  });
}