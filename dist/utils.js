'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storageImageToPath = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var storageImageToPath = exports.storageImageToPath = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, storage, options) {
    var fileNameWithExtension, filePath;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fsExtra2.default.ensureDir(storage.path);

          case 2:
            fileNameWithExtension = generateFileName(storage, options);
            filePath = _path2.default.join(storage.path, fileNameWithExtension);
            _context.next = 6;
            return _fsExtra2.default.outputFile(filePath, data);

          case 6:
            return _context.abrupt('return', {
              name: fileNameWithExtension,
              path: filePath
            });

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function storageImageToPath(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.isHttp = isHttp;
exports.generateFileName = generateFileName;
exports.bufferToStream = bufferToStream;
exports.storageImageToQiuniu = storageImageToQiuniu;
exports.getQiniuUrl = getQiniuUrl;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _qiniu = require('qiniu');

var _qiniu2 = _interopRequireDefault(_qiniu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [isHttp isHttp]
 * 判断字符串是否是http
 */
function isHttp(urlString) {
  if (!urlString) {
    return false;
  }

  var httpReg = /^(http||https):\/\//;
  return httpReg.test(urlString);
}

function generateFileName(storage, options) {
  var fileNameWithExtension = void 0;

  var fileName = '' + storage.prefix + (0, _v2.default)();
  if (options.type === 'jpeg') {
    fileNameWithExtension = fileName + '.jpg';
  } else {
    fileNameWithExtension = fileName + '.png';
  }

  return fileNameWithExtension;
}

var Duplex = require('stream').Duplex;
function bufferToStream(buffer) {
  var stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function storageImageToQiuniu(data, storage, options) {
  var fileNameWithExtension = generateFileName(storage, options);

  var mac = new _qiniu2.default.auth.digest.Mac(storage.accessKey, storage.secretKey);
  var qiniuOptions = {
    scope: storage.bucket
  };
  var putPolicy = new _qiniu2.default.rs.PutPolicy(qiniuOptions);
  var uploadToken = putPolicy.uploadToken(mac);

  var formUploader = new _qiniu2.default.form_up.FormUploader();
  var putExtra = new _qiniu2.default.form_up.PutExtra();
  var readableStream = bufferToStream(data);

  var defer = function () {
    var resolve = void 0,
        reject = void 0;
    var promise = new _promise2.default(function (res, rej) {
      resolve = res;
      reject = rej;
    });
    return { resolve: resolve, reject: reject, promise: promise };
  }();

  formUploader.putStream(uploadToken, fileNameWithExtension, readableStream, putExtra, function (respErr, respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode == 200) {
      defer.resolve((0, _extends3.default)({}, respBody, {
        url: getQiniuUrl(respBody.key, storage)
      }));
    } else {
      defer.reject(respBody);
    }
  });

  return defer.promise;
}

function getQiniuUrl(key, storage) {
  var mac = new _qiniu2.default.auth.digest.Mac(storage.accessKey, storage.secretKey);
  var config = new _qiniu2.default.conf.Config();
  var bucketManager = new _qiniu2.default.rs.BucketManager(mac, config);
  var bucketDomain = storage.domain;
  if (storage.bucketType === 'private') {
    var deadline = parseInt(Date.now() / 1000) + storage.deadline;
    return bucketManager.privateDownloadUrl(bucketDomain, key, deadline);
  } else {
    return bucketManager.publicDownloadUrl(bucketDomain, key);
  }
}