'use strict';

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _utils = require('redux-saga/utils');

var _utils2 = require('../utils');

var _actions = require('../actions');

var _actionTypes = require('../actionTypes');

var _sagas = require('../sagas');

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../actions');
jest.unmock('../actionTypes');
jest.unmock('../sagas');

describe('watchWindowOffline', function () {
  it('should dispatch NAVIGATOR_OFFLINE whenever the `window` \'offline\' event occurs', function () {
    var generator = (0, _sagas.watchWindowOffline)();
    expect(generator.next().value).toEqual((0, _effects.call)(_utils2.once, window, 'offline'));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOffline)()));

    expect(generator.next().value).toEqual((0, _effects.call)(_utils2.once, window, 'offline'));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOffline)()));
  });
});

describe('watchWindowOnline', function () {
  it('should dispatch NAVIGATOR_ONLINE whenever the `window` \'online\' event occurs', function () {
    var generator = (0, _sagas.watchWindowOnline)();
    expect(generator.next().value).toEqual((0, _effects.call)(_utils2.once, window, 'online'));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOnline)()));

    expect(generator.next().value).toEqual((0, _effects.call)(_utils2.once, window, 'online'));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOnline)()));
  });
});

describe('watchNavigatorStatus', function () {
  it('should immediately dispatch NAVIGATOR_ONLINE if `navigator.onLine`', function () {
    var generator = (0, _sagas.watchNavigatorStatus)({ onLine: true });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOnline)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchWindowOnline));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchWindowOffline));
  });

  it('should immediately dispatch NAVIGATOR_OFFLINE if `!navigator.onLine`', function () {
    var generator = (0, _sagas.watchNavigatorStatus)({ onLine: false });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.navigatorOffline)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchWindowOnline));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchWindowOffline));
  });
});

describe('handlePing', function () {
  it('should complete immediately if PING_CANCEL is given', function () {
    var generator = (0, _sagas.handlePing)({ type: _actionTypes.PING_CANCEL });
    expect(generator.next().done).toBe(true);
  });

  it('should ping with `fetch`, then dispatch PING_SUCCESS upon successful response', function () {
    var generator = (0, _sagas.handlePing)({ type: _actionTypes.PING, payload: 'http://example.com/ping' });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingPending)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_reduxSaga.delay, 1000));
    var delayTask = (0, _utils.createMockTask)();
    expect(generator.next(delayTask).value).toEqual((0, _effects.race)({
      ping: (0, _effects.call)(_isomorphicFetch2.default, 'http://example.com/ping'),
      timeout: (0, _effects.call)(_reduxSaga.delay, 5000)
    }));
    expect(generator.next({ ping: { ok: true } }).value).toEqual((0, _effects.put)((0, _actions.pingSuccess)()));
    expect(generator.next().value).toEqual((0, _effects.cancelled)());
    expect(generator.next(false).done).toBe(true);
  });

  it('should ping with `fetch`, then dispatch PING_FAILURE upon HTTP error response', function () {
    var generator = (0, _sagas.handlePing)({ type: _actionTypes.PING, payload: 'http://example.com/ping' });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingPending)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_reduxSaga.delay, 1000));
    var delayTask = (0, _utils.createMockTask)();
    expect(generator.next(delayTask).value).toEqual((0, _effects.race)({
      ping: (0, _effects.call)(_isomorphicFetch2.default, 'http://example.com/ping'),
      timeout: (0, _effects.call)(_reduxSaga.delay, 5000)
    }));
    expect(generator.next({ ping: { ok: false } }).value).toEqual((0, _effects.join)(delayTask));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingFailure)()));
    expect(generator.next().value).toEqual((0, _effects.cancelled)());
    expect(generator.next(false).done).toBe(true);
  });

  it('should ping with `fetch`, then dispatch PING_FAILURE upon generic error', function () {
    var generator = (0, _sagas.handlePing)({ type: _actionTypes.PING, payload: 'http://example.com/ping' });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingPending)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_reduxSaga.delay, 1000));
    var delayTask = (0, _utils.createMockTask)();
    expect(generator.next(delayTask).value).toEqual((0, _effects.race)({
      ping: (0, _effects.call)(_isomorphicFetch2.default, 'http://example.com/ping'),
      timeout: (0, _effects.call)(_reduxSaga.delay, 5000)
    }));
    expect(generator.throw(new Error()).value).toEqual((0, _effects.join)(delayTask));
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingFailure)()));
    expect(generator.next().value).toEqual((0, _effects.cancelled)());
    expect(generator.next(false).done).toBe(true);
  });

  it('should ping with `fetch`, then immediately dispatch PING_FAILURE upon cancellation', function () {
    var generator = (0, _sagas.handlePing)({ type: _actionTypes.PING, payload: 'http://example.com/ping' });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.pingPending)()));
    expect(generator.next().value).toEqual((0, _effects.fork)(_reduxSaga.delay, 1000));
    var delayTask = (0, _utils.createMockTask)();
    expect(generator.next(delayTask).value).toEqual((0, _effects.race)({
      ping: (0, _effects.call)(_isomorphicFetch2.default, 'http://example.com/ping'),
      timeout: (0, _effects.call)(_reduxSaga.delay, 5000)
    }));
    expect(generator.return().value).toEqual((0, _effects.cancelled)());
    expect(generator.next(true).value).toEqual((0, _effects.put)((0, _actions.pingFailure)()));
    expect(generator.next().done).toBe(true);
  });
});

