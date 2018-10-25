'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import { isEmpty } from 'lodash';

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    var options, page, result, reject, captureOption, hooks, screenshotResult;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('middleware: capture');
            options = ctx.options, page = ctx.page, result = ctx.result, reject = ctx.reject;
            captureOption = options.captureOption, hooks = options.hooks;
            _context.t0 = hooks.beforeCapture;

            if (!_context.t0) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return hooks.beforeCapture(ctx);

          case 7:
            screenshotResult = void 0;
            _context.prev = 8;
            _context.next = 11;
            return page.screenshot(_extends({}, captureOption));

          case 11:
            screenshotResult = _context.sent;
            _context.next = 18;
            break;

          case 14:
            _context.prev = 14;
            _context.t1 = _context['catch'](8);

            reject(_context.t1);
            return _context.abrupt('return', false);

          case 18:
            _context.next = 20;
            return page.close();

          case 20:

            result.data = screenshotResult;

            _context.t2 = hooks.afterCapture;

            if (!_context.t2) {
              _context.next = 25;
              break;
            }

            _context.next = 25;
            return hooks.afterCapture(screenshotResult, ctx);

          case 25:

            next();

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[8, 14]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;