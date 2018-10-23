import { storageImageToPath } from '../utils';

export default async (ctx, next) => {
  console.log('middleware: storage');
  const { options, result, reject } = ctx;
  const { captureOption, storage } = options;

  try {
    if (storage.type === 'filesystem') {
      await storageImageToPath(result.data, storage, captureOption);
    } else if (storage.type === 'qiniu') {
    }
  } catch (e) {
    reject(e);
    return false;
  }

  next();
};
