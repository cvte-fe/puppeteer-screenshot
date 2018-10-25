'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
    var options, page, view, html, url, type;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('middleware: loadPage');
            options = ctx.options, page = ctx.page;
            view = options.view, html = options.html, url = options.url, type = options.type;

            if ((0, _lodash.isEmpty)(view)) {
              _context.next = 6;
              break;
            }

            _context.next = 6;
            return page.setViewport(view);

          case 6:
            if (!(type === 'html')) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return page.setContent(html);

          case 9:
            _context.next = 17;
            break;

          case 11:
            if (!(type === 'url')) {
              _context.next = 16;
              break;
            }

            _context.next = 14;
            return page.goto(url);

          case 14:
            _context.next = 17;
            break;

          case 16:
            throw new Error('unknown type: ' + type);

          case 17:

            next();

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;