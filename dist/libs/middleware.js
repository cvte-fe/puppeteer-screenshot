'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaCompose = require('koa-compose');

var _koaCompose2 = _interopRequireDefault(_koaCompose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (middlewares) {
  var isArray = Array.isArray;
  if (!isArray(middlewares)) {
    throw new TypeError('middlewares stack must be an array');
  }

  var middlewareCollection = [];
  middlewares = _lodash2.default.sortBy(middlewares, ['priority']);

  middlewares.forEach(function (item) {
    var enable = item.enable,
        module = item.module,
        priority = item.priority;

    if (!_lodash2.default.isInteger(priority) || priority <= 0) {
      throw new TypeError('middleware priority must be positive and an integer.');
    }
    /*
      enabled(boolean): whether to use this middleware
      module(function): what this middleware runs for
      priority(number): the priority when the middlware runs
      adaptor(string|array): what adaptors this middleware is applied to.
        If not set, the default will run the middleware.
    */
    if (enable === true) {
      if (typeof module === 'function') {
        middlewareCollection.push(module);
      } else {
        throw new TypeError('middleware module must be a function');
      }
    }
  });
  return (0, _koaCompose2.default)(middlewareCollection);
};

module.exports = exports.default;