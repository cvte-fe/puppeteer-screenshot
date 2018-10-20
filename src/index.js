/**
 * @flow
 * screenshot class
 */

import puppeteer from 'puppeteer';
import deepExtend from 'deep-extend';
import path from 'path';
import { isHttp } from './utils';
import { isString, get, isEmpty } from 'lodash';
import compose from './libs/middleware';

import initPageMiddleware from './middlewares/initPage';
import loadPageMiddleware from './middlewares/loadPage';
import captureMiddleware from './middlewares/capture';

global.Promise = require('bluebird');

class ScreenShot {
  browser = '';
  options = {
    browser: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    },
    capture: {
      optimize: true,
      storage: {
        type: 'filesystem',
        path: path.join(process.cwd(), './screenshot'),
      },
      timeout: 30000,
      view: {
        deviceScaleFactor: 2,
        width: 750,
        height: 1200,
      },
      captureOption: {
        type: 'jpeg',
        quality: 75,
        fullPage: false,
        clip: {
          // 裁剪
          x: 0,
          y: 0,
          width: 400,
          height: 400,
          omitBackground: false,
        },
      },
      hooks: {
        beforeCapture: () => {
          // do something
        },
        afterCapture: () => {
          // do something
        },
      },
    },
  };

  middlewares = [
    {
      enable: true,
      module: initPageMiddleware,
      priority: 50,
    },
    {
      enable: true,
      module: loadPageMiddleware,
      priority: 100,
    },
    {
      enable: true,
      module: captureMiddleware,
      priority: 150,
    },
  ];

  constructor(options) {
    this.options = deepExtend({}, this.options, options);
  }

  async launch() {
    const { browser } = this.options;
    if (this.browser) {
      return await Promise.resolve(this.browser);
    }
    const browserInstance = await puppeteer.launch(browser);
    this.browser = browserInstance;
    return browserInstance;
  }

  // 采用单例的模式，只存在一个browser实例
  async getBrowser() {
    if (this.browser) {
      return await Promise.resolve(this.browser);
    } else {
      return await this.launch();
    }
  }

  capture(options) {
    if (!options) {
      throw new Error('options can not be empty');
    }

    const defer: Object = (function() {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { resolve, reject, promise };
    })();

    if (isString(options)) {
      if (isHttp(options)) {
        options = {
          url: options,
          type: 'url',
        };
      } else {
        options = {
          html: options,
          type: 'html',
        };
      }
    }

    const captureOptions = deepExtend({}, this.options.capture, options);

    const middlewares = get(this, 'middlewares', []);
    if (isEmpty(middlewares)) {
      throw new Error('error: middlewares can not be empty');
    }

    const fn = compose(middlewares);

    const context = {
      getBrowser: this.getBrowser.bind(this),
      options: captureOptions,
      resolve: defer.resolve,
      reject: defer.reject,
    };

    fn(context, ctx => {
      defer.resolve(ctx);
    });

    return defer.promise;
  }

  async captureBot(options) {}

  async close() {
    const browser = await this.getBrowser();
    browser.close();
  }
}

export default ScreenShot;
