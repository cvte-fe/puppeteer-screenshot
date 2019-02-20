/**
 * @flow
 * screenshot class
 */

import puppeteer from 'puppeteer';
import deepExtend from 'deep-extend';
import path from 'path';
import { isHttp } from './utils';
import { isString, get, isEmpty, isObject } from 'lodash';
import compose from './libs/middleware';

import initPageMiddleware from './middlewares/initPage';
// import loadPageMiddleware from './middlewares/loadPage';
import captureMiddleware from './middlewares/capture';
import storageMiddleware from './middlewares/storage';

require('babel-polyfill');

global.Promise = require('bluebird');

class ScreenShot {
  browser = '';
  options = {
    browser: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage','--enable-features=NetworkService'],
      headless: true,
      ignoreHTTPSErrors: true,
    },
    isDebug: false,
    capture: {
      optimize: true,
      storage: {
        prefix: 'capture-',
        type: 'filesystem',
        path: path.join(process.cwd(), './screenshot'),
      },
      pageOption: {
        timeout: 30000,
        waitUntil: 'load',
      },
      isSetRequestInterception: false, // Enabling request interception disables page caching.
      view: {
        deviceScaleFactor: 1,
        width: 750,
        height: 1200,
      },
      captureOption: {
        type: 'jpeg',
        quality: 75,
        fullPage: false,
        encoding: 'binary',
      },
      hooks: {
        beforeCreatePage: async () => {
          // do something
        },
        afterCreatePage: async () => {
          // do something
        },
        beforeCapture: async () => {
          // do something
        },
        afterCapture: async () => {
          // do something
        },
        onCrash: () => {
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
      module: captureMiddleware,
      priority: 150,
    },
    {
      enable: true,
      module: storageMiddleware,
      priority: 200,
    },
  ];

  constructor(options) {
    this.options = deepExtend({}, this.options, options);
  }

  use(middlewares) {
    if (!isObject(middlewares)) {
      throw new Error('middleware must be a pure object or an array');
    }

    this.middlewares = this.middlewares.concat(middlewares);

    return this;
  }

  async launch() {
    const { browser, capture } = this.options;
    const { hooks } = capture;
    if (this.browser) {
      return await Promise.resolve(this.browser);
    }
    const browserInstance = await puppeteer.launch(browser);
    browserInstance.on('disconnected', () => {
      this.close();
      hooks.onCrash && hooks.onCrash();
    });

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

    const isDebug = this.options.isDebug;

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
      closeBrowser: () => {
        this.close();
      },
      options: captureOptions,
      resolve: defer.resolve,
      reject: defer.reject,
      result: {
        requestError: [],
      },
      trace: [],
    };

    fn(context, ctx => {
      if (isDebug) {
        console.log('trace', ctx.trace);
      }
      defer.resolve(ctx);
    });

    return defer.promise;
  }

  async captureBot(options) {}

  async close() {
    const browser = await this.getBrowser();
    await browser.close();
    this.browser = null;
  }
}

export default ScreenShot;
