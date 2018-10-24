import path from 'path';
import fs from 'fs-extra';
import uuid from 'uuid/v4';
import qiniu from 'qiniu';

/**
 * [isHttp isHttp]
 * 判断字符串是否是http
 */
export function isHttp(urlString) {
  if (!urlString) {
    return false;
  }

  var httpReg = /^(http||https):\/\//;
  return httpReg.test(urlString);
}

export function generateFileName(storage, options) {
  let fileNameWithExtension;

  const fileName = `${storage.prefix}${uuid()}`;
  if (options.type === 'jpeg') {
    fileNameWithExtension = `${fileName}.jpg`;
  } else {
    fileNameWithExtension = `${fileName}.png`;
  }

  return fileNameWithExtension;
}

export async function storageImageToPath(data, storage, options) {
  await fs.ensureDir(storage.path);

  const fileNameWithExtension = generateFileName(storage, options);

  const filePath = path.join(storage.path, fileNameWithExtension);
  await fs.outputFile(filePath, data);

  return {
    name: fileNameWithExtension,
    path: filePath,
  };
}

const Duplex = require('stream').Duplex;
export function bufferToStream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export function storageImageToQiuniu(data, storage, options) {
  const fileNameWithExtension = generateFileName(storage, options);

  const mac = new qiniu.auth.digest.Mac(storage.accessKey, storage.secretKey);
  const qiniuOptions = {
    scope: storage.bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(qiniuOptions);
  const uploadToken = putPolicy.uploadToken(mac);

  const formUploader = new qiniu.form_up.FormUploader();
  const putExtra = new qiniu.form_up.PutExtra();
  const readableStream = bufferToStream(data);

  const defer = (function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { resolve, reject, promise };
  })();

  formUploader.putStream(
    uploadToken,
    fileNameWithExtension,
    readableStream,
    putExtra,
    function(respErr, respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        defer.resolve({
          ...respBody,
          url: getQiniuUrl(respBody.key, storage),
        });
      } else {
        defer.reject(respBody);
      }
    },
  );

  return defer.promise;
}

export function getQiniuUrl(key, storage) {
  const mac = new qiniu.auth.digest.Mac(storage.accessKey, storage.secretKey);
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const bucketDomain = storage.domain;
  if (storage.bucketType === 'private') {
    const deadline = parseInt(Date.now() / 1000) + storage.deadline;
    return bucketManager.privateDownloadUrl(bucketDomain, key, deadline);
  } else {
    return bucketManager.publicDownloadUrl(bucketDomain, key);
  }
}
