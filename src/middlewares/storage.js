import { storageImageToPath, storageImageToQiuniu } from '../utils';

export default async (ctx, next) => {
  console.log('middleware: storage');
  const { options, result, reject } = ctx;
  const { captureOption, storage } = options;

  const buffer =
    captureOption.encoding === 'base64'
      ? result.data
      : Buffer.from(result.data, 'base64');

  try {
    if (storage.type === 'filesystem') {
      await storageImageToPath(buffer, storage, captureOption);
    } else if (storage.type === 'qiniu') {
      await storageImageToQiuniu(buffer, storage, captureOption);
    }
  } catch (e) {
    reject(e);
    return false;
  }

  next();
};
