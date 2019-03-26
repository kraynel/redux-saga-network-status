'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BACKOFF = exports.BACKOFF = '@@redux-saga-network-status/BACKOFF';
var BACKOFF_COMPLETE = exports.BACKOFF_COMPLETE = '@@redux-saga-network-status/BACKOFF_COMPLETE';
var COUNT_DOWN = exports.COUNT_DOWN = '@@redux-saga-network-status/COUNT_DOWN';
var NAVIGATOR_OFFLINE = exports.NAVIGATOR_OFFLINE = '@@redux-saga-network-status/NAVIGATOR_OFFLINE';
var NAVIGATOR_ONLINE = exports.NAVIGATOR_ONLINE = '@@redux-saga-network-status/NAVIGATOR_ONLINE';
var PING = exports.PING = '@@redux-saga-network-status/PING';
var PING_CANCEL = exports.PING_CANCEL = '@@redux-saga-network-status/PING_CANCEL';
var PING_FAILURE = exports.PING_FAILURE = '@@redux-saga-network-status/PING_FAILURE';
var PING_PENDING = exports.PING_PENDING = '@@redux-saga-network-status/PING_PENDING';
var PING_SUCCESS = exports.PING_SUCCESS = '@@redux-saga-network-status/PING_SUCCESS';
var START_WATCH_NETWORK_STATUS = exports.START_WATCH_NETWORK_STATUS = '@@redux-saga-network-status/START_WATCH_NETWORK_STATUS';