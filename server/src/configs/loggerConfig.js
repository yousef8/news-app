import { pino } from "pino";

const logPath = "/var/log/app/app.log";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: { colorize: true },
    },
    {
      target: "pino/file",
      options: { destination: logPath, mkdir: true },
      level: "info",
    },
  ],
});

const logger = pino(transport);

export default logger;
