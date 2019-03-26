'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startWatchNetworkStatus = exports.pingSuccess = exports.pingPending = exports.pingFailure = exports.pingCancel = exports.ping = exports.navigatorOnline = exports.navigatorOffline = exports.countDown = exports.backoffComplete = exports.backoff = undefined;

var _reduxActions = require('redux-actions');

var _actionTypes = require('./actionTypes');

var backoff = exports.backoff = (0, _reduxActions.createAction)(_actionTypes.BACKOFF);
var backoffComplete = exports.backoffComplete = (0, _reduxActions.createAction)(_actionTypes.BACKOFF_COMPLETE);
var countDown = exports.countDown = (0, _reduxActions.createAction)(_actionTypes.COUNT_DOWN);
var navigatorOffline = exports.navigatorOffline = (0, _reduxActions.createAction)(_actionTypes.NAVIGATOR_OFFLINE);
var navigatorOnline = exports.navigatorOnline = (0, _reduxActions.createAction)(_actionTypes.NAVIGATOR_ONLINE);
var ping = exports.ping = (0, _reduxActions.createAction)(_actionTypes.PING);
var pingCancel = exports.pingCancel = (0, _reduxActions.createAction)(_actionTypes.PING_CANCEL);
var pingFailure = exports.pingFailure = (0, _reduxActions.createAction)(_actionTypes.PING_FAILURE);
var pingPending = exports.pingPending = (0, _reduxActions.createAction)(_actionTypes.PING_PENDING);
var pingSuccess = exports.pingSuccess = (0, _reduxActions.createAction)(_actionTypes.PING_SUCCESS);
var startWatchNetworkStatus = exports.startWatchNetworkStatus = (0, _reduxActions.createAction)(_actionTypes.START_WATCH_NETWORK_STATUS);