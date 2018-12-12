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
    var options, result, trace, closeBrowser, hooks, pageOption, browser, page, view, html, url, type, isSetRequestInterception, interceptedRequest;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // console.log('middleware: initPage');

            options = ctx.options, result = ctx.result, trace = ctx.trace, closeBrowser = ctx.closeBrowser;
            hooks = options.hooks, pageOption = options.pageOption;
            _context.next = 4;
            return ctx.getBrowser();

          case 4:
            browser = _context.sent;


            trace.push('start create page');

            _context.t0 = hooks.beforeCreatePage;

            if (!_context.t0) {
              _context.next = 10;
              break;
            }

            _context.next = 10;
            return hooks.beforeCreatePage(browser, ctx);

          case 10:
            _context.next = 12;
            return browser.newPage();

          case 12:
            page = _context.sent;
            _context.t1 = hooks.afterCreatePage;

            if (!_context.t1) {
              _context.next = 17;
              break;
            }

            _context.next = 17;
            return hooks.afterCreatePage(page, browser, ctx);

          case 17:

            trace.push('created page');

            view = options.view, html = options.html, url = options.url, type = options.type, isSetRequestInterception = options.isSetRequestInterception, interceptedRequest = options.interceptedRequest;
            _context.next = 21;
            return page.setRequestInterception(isSetRequestInterception);

          case 21:

            trace.push('setRequestInterception');

            // 用于拦截一些请求
            if ((0, _lodash.isFunction)(interceptedRequest)) {
              page.on('request', interceptedRequest);
            }

            page.on('requestfailed', function (interceptedRequest) {
              var failData = {
                url: interceptedRequest.url(),
                errorText: interceptedRequest.failure().errorText
              };

              trace.push({
                name: 'requestfailed',
                data: failData
              });

              result.requestError.push(failData);
            });

            page.on('pageerror', function (err) {
              trace.push({
                name: 'pageerror',
                data: err
              });
              result.pageError = err;
            });

            page.on('error', function (error) {
              console.error('page error');

              trace.push({
                name: 'page crash',
                data: error
              });

              try {
                closeBrowser();
                page.close();
              } catch (e) {
                console.log('close page fail', e);
              }

              ctx.reject({
                ctx: ctx,
                error: error
              });
            });

            ctx.browser = browser;
            ctx.page = page;

            if ((0, _lodash.isEmpty)(view)) {
              _context.next = 31;
              break;
            }

            _context.next = 31;
            return page.setViewport(view);

          case 31:
            if (!(type === 'html')) {
              _context.next = 37;
              break;
            }

            page.on('load', function () {
              trace.push('onload');
              next();
            });

            _context.next = 35;
            return page.setContent(html);

          case 35:
            _context.next = 54;
            break;

          case 37:
            if (!(type === 'url')) {
              _context.next = 53;
              break;
            }

            _context.prev = 38;
            _context.next = 41;
            return page.goto(url, pageOption);

          case 41:
            trace.push('goto url: ' + url);
            next();
            _context.next = 51;
            break;

          case 45:
            _context.prev = 45;
            _context.t2 = _context['catch'](38);

            trace.push({
              name: 'goto url error: ' + url,
              data: _context.t2
            });
            result.openPageError = _context.t2;
            console.log('error and go to next step:', _context.t2);
            next();

          case 51:
            _context.next = 54;
            break;

          case 53:
            throw new Error('unknown type: ' + type);

          case 54:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[38, 45]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = exports.default;