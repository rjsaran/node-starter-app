import { injectable } from "inversify";
import { format, createLogger, transports } from "winston";

const { colorize, combine, json, label, printf, timestamp } = format;

@injectable()
export class LoggerService {
  private readonly logger;

  constructor() {
    const consoleTransport = new transports.Console({
      format: combine(
        colorize({
          all: true,
          colors: {
            info: "bold blue",
            error: "bold red",
          },
        })
      ),
    });

    const exceptionFileTransport = new transports.File({
      filename: "logs/exceptions.log",
      format: combine(json()),
    });

    this.logger = createLogger({
      level: "info",
      format: combine(
        label({ label: `[Application]` }),
        timestamp({
          format: "MMM-DD-YYYY HH:mm:ss",
        }),
        printf(function (info) {
          return `\x1B[33m\x1B[3[${info.label}\x1B[23m\x1B[39m \x1B[32m${info.timestamp}\x1B[39m ${info.level} : ${info.message}`;
        })
      ),
      transports: [consoleTransport],
      exceptionHandlers: [consoleTransport, exceptionFileTransport],
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }
}
