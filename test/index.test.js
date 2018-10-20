import ScreenShot from '../src/index';

describe('test init ScreenShot', () => {
  const screenshot = new ScreenShot({});
  test(
    'test capture',
    async cb => {
      screenshot.capture('http://www.baidu.com').then(resp => {
        screenshot.close();
        cb();
      });
    },
    30000,
  );
});
