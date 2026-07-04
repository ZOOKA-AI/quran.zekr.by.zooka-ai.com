export const loggerUtils = {
  log(message, data = null) {
    console.log(`[Log] ${message}`, data);
  },

  warn(message, data = null) {
    console.warn(`[Warn] ${message}`, data);
  },

  error(message, data = null) {
    console.error(`[Error] ${message}`, data);
  },

  info(message, data = null) {
    console.info(`[Info] ${message}`, data);
  },

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Debug] ${message}`, data);
    }
  },

  group(label, callback) {
    console.group(label);
    callback();
    console.groupEnd();
  }
};