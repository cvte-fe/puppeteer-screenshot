// import { isEmpty } from 'lodash';

export default async (ctx, next) => {
  console.log('middleware: capture');
  const { options, page } = ctx;
  const { captureOption, storage } = options;

  await page.screenshot({ path: storage.path, ...captureOption });

  next();
};
