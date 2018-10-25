import ScreenShot from '../src/index';
import fs from 'fs-extra';

describe('test url ScreenShot', () => {
  const screenshot = new ScreenShot();

  afterEach(async () => {
    await screenshot.close();
  });

  it(
    'capture url',
    async cb => {
      expect.assertions(1);
      const result = await screenshot.capture('http://www.baidu.com');
      const { output } = result.result;
      console.log(output);
      cb();
      expect(fs.existsSync(output.path)).toBe(true);
    },
    30000,
  );

  it(
    'capture html',
    async cb => {
      expect.assertions(1);
      const result = await screenshot.capture({
        html:
          '<html><head></head><body>this is a static html <img src="http://www.baidu.com/img/bd_logo1.png?qua=high&where=super" /></body></html>',
        type: 'html',
      });
      const { output } = result.result;
      console.log(output);
      cb();
      expect(fs.existsSync(output.path)).toBe(true);
    },
    30000,
  );

  process.on('exit', () => {
    screenshot.close();
  });
});
