'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * screenshot class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

// import loadPageMiddleware from './middlewares/loadPage';


var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('./utils');

var _lodash = require('lodash');

var _middleware = require('./libs/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _initPage = require('./middlewares/initPage');

var _initPage2 = _interopRequireDefault(_initPage);

var _capture = require('./middlewares/capture');

var _capture2 = _interopRequireDefault(_capture);

var _storage = require('./middlewares/storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

global.Promise = require('bluebird');

var ScreenShot = function () {
  function ScreenShot(options) {
    var _this = this;

    _classCallCheck(this, ScreenShot);

    this.browser = '';
    this.options = {
      browser: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      },
      capture: {
        optimize: true,
        storage: {
          prefix: 'capture-',
          type: 'filesystem',
          path: _path2.default.join(process.cwd(), './screenshot')
        },
        pageOption: {
          timeout: 30000
        },
        isSetRequestInterception: false, // Enabling request interception disables page caching.
        view: {
          deviceScaleFactor: 1,
          width: 750,
          height: 1200
        },
        captureOption: {
          type: 'jpeg',
          quality: 75,
          fullPage: false,
          encoding: 'binary'
        },
        hooks: {
          beforeCreatePage: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            }));

            return function beforeCreatePage() {
              return _ref.apply(this, arguments);
            };
          }(),
          afterCreatePage: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, _this);
            }));

            return function afterCreatePage() {
              return _ref2.apply(this, arguments);
            };
          }(),
          beforeCapture: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, _this);
            }));

            return function beforeCapture() {
              return _ref3.apply(this, arguments);
            };
          }(),
          afterCapture: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, _this);
            }));

            return function afterCapture() {
              return _ref4.apply(this, arguments);
            };
          }()
        }
      }
    };
    this.middlewares = [{
      enable: true,
      module: _initPage2.default,
      priority: 50
    }, {
      enable: true,
      module: _capture2.default,
      priority: 150
    }, {
      enable: true,
      module: _storage2.default,
      priority: 200
    }];

    this.options = (0, _deepExtend2.default)({}, this.options, options);
  }

  _createClass(ScreenShot, [{
    key: 'use',
    value: function use(middlewares) {
      if (!(0, _lodash.isObject)(middlewares)) {
        throw new Error('middleware must be a pure object or an array');
      }

      this.middlewares = this.middlewares.concat(middlewares);

      return this;
    }
  }, {
    key: 'launch',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this2 = this;

        var browser, browserInstance;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                browser = this.options.browser;

                if (!this.browser) {
                  _context5.next = 5;
                  break;
                }

                _context5.next = 4;
                return Promise.resolve(this.browser);

              case 4:
                return _context5.abrupt('return', _context5.sent);

              case 5:
                _context5.next = 7;
                return _puppeteer2.default.launch(browser);

              case 7:
                browserInstance = _context5.sent;

                browserInstance.on('disconnected', function () {
                  _this2.close();
                });

                this.browser = browserInstance;
                return _context5.abrupt('return', browserInstance);

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function launch() {
        return _ref5.apply(this, arguments);
      }

      return launch;
    }()

    // 采用单例的模式，只存在一个browser实例

  }, {
    key: 'getBrowser',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this.browser) {
                  _context6.next = 6;
                  break;
                }

                _context6.next = 3;
                return Promise.resolve(this.browser);

              case 3:
                return _context6.abrupt('return', _context6.sent);

              case 6:
                _context6.next = 8;
                return this.launch();

              case 8:
                return _context6.abrupt('return', _context6.sent);

              case 9:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getBrowser() {
        return _ref6.apply(this, arguments);
      }

      return getBrowser;
    }()
  }, {
    key: 'capture',
    value: function capture(options) {
      if (!options) {
        throw new Error('options can not be empty');
      }

      var defer = function () {
        var resolve = void 0,
            reject = void 0;
        var promise = new Promise(function (res, rej) {
          resolve = res;
          reject = rej;
        });
        return { resolve: resolve, reject: reject, promise: promise };
      }();

      if ((0, _lodash.isString)(options)) {
        if ((0, _utils.isHttp)(options)) {
          options = {
            url: options,
            type: 'url'
          };
        } else {
          options = {
            html: options,
            type: 'html'
          };
        }
      }

      var captureOptions = (0, _deepExtend2.default)({}, this.options.capture, options);

      var middlewares = (0, _lodash.get)(this, 'middlewares', []);
      if ((0, _lodash.isEmpty)(middlewares)) {
        throw new Error('error: middlewares can not be empty');
      }

      var fn = (0, _middleware2.default)(middlewares);

      var context = {
        getBrowser: this.getBrowser.bind(this),
        options: captureOptions,
        resolve: defer.resolve,
        reject: defer.reject,
        result: {
          requestError: []
        }
      };

      fn(context, function (ctx) {
        defer.resolve(ctx);
      });

      return defer.promise;
    }
  }, {
    key: 'captureBot',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(options) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function captureBot(_x) {
        return _ref7.apply(this, arguments);
      }

      return captureBot;
    }()
  }, {
    key: 'close',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var browser;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.getBrowser();

              case 2:
                browser = _context8.sent;
                _context8.next = 5;
                return browser.close();

              case 5:
                this.browser = null;

              case 6:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function close() {
        return _ref8.apply(this, arguments);
      }

      return close;
    }()
  }]);

  return ScreenShot;
}();

exports.default = ScreenShot;
module.exports = exports.default;