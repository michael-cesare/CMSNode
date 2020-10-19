import { createLogger, transports, format } from 'winston';

import { isEmpty } from '@util/core.util';
import { getTime, getDay } from '@util/time.util';

import { EnvConfig } from "@config/envConfig";

// const windowDefined = typeof window !== 'undefined' && window && window !== undefined && !isEmpty(window);
// const loggerType = windowDefined ? 'react' : 'node';
const loggerType = 'node';
let instance:any;
const loggerName = EnvConfig.loggerName;
const loggerLevel = EnvConfig.loggerLevel;

class NoLogger {
  constructor() {
    if (!instance) {
      const logger = this.initLogger();

      instance = logger;
    }
  }

  initLogger = () => {
    return this
  };

  hit = (msg:any) => {
  }

  info = (msg:any) => {
  }

  log = (msg:any) => {
  }

  debug = (msg:any) => {
  }
}

class SSRLogger {
  constructor() {
    if (!instance) {
      const logger = this.initLogger();

      instance = logger;
    }
  }

  initLogger = () => {
    // SSR react/node - log to winston
    const fileName = `errorLogs/${loggerName}-${getDay()}.log`;
    const transportConfig = [
      new transports.Console({
        level: loggerLevel,
      }),
      new transports.File({
        filename: fileName,
        level: loggerLevel,
      }),
    ];

    const winLogger = createLogger({
      transports: transportConfig,
      format: format.combine(
        // customFormatter,
        format.timestamp({
          format: getTime,
        }),
        // format.splat(), <-- prints ugly staff
        format.simple(),
      ),
    });

    // SSR node
    return winLogger;
  }

  hit = (msg:any) => {
    instance.debug(`[HIT]${msg}`);
  }

  log = (msg:any) => {
    instance.info(msg);
  }

  info = (msg:any) => {
    instance.info(msg);
  }

  debug = (msg:any) => {
    instance.debug(msg);
  }
}

class LoggerFactory {
  static getLogger = (type:any) => {
    let logger;
    if (isEmpty(type)) {
      logger = new NoLogger();
    } else if (type === 'node') {
      logger = new SSRLogger();
    } else {
      logger = new NoLogger();
    }

    return logger;
  };
}

const logger = LoggerFactory.getLogger(loggerType);

export default logger;
