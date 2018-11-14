'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { isEmpty } from 'lodash';

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
    var options, page, result, reject, trace, captureOption, hooks, screenshotResult;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('middleware: capture');
            options = ctx.options, page = ctx.page, result = ctx.result, reject = ctx.reject, trace = ctx.trace;
            captureOption = options.captureOption, hooks = options.hooks;
            _context.t0 = hooks.beforeCapture;

            if (!_context.t0) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return hooks.beforeCapture(ctx);

          case 7:

            trace.push('start  screenshot');

            screenshotResult = void 0;
            _context.prev = 9;
            _context.next = 12;
            return page.screenshot((0, _extends3.default)({}, captureOption));

          case 12:
            screenshotResult = _context.sent;


            trace.push({
              name: 'screenshot success',
              data: screenshotResult
            });
            _context.next = 21;
            break;

          case 16:
            _context.prev = 16;
            _context.t1 = _context['catch'](9);

            trace.push({
              name: 'screenshot error',
              data: _context.t1
            });
            reject(_context.t1);
            return _context.abrupt('return', false);

          case 21:
            _context.next = 23;
            return page.close();

          case 23:

            trace.push('page close');

            result.data = screenshotResult;

            _context.t2 = hooks.afterCapture;

            if (!_context.t2) {
              _context.next = 29;
              break;
            }

            _context.next = 29;
            return hooks.afterCapture(screenshotResult, ctx);

          case 29:

            next();

          case 30:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[9, 16]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;