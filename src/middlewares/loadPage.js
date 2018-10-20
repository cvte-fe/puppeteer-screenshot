import { isEmpty } from 'lodash';

export default async (ctx, next) => {
  console.log('middleware: loadPage');
  const { options, page } = ctx;
  const { view, html, url, type } = options;

  if (!isEmpty(view)) {
    await page.setViewport(view);
  }

  if (type === 'html') {
    await page.setContent(html);
  } else if (type === 'url') {
    await page.goto(url);
  } else {
    throw new Error(`unknown type: ${type}`);
  }

  next();
};
