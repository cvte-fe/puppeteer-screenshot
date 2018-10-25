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
    switch (storage.type) {
      case 'filesystem':
        result.output = await storageImageToPath(
          buffer,
          storage,
          captureOption,
        );
        break;

      case 'qiniu':
        result.output = await storageImageToQiuniu(
          buffer,
          storage,
          captureOption,
        );
        break;

      case 'custom':
        if (storage.func) {
          result.output = await storage.func(buffer, storage, captureOption);
        }
        break;

      default:
        console.log('no storage type, go to next step');
    }
  } catch (e) {
    reject(e);
    return false;
  }

  next();
};