describe('watchPing', function () {
  it('should call `handlePing` upon PING actions', function () {
    var generator = (0, _sagas.watchPing)();
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING, _actionTypes.PING_CANCEL]));
    var action = { type: _actionTypes.PING, payload: 'http://example.com/ping' };
    expect(generator.next(action).value).toEqual((0, _effects.fork)(_sagas.handlePing, action));
  });

  it('should call `handlePing` upon PING_CANCEL actions', function () {
    var generator = (0, _sagas.watchPing)();
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING, _actionTypes.PING_CANCEL]));
    var action = { type: _actionTypes.PING_CANCEL };
    expect(generator.next(action).value).toEqual((0, _effects.fork)(_sagas.handlePing, action));
  });
});

describe('handleBackoff', function () {
  it('should complete immediately if a payload of 0 is given', function () {
    var generator = (0, _sagas.handleBackoff)({ type: _actionTypes.BACKOFF, payload: 0 });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.backoffComplete)()));
    expect(generator.next().done).toBe(true);
  });

  it('should dispatch COUNT_DOWN for each second of the given payload', function () {
    var generator = (0, _sagas.handleBackoff)({ type: _actionTypes.BACKOFF, payload: 2000 });

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.countDown)(1000)));
    expect(generator.next().value).toEqual((0, _effects.call)(_reduxSaga.delay, 1000));
    // 1000

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.countDown)(1000)));
    expect(generator.next().value).toEqual((0, _effects.call)(_reduxSaga.delay, 1000));
    // 0

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.backoffComplete)()));
    expect(generator.next().done).toBe(true);
  });

  it('should dispatch COUNT_DOWN using the remaining milliseconds if any', function () {
    var generator = (0, _sagas.handleBackoff)({ type: _actionTypes.BACKOFF, payload: 2500 });

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.countDown)(1000)));
    expect(generator.next().value).toEqual((0, _effects.call)(_reduxSaga.delay, 1000));
    // 1500

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.countDown)(1000)));
    expect(generator.next().value).toEqual((0, _effects.call)(_reduxSaga.delay, 1000));
    // 500

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.countDown)(500)));
    expect(generator.next().value).toEqual((0, _effects.call)(_reduxSaga.delay, 500));
    // 0

    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.backoffComplete)()));
    expect(generator.next().done).toBe(true);
  });
});

describe('watchBackoff', function () {
  it('should call `handleBackoff` upon BACKOFF actions', function () {
    var generator = (0, _sagas.watchBackoff)();
    expect(generator.next().value).toEqual((0, _effects.take)(_actionTypes.BACKOFF));
    expect(generator.next({ type: _actionTypes.BACKOFF }).value).toEqual((0, _effects.fork)(_sagas.handleBackoff, { type: _actionTypes.BACKOFF }));
  });
});

