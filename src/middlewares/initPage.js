export default async (ctx, next) => {
  console.log('middleware: initPage');
  const browser = await ctx.getBrowser();
  const page = await browser.newPage();

  ctx.browser = browser;
  ctx.page = page;
  next();
};
