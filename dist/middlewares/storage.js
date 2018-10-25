'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('../utils');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    var options, result, reject, captureOption, storage, buffer;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('middleware: storage');
            options = ctx.options, result = ctx.result, reject = ctx.reject;
            captureOption = options.captureOption, storage = options.storage;
            buffer = captureOption.encoding === 'base64' ? result.data : Buffer.from(result.data, 'base64');
            _context.prev = 4;
            _context.t0 = storage.type;
            _context.next = _context.t0 === 'filesystem' ? 8 : _context.t0 === 'qiniu' ? 12 : _context.t0 === 'custom' ? 16 : 21;
            break;

          case 8:
            _context.next = 10;
            return (0, _utils.storageImageToPath)(buffer, storage, captureOption);

          case 10:
            result.output = _context.sent;
            return _context.abrupt('break', 22);

          case 12:
            _context.next = 14;
            return (0, _utils.storageImageToQiuniu)(buffer, storage, captureOption);

          case 14:
            result.output = _context.sent;
            return _context.abrupt('break', 22);

          case 16:
            if (!storage.func) {
              _context.next = 20;
              break;
            }

            _context.next = 19;
            return storage.func(buffer, storage, captureOption);

          case 19:
            result.output = _context.sent;

          case 20:
            return _context.abrupt('break', 22);

          case 21:
            console.log('no storage type, go to next step');

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t1 = _context['catch'](4);

            reject(_context.t1);
            return _context.abrupt('return', false);

          case 28:

            next();

          case 29:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 24]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;