'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _actionTypes = require('../actionTypes');

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../actionTypes');
jest.unmock('../reducer');

var DEFAULT_STATE = {
  hasBeenOnline: false,
  hasDetectedNetworkStatus: false,
  isNavigatorOnline: false,
  isOnline: false,
  isPinging: false,
  msUntilNextPing: 0,
  pingError: null
};

describe('network reducer', function () {
  it('has the correct default state', function () {
    var state = (0, _reducer2.default)(undefined, {
      type: 'OTHER'
    });
    expect(state).toEqual(DEFAULT_STATE);
  });

  it('resets `msUntilNextPing` upon BACKOFF', function () {
    var state = (0, _reducer2.default)(undefined, {
      type: _actionTypes.BACKOFF,
      payload: 5000
    });
    expect(state.msUntilNextPing).toBe(5000);
  });

  it('counts down `msUntilNextPing` upon COUNT_DOWN', function () {
    var state = (0, _reducer2.default)((0, _extends3.default)({}, DEFAULT_STATE, {
      msUntilNextPing: 5000
    }), {
      type: _actionTypes.COUNT_DOWN,
      payload: 2300
    });
    expect(state.msUntilNextPing).toBe(2700);
  });

  it('sets `hasDetectedNetworkStatus = true`, ' + '`isNavigatorOnline = isOnline = false` upon NAVIGATOR_OFFLINE', function () {
    var state = (0, _reducer2.default)((0, _extends3.default)({}, DEFAULT_STATE, {
      hasDetectedNetworkStatus: false,
      isNavigatorOnline: true,
      isOnline: true
    }), {
      type: _actionTypes.NAVIGATOR_OFFLINE
    });
    expect(state.hasDetectedNetworkStatus).toBe(true);
    expect(state.isNavigatorOnline).toBe(false);
    expect(state.isOnline).toBe(false);
  });

  it('sets `isNavigatorOnline = true` upon NAVIGATOR_ONLINE', function () {
    var state = (0, _reducer2.default)((0, _extends3.default)({}, DEFAULT_STATE, {
      isNavigatorOnline: false
    }), {
      type: _actionTypes.NAVIGATOR_ONLINE
    });
    expect(state.isNavigatorOnline).toBe(true);
  });

  it('sets `isPinging = true` upon PING_PENDING', function () {
    var state = (0, _reducer2.default)((0, _extends3.default)({}, DEFAULT_STATE, {
      isPinging: false
    }), {
      type: _actionTypes.PING_PENDING
    });
    expect(state.isPinging).toBe(true);
  });

  it('sets `hasDetectedNetworkStatus`, `isOnline`, `isPinging`, and `pingError` upon PING_FAILURE', function () {
    var state = (0, _reducer2.default)(undefined, {
      type: _actionTypes.PING_FAILURE,
      error: true,
      payload: new Error('uh oh')
    });
    expect(state.hasDetectedNetworkStatus).toBe(true);
    expect(state.isOnline).toBe(false);
    expect(state.isPinging).toBe(false);
    expect(state.pingError.message).toEqual('uh oh');
  });

  it('sets `hasBeenOnline`, `hasDetectedNetworkStatus`, ' + '`isOnline`, and `isPinging` upon PING_SUCCESS', function () {
    var state = (0, _reducer2.default)(undefined, {
      type: _actionTypes.PING_SUCCESS
    });
    expect(state.hasBeenOnline).toBe(true);
    expect(state.hasDetectedNetworkStatus).toBe(true);
    expect(state.isOnline).toBe(true);
    expect(state.isPinging).toBe(false);
  });
});