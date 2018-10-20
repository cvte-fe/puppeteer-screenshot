import compose from 'koa-compose';
import _ from 'lodash';

export default middlewares => {
  const isArray = Array.isArray;
  if (!isArray(middlewares)) {
    throw new TypeError('middlewares stack must be an array');
  }

  var middlewareCollection = [];
  middlewares = _.sortBy(middlewares, ['priority']);

  middlewares.forEach(item => {
    const { enable, module, priority } = item;
    if (!_.isInteger(priority) || priority <= 0) {
      throw new TypeError(
        'middleware priority must be positive and an integer.',
      );
    }
    /*
      enabled(boolean): whether to use this middleware
      module(function): what this middleware runs for
      priority(number): the priority when the middlware runs
      adaptor(string|array): what adaptors this middleware is applied to.
        If not set, the default will run the middleware.
    */
    if (enable === true) {
      if (typeof module === 'function') {
        middlewareCollection.push(module);
      } else {
        throw new TypeError('middleware module must be a function');
      }
    }
  });
  return compose(middlewareCollection);
};