describe('getNextFibonacciValue', function () {
  it('should compute the next fibonacci value with no randomization factor', function () {
    expect((0, _sagas.getNextFibonacciValue)(0, 2, 3)).toBe(5);
    expect((0, _sagas.getNextFibonacciValue)(0, 3, 5)).toBe(8);
    expect((0, _sagas.getNextFibonacciValue)(0, 5, 8)).toBe(13);
  });

  it('should compute the next fibonacci value with a randomization factor of 1', function () {
    var originalRandom = Math.random;
    try {
      Math.random = function () {
        return 0;
      };
      expect((0, _sagas.getNextFibonacciValue)(1, 2, 3)).toBe(5);

      Math.random = function () {
        return 0.4;
      };
      expect((0, _sagas.getNextFibonacciValue)(1, 2, 3)).toBe(7);

      Math.random = function () {
        return 1;
      };
      expect((0, _sagas.getNextFibonacciValue)(1, 2, 3)).toBe(10);
    } finally {
      Math.random = originalRandom;
    }
  });

  it('should compute the next fibonacci value with a randomization factor of 0.5', function () {
    var originalRandom = Math.random;
    try {
      Math.random = function () {
        return 0;
      };
      expect((0, _sagas.getNextFibonacciValue)(0.5, 2, 3)).toBe(5);

      Math.random = function () {
        return 0.4;
      };
      expect((0, _sagas.getNextFibonacciValue)(0.5, 2, 3)).toBe(6);

      Math.random = function () {
        return 1;
      };
      expect((0, _sagas.getNextFibonacciValue)(0.5, 2, 3)).toBe(7.5);
    } finally {
      Math.random = originalRandom;
    }
  });
});

describe('fibonacciPoll', function () {
  it('should dispatch a PING, then complete upon PING_SUCCESS', function () {
    var generator = (0, _sagas.fibonacciPoll)('http://example.com/ping', {
      randomizationFactor: 0.5,
      initialDelay: 500,
      maxDelay: 10000
    });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_SUCCESS:
    expect(generator.next({ type: _actionTypes.PING_SUCCESS }).value).toEqual((0, _effects.cancelled)());
    expect(generator.next(false).done).toBe(true);
  });

  it('should dispatch a PING, then upon PING_FAILURE, ' + 'BACKOFF, then ping again upon BACKOFF_COMPLETE', function () {
    var generator = (0, _sagas.fibonacciPoll)('http://example.com/ping', {
      randomizationFactor: 0.5,
      initialDelay: 500,
      maxDelay: 10000
    });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(500)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));

    // Simulate BACKOFF_COMPLETE:
    var winner = { backoffComplete: { type: _actionTypes.BACKOFF_COMPLETE } };
    expect(generator.next(winner).value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
  });

  it('should dispatch a PING, then upon PING_FAILURE, ' + 'BACKOFF, then upon PING, wait for PING_SUCCESS or PING_FAILURE', function () {
    var generator = (0, _sagas.fibonacciPoll)('http://example.com/ping', {
      randomizationFactor: 0.5,
      initialDelay: 500,
      maxDelay: 10000
    });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(500)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));

    // Simulate PING:
    var winner = { ping: { type: _actionTypes.PING } };
    expect(generator.next(winner).value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));
  });

  it('should delay subsequent ping attempts using increasing fibonacci time intervals', function () {
    var generator = (0, _sagas.fibonacciPoll)('http://example.com/ping', {
      randomizationFactor: 0,
      initialDelay: 500,
      maxDelay: 10000
    });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(500)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));

    // Simulate BACKOFF_COMPLETE:
    var winner = { backoffComplete: { type: _actionTypes.BACKOFF_COMPLETE } };
    expect(generator.next(winner).value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(500)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));

    // Simulate BACKOFF_COMPLETE:
    winner = { backoffComplete: { type: _actionTypes.BACKOFF_COMPLETE } };
    expect(generator.next(winner).value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(1000)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));

    // Simulate BACKOFF_COMPLETE:
    winner = { backoffComplete: { type: _actionTypes.BACKOFF_COMPLETE } };
    expect(generator.next(winner).value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate PING_FAILURE:
    expect(generator.next({ type: _actionTypes.PING_FAILURE }).value).toEqual((0, _effects.put)((0, _actions.backoff)(1500)));
    expect(generator.next().value).toEqual((0, _effects.race)({
      backoffComplete: (0, _effects.take)(_actionTypes.BACKOFF_COMPLETE),
      ping: (0, _effects.take)(_actionTypes.PING)
    }));
  });

  it('should dispatch PING_CANCEL upon cancellation', function () {
    var generator = (0, _sagas.fibonacciPoll)('http://example.com/ping', {
      randomizationFactor: 0,
      initialDelay: 500,
      maxDelay: 10000
    });
    expect(generator.next().value).toEqual((0, _effects.put)((0, _actions.ping)('http://example.com/ping')));
    expect(generator.next().value).toEqual((0, _effects.take)([_actionTypes.PING_SUCCESS, _actionTypes.PING_FAILURE]));

    // Simulate cancellation
    expect(generator.return().value).toEqual((0, _effects.cancelled)());
    expect(generator.next(true).value).toEqual((0, _effects.put)((0, _actions.pingCancel)()));
  });
});

