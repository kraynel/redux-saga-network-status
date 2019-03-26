'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.watchWindowOnline = watchWindowOnline;
exports.watchWindowOffline = watchWindowOffline;
exports.watchNavigatorStatus = watchNavigatorStatus;
exports.handlePing = handlePing;
exports.watchPing = watchPing;
exports.handleBackoff = handleBackoff;
exports.watchBackoff = watchBackoff;
exports.getNextFibonacciValue = getNextFibonacciValue;
exports.fibonacciPoll = fibonacciPoll;
exports.default = watchNetworkStatus;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _actions = require('./actions');

var _actionTypes = require('./actionTypes');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(watchWindowOnline),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(watchWindowOffline),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(watchNavigatorStatus),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(handlePing),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(watchPing),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(handleBackoff),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(watchBackoff),
    _marked8 = /*#__PURE__*/_regenerator2.default.mark(fibonacciPoll),
    _marked9 = /*#__PURE__*/_regenerator2.default.mark(watchNetworkStatus);

function watchWindowOnline() {
  return _regenerator2.default.wrap(function watchWindowOnline$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 7;
            break;
          }

          _context.next = 3;
          return (0, _effects.call)(_utils.once, window, 'online');

        case 3:
          _context.next = 5;
          return (0, _effects.put)((0, _actions.navigatorOnline)());

        case 5:
          _context.next = 0;
          break;

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function watchWindowOffline() {
  return _regenerator2.default.wrap(function watchWindowOffline$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!true) {
            _context2.next = 7;
            break;
          }

          _context2.next = 3;
          return (0, _effects.call)(_utils.once, window, 'offline');

        case 3:
          _context2.next = 5;
          return (0, _effects.put)((0, _actions.navigatorOffline)());

        case 5:
          _context2.next = 0;
          break;

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

/**
 * redux-saga task which continuously dispatches NAVIGATOR_ONLINE and NAVIGATOR_OFFLINE
 * actions as the browser's network status changes. An initial NAVIGATOR_ONLINE / NAVIGATOR_OFFLINE
 * action is dispatched based on `window.navigator.onLine` to establish the initial state.
 * @param {Object} navigator A `window.navigator` instance
 */
function watchNavigatorStatus(navigator) {
  return _regenerator2.default.wrap(function watchNavigatorStatus$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!navigator.onLine) {
            _context3.next = 5;
            break;
          }

          _context3.next = 3;
          return (0, _effects.put)((0, _actions.navigatorOnline)());

        case 3:
          _context3.next = 7;
          break;

        case 5:
          _context3.next = 7;
          return (0, _effects.put)((0, _actions.navigatorOffline)());

        case 7:
          _context3.next = 9;
          return (0, _effects.fork)(watchWindowOnline);

        case 9:
          _context3.next = 11;
          return (0, _effects.fork)(watchWindowOffline);

        case 11:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

/**
 * redux-saga task which performs a GET request to the given URL and dispatches
 * PING_SUCCESS or PING_FAILURE depending on the response.
 * @param {object} action The PING or PING_CANCEL action
 */
function handlePing(_ref) {
  var type = _ref.type,
      pingUrl = _ref.payload;

  var delayTask, _ref2, response;

  return _regenerator2.default.wrap(function handlePing$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(type === _actionTypes.PING_CANCEL)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt('return');

        case 2:
          _context4.next = 4;
          return (0, _effects.put)((0, _actions.pingPending)());

        case 4:
          _context4.next = 6;
          return (0, _effects.fork)(_reduxSaga.delay, 1000);

        case 6:
          delayTask = _context4.sent;
          _context4.prev = 7;
          _context4.next = 10;
          return (0, _effects.race)({
            ping: (0, _effects.call)(_isomorphicFetch2.default, pingUrl),
            // Timeout if ping takes longer than 5 seconds
            timeout: (0, _effects.call)(_reduxSaga.delay, 5000)
          });

        case 10:
          _ref2 = _context4.sent;
          response = _ref2.ping;

          if (!response) {
            _context4.next = 24;
            break;
          }

          if (!response.ok) {
            _context4.next = 18;
            break;
          }

          _context4.next = 16;
          return (0, _effects.put)((0, _actions.pingSuccess)());

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.next = 20;
          return (0, _effects.join)(delayTask);

        case 20:
          _context4.next = 22;
          return (0, _effects.put)((0, _actions.pingFailure)());

        case 22:
          _context4.next = 26;
          break;

        case 24:
          _context4.next = 26;
          return (0, _effects.put)((0, _actions.pingFailure)());

        case 26:
          _context4.next = 34;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4['catch'](7);
          _context4.next = 32;
          return (0, _effects.join)(delayTask);

        case 32:
          _context4.next = 34;
          return (0, _effects.put)((0, _actions.pingFailure)());

        case 34:
          _context4.prev = 34;
          _context4.next = 37;
          return (0, _effects.cancelled)();

        case 37:
          if (!_context4.sent) {
            _context4.next = 40;
            break;
          }

          _context4.next = 40;
          return (0, _effects.put)((0, _actions.pingFailure)());

        case 40:
          return _context4.finish(34);

        case 41:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this, [[7, 28, 34, 41]]);
}

/**
 * redux-saga task which pings the given URL whenever a PING action is dispatched,
 * or cancels the ping in progress when a PING_CANCEL action is dispatched.
 * @param  {string} pingUrl URL which will be pinged
 */
function watchPing() {
  return _regenerator2.default.wrap(function watchPing$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.delegateYield((0, _reduxSaga.takeLatest)([_actionTypes.PING, _actionTypes.PING_CANCEL], handlePing), 't0', 1);

        case 1:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

/**
 * redux-saga task which will dispatch COUNT_DOWN actions at regular intervals until
 * the given time has elapsed, upon which a BACKOFF_COMPLETE action is dispatched.
 * @param {object} action
 *   A BACKOFF action
 * @param {number} action.payload
 *   Total number of milliseconds during which COUNT_DOWN actions will be dispatched.
 */
function handleBackoff(_ref3) {
  var ms = _ref3.payload;
  var intervalLength, intervalCount, i;
  return _regenerator2.default.wrap(function handleBackoff$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          intervalLength = 1000; // count down by one second at a time

          intervalCount = Math.floor(ms / intervalLength);
          i = 0;

        case 3:
          if (!(i < intervalCount)) {
            _context6.next = 11;
            break;
          }

          _context6.next = 6;
          return (0, _effects.put)((0, _actions.countDown)(intervalLength));

        case 6:
          _context6.next = 8;
          return (0, _effects.call)(_reduxSaga.delay, intervalLength);

        case 8:
          i++;
          _context6.next = 3;
          break;

        case 11:
          if (!(ms % intervalLength > 0)) {
            _context6.next = 16;
            break;
          }

          _context6.next = 14;
          return (0, _effects.put)((0, _actions.countDown)(ms % intervalLength));

        case 14:
          _context6.next = 16;
          return (0, _effects.call)(_reduxSaga.delay, ms % intervalLength);

        case 16:
          _context6.next = 18;
          return (0, _effects.put)((0, _actions.backoffComplete)());

        case 18:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

/**
 * redux-saga task which starts the backoff sequence whenever a BACKOFF action is dispatched.
 */
function watchBackoff() {
  return _regenerator2.default.wrap(function watchBackoff$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.delegateYield((0, _reduxSaga.takeLatest)(_actionTypes.BACKOFF, handleBackoff), 't0', 1);

        case 1:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7, this);
}

/**
 * Get the next value in a fibonacci sequence based on the previous and current values
 * and a randomisation factor.
 * @param  {number} randomizationFactor
 *   A number >= 0 and <= 1 which controls the amount by which the next value will be increased
 *   by a random number.
 *   A value of 1 means the next value will be multiplied by (1 + Math.random()).
 *   A value of 0.5 means the next value will be multiplied by (1 + 0.5 * Math.random()).
 *   A value of 0 means the next value will be multiplied by 1 (i.e. no randomization)
 *
 * @param  {number} previous The previous value in the sequence
 * @param  {number} current  The current value in the sequence
 * @return {number}          The next value in the sequence
 */
function getNextFibonacciValue(randomizationFactor, previous, current) {
  var next = previous + current;
  return next + next * randomizationFactor * Math.random();
}

/**
 * redux-saga task which will continuously ping the given URL, and upon successful ping,
 * will dispatch an ONLINE action and complete.
 * In order to reduce network congestion when many users reconnect simultaneously,
 * we use a fibonacci backoff sequence to delay subsequent pings: if a ping fails, the next ping
 * is delayed at increasing time intervals, plus a randomisation factor in an effort to
 * evenly distribute reconnect attempts across time.
 * @param {string} pingUrl
 *   URL which will be pinged
 * @param {object} options
 *   Options
 * @param {number} options.randomizationFactor
 *   Fibonacci randomization factor (see `getNextFibonacciValue`)
 * @param {number} initialDelay
 *   Initial number of milliseconds to delay the next ping
 * @param {number} maxDelay
 *   Maximum number of milliseconds to delay the next ping
 */
function fibonacciPoll(pingUrl, _ref4) {
  var randomizationFactor = _ref4.randomizationFactor,
      initialDelay = _ref4.initialDelay,
      maxDelay = _ref4.maxDelay;
  var previousDelay, currentDelay, action, winner, nextDelay;
  return _regenerator2.default.wrap(function fibonacciPoll$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          previousDelay = 0;
          currentDelay = initialDelay;
          _context8.prev = 2;
          _context8.next = 5;
          return (0, _effects.put)((0, _actions.ping)(pingUrl));

        case 5:
          if (!true) {
            _context8.next = 24;
            break;
          }

          _context8.next = 8;
          return (0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]);

        case 8:
          action = _context8.sent;

          if (!(action.type === _actionTypes.PING_SUCCESS)) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt('return');

        case 11:
          _context8.next = 13;
          return (0, _effects.put)((0, _actions.backoff)(currentDelay));

        case 13:
          _context8.next = 15;
          return (0, _effects.race)({
            backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
            ping: (0, _effects.take)(_actionTypes.PING)
          });

        case 15:
          winner = _context8.sent;

          if (!winner.backoffComplete) {
            _context8.next = 19;
            break;
          }

          _context8.next = 19;
          return (0, _effects.put)((0, _actions.ping)(pingUrl));

        case 19:
          nextDelay = getNextFibonacciValue(randomizationFactor, previousDelay, currentDelay);

          previousDelay = currentDelay;
          currentDelay = Math.min(nextDelay, maxDelay);
          _context8.next = 5;
          break;

        case 24:
          _context8.prev = 24;
          _context8.next = 27;
          return (0, _effects.cancelled)();

        case 27:
          if (!_context8.sent) {
            _context8.next = 30;
            break;
          }

          _context8.next = 30;
          return (0, _effects.put)((0, _actions.pingCancel)());

        case 30:
          return _context8.finish(24);

        case 31:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked8, this, [[2,, 24, 31]]);
}

/**
 * redux-saga task which continuously query the browser's network status and the connectivity
 * to the server, dispatching actions to the network reducer when events occur.
 */
function watchNetworkStatus() {
  var _ref5, pingUrl, pollTask;

  return _regenerator2.default.wrap(function watchNetworkStatus$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return (0, _effects.take)(_actionTypes.START_WATCH_NETWORK_STATUS);

        case 2:
          _ref5 = _context9.sent;
          pingUrl = _ref5.payload;
          _context9.next = 6;
          return (0, _effects.fork)(watchBackoff);

        case 6:
          _context9.next = 8;
          return (0, _effects.fork)(watchPing);

        case 8:
          _context9.next = 10;
          return (0, _effects.fork)(watchNavigatorStatus, window.navigator);

        case 10:
          if (!true) {
            _context9.next = 22;
            break;
          }

          _context9.next = 13;
          return (0, _effects.take)(_actionTypes.NAVIGATOR_ONLINE);

        case 13:
          _context9.next = 15;
          return (0, _effects.fork)(fibonacciPoll, pingUrl, {
            randomizationFactor: 0.5,
            initialDelay: 500,
            maxDelay: 10000
          });

        case 15:
          pollTask = _context9.sent;
          _context9.next = 18;
          return (0, _effects.take)(_actionTypes.NAVIGATOR_OFFLINE);

        case 18:
          _context9.next = 20;
          return (0, _effects.cancel)(pollTask);

        case 20:
          _context9.next = 10;
          break;

        case 22:
        case 'end':
          return _context9.stop();
      }
    }
  }, _marked9, this);
}