import { isEmpty, isFunction } from 'lodash';
export default async (ctx, next) => {
  console.log('middleware: initPage');

  const { options, result } = ctx;
  const { hooks, pageOption } = options;
  const browser = await ctx.getBrowser();

  hooks.beforeCreatePage && (await hooks.beforeCreatePage(browser, ctx));

  const page = await browser.newPage();

  hooks.afterCreatePage && (await hooks.afterCreatePage(page, browser, ctx));

  const {
    view,
    html,
    url,
    type,
    isSetRequestInterception,
    interceptedRequest,
  } = options;

  await page.setRequestInterception(isSetRequestInterception);

  // 用于拦截一些请求
  if (isFunction(interceptedRequest)) {
    page.on('request', interceptedRequest);
  }

  page.on('requestfailed', interceptedRequest => {
    result.requestError.push({
      url: interceptedRequest.url(),
      errorText: interceptedRequest.failure().errorText,
    });
  });

  page.on('pageerror', err => {
    result.pageError = err;
  });

  page.on('load', () => {
    next();
  });

  ctx.browser = browser;
  ctx.page = page;

  if (!isEmpty(view)) {
    await page.setViewport(view);
  }

  if (type === 'html') {
    await page.setContent(html);
  } else if (type === 'url') {
    await page.goto(url, pageOption);
  } else {
    throw new Error(`unknown type: ${type}`);
  }
};
