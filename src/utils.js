import path from 'path';
import fs from 'fs-extra';
import uuid from 'uuid/v4';

// const existsAsync = Promise.promisify(fs.)
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

export async function storageImageToPath(data, storage, options) {
  await fs.ensureDir(storage.path);
  const buffer =
    options.encoding === 'base64' ? data : Buffer.from(data, 'base64');

  let fileNameWithExtension;

  const fileName = `${storage.prefix}${uuid()}.${fileNameWithExtension}`;
  if (options.type === 'jpeg') {
    fileNameWithExtension = `${fileName}.jpg`;
  } else {
    fileNameWithExtension = `${fileName}.png`;
  }
  await fs.outputFile(path.join(storage.path, fileNameWithExtension), buffer);
}