describe('watchNetworkStatus', function () {
  it('should wait for a START_WATCH_NETWORK_STATUS action, then fork the network saga tasks', function () {
    var generator = (0, _sagas2.default)();
    expect(generator.next().value).toEqual((0, _effects.take)(_actionTypes.START_WATCH_NETWORK_STATUS));
    expect(generator.next({
      type: _actionTypes.START_WATCH_NETWORK_STATUS,
      payload: 'http://example.com/ping'
    }).value).toEqual((0, _effects.fork)(_sagas.watchBackoff));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchPing));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchNavigatorStatus, window.navigator));
  });

  it('should begin polling when NAVIGATOR_ONLINE, and stop when NAVIGATOR_OFFLINE', function () {
    var generator = (0, _sagas2.default)();
    expect(generator.next().value).toEqual((0, _effects.take)(_actionTypes.START_WATCH_NETWORK_STATUS));
    expect(generator.next({
      type: _actionTypes.START_WATCH_NETWORK_STATUS,
      payload: 'http://example.com/ping'
    }).value).toEqual((0, _effects.fork)(_sagas.watchBackoff));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchPing));
    expect(generator.next().value).toEqual((0, _effects.fork)(_sagas.watchNavigatorStatus, window.navigator));
    expect(generator.next().value).toEqual((0, _effects.take)(_actionTypes.NAVIGATOR_ONLINE));
    expect(generator.next({ type: _actionTypes.NAVIGATOR_ONLINE }).value).toEqual((0, _effects.fork)(_sagas.fibonacciPoll, 'http://example.com/ping', {
      randomizationFactor: 0.5,
      initialDelay: 500,
      maxDelay: 10000
    }));
    var pollTask = (0, _utils.createMockTask)();
    expect(generator.next(pollTask).value).toEqual((0, _effects.take)(_actionTypes.NAVIGATOR_OFFLINE));

    // Simulate NAVIGATOR_OFFLINE action:
    expect(generator.next({ type: _actionTypes.NAVIGATOR_OFFLINE }).value).toEqual((0, _effects.cancel)(pollTask));
    // It should wait for another NAVIGATOR_ONLINE:
    expect(generator.next().value).toEqual((0, _effects.take)(_actionTypes.NAVIGATOR_ONLINE));

    // Simulate NAVIGATOR_ONLINE action:
    expect(generator.next({ type: _actionTypes.NAVIGATOR_ONLINE }).value).toEqual((0, _effects.fork)(_sagas.fibonacciPoll, 'http://example.com/ping', {
      randomizationFactor: 0.5,
      initialDelay: 500,
      maxDelay: 10000
    }));
  });
});