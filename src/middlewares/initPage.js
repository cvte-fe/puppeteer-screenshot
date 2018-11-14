import { isEmpty, isFunction } from 'lodash';
export default async (ctx, next) => {
  // console.log('middleware: initPage');

  const { options, result, trace } = ctx;
  const { hooks, pageOption } = options;
  const browser = await ctx.getBrowser();

  trace.push('start create page');

  hooks.beforeCreatePage && (await hooks.beforeCreatePage(browser, ctx));

  const page = await browser.newPage();

  hooks.afterCreatePage && (await hooks.afterCreatePage(page, browser, ctx));

  trace.push('created page');

  const {
    view,
    html,
    url,
    type,
    isSetRequestInterception,
    interceptedRequest,
  } = options;

  await page.setRequestInterception(isSetRequestInterception);

  trace.push('setRequestInterception');

  // 用于拦截一些请求
  if (isFunction(interceptedRequest)) {
    page.on('request', interceptedRequest);
  }

  page.on('requestfailed', interceptedRequest => {
    const failData = {
      url: interceptedRequest.url(),
      errorText: interceptedRequest.failure().errorText,
    };

    trace.push({
      name: 'requestfailed',
      data: failData,
    });

    result.requestError.push(failData);
  });

  page.on('pageerror', err => {
    trace.push({
      name: 'pageerror',
      data: err,
    });
    result.pageError = err;
  });

  page.on('error', error => {
    console.error('page error');

    trace.push({
      name: 'page crash',
      data: error,
    });

    ctx.reject({
      ctx: ctx,
      error: error,
    });
    page.close();
  });

  ctx.browser = browser;
  ctx.page = page;

  if (!isEmpty(view)) {
    await page.setViewport(view);
  }

  if (type === 'html') {
    page.on('load', () => {
      trace.push('onload');
      next();
    });

    await page.setContent(html);
  } else if (type === 'url') {
    try {
      await page.goto(url, pageOption);
      trace.push(`goto url: ${url}`);
      next();
    } catch (e) {
      trace.push({
        name: `goto url error: ${url}`,
        data: e,
      });
      result.openPageError = e;
      console.log('error and go to next step:', e);
      next();
    }
  } else {
    throw new Error(`unknown type: ${type}`);
  }
};
