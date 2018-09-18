export class ClassHelpers {
  static hasOwn = {}.hasOwnProperty;

  static classNames(...args) {
    const classes = [];

    for (const arg of args) {
      if (!arg) { continue; }

      const argType = typeof arg;

      if (argType === "string" || argType === "number") {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        classes.push(this.classNames.apply(null, arg));
      } else if (argType === "object") {
        for (const key in arg) {
          if (this.hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }

    return classes.join(" ");
  }
}
