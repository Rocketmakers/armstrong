export class ClassHelpers {
  static hasOwn = {}.hasOwnProperty;

  static classNames(...args) {
    var classes = [];

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (!arg) continue;

      var argType = typeof arg;

      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        classes.push(this.classNames.apply(null, arg));
      } else if (argType === 'object') {
        for (var key in arg) {
          if (this.hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }

    return classes.join(' ');
  }
}