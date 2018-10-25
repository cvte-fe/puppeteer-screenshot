// import { isEmpty } from 'lodash';

export default async (ctx, next) => {
  console.log('middleware: capture');
  const { options, page, result, reject } = ctx;
  const { captureOption, hooks } = options;

  hooks.beforeCapture && (await hooks.beforeCapture(ctx));
  let screenshotResult;
  try {
    screenshotResult = await page.screenshot({
      ...captureOption,
    });
  } catch (e) {
    reject(e);
    return false;
  }

  await page.close();

  result.data = screenshotResult;

  hooks.afterCapture && (await hooks.afterCapture(screenshotResult, ctx));

  next();
};
