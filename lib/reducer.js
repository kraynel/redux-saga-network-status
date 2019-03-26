'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _handleActions;

var _reduxActions = require('redux-actions');

var _actionTypes = require('./actionTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * The network reducer tracks the state of connectivity to the network
 * and to the server
 */

var DEFAULT_STATE = {
  // True when we have been online at least once
  hasBeenOnline: false,
  // Whether we have pinged the server at least once
  hasDetectedNetworkStatus: false,
  // Whether the browser is connected to a network
  isNavigatorOnline: false,
  // Whether the server is reachable over the network
  isOnline: false,
  // Whether we are currently pinging the server
  isPinging: false,
  // Number of milliseconds until the next ping attempt
  msUntilNextPing: 0,
  // The most recent ping error
  pingError: null
};

exports.default = (0, _reduxActions.handleActions)((_handleActions = {}, (0, _defineProperty3.default)(_handleActions, _actionTypes.BACKOFF, function (state, _ref) {
  var msUntilNextPing = _ref.payload;
  return (0, _extends3.default)({}, state, {
    msUntilNextPing: msUntilNextPing
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.COUNT_DOWN, function (state, _ref2) {
  var intervalLength = _ref2.payload;
  return (0, _extends3.default)({}, state, {
    msUntilNextPing: state.msUntilNextPing - intervalLength
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.NAVIGATOR_OFFLINE, function (state) {
  return (0, _extends3.default)({}, state, {
    hasDetectedNetworkStatus: true,
    isNavigatorOnline: false,
    isOnline: false
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.NAVIGATOR_ONLINE, function (state) {
  return (0, _extends3.default)({}, state, {
    isNavigatorOnline: true
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.PING_PENDING, function (state) {
  return (0, _extends3.default)({}, state, {
    isPinging: true
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.PING_FAILURE, function (state, _ref3) {
  var pingError = _ref3.payload;
  return (0, _extends3.default)({}, state, {
    hasDetectedNetworkStatus: true,
    isOnline: false,
    isPinging: false,
    pingError: pingError
  });
}), (0, _defineProperty3.default)(_handleActions, _actionTypes.PING_SUCCESS, function (state) {
  return (0, _extends3.default)({}, state, {
    hasBeenOnline: true,
    hasDetectedNetworkStatus: true,
    isOnline: true,
    isPinging: false
  });
}), _handleActions), DEFAULT_STATE);