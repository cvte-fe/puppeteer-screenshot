// import { isEmpty } from 'lodash';

export default async (ctx, next) => {
  console.log('middleware: capture');
  const { options, page, result, reject } = ctx;
  const { captureOption, hooks } = options;

  hooks.beforeCapture && hooks.beforeCapture(ctx);
  let screenshotResult;
  try {
    screenshotResult = await page.screenshot({
      ...captureOption,
    });
  } catch (e) {
    reject(e);
    return false;
  }

  result.data = screenshotResult;

  hooks.afterCapture && hooks.afterCapture(screenshotResult, ctx);

  next();
};
