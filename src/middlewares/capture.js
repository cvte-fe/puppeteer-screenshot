// import { isEmpty } from 'lodash';

export default async (ctx, next) => {
  console.log('middleware: capture');
  const { options, page, result, reject, trace } = ctx;
  const { captureOption, hooks } = options;

  hooks.beforeCapture && (await hooks.beforeCapture(ctx));

  trace.push('start  screenshot');

  let screenshotResult;
  try {
    screenshotResult = await page.screenshot({
      ...captureOption,
    });

    trace.push({
      name: 'screenshot success',
      data: screenshotResult,
    });
  } catch (e) {
    trace.push({
      name: 'screenshot error',
      data: e,
    });
    await page.close();
    reject(e);
    return false;
  }

  await page.close();

  trace.push('page close');

  result.data = screenshotResult;

  hooks.afterCapture && (await hooks.afterCapture(screenshotResult, ctx));

  next();
};
