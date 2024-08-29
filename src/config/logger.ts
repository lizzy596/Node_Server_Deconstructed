import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private logLevel: LogLevel;
  private logFile: string;

  constructor(logLevel: LogLevel = 'info', logFile: string = 'app.log') {
    this.logLevel = logLevel;
    this.logFile = path.resolve(__dirname, logFile);
  }

  private log(message: string, level: LogLevel): void {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const levelIndex = levels.indexOf(level);
    const currentLevelIndex = levels.indexOf(this.logLevel);

    if (levelIndex >= currentLevelIndex) {
      const formattedMessage = this.formatMessage(message, level);
      this.writeToConsole(formattedMessage, level);
      this.writeToFile(formattedMessage);
    }
  }

  private formatMessage(message: string, level: LogLevel): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  private writeToConsole(message: string, level: LogLevel): void {
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[34m', // blue
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
    };
    console.log(colors[level] || '\x1b[0m', message, '\x1b[0m');
  }

  private writeToFile(message: string): void {
    fs.appendFileSync(this.logFile, message + '\n');
  }

  public debug(message: string): void {
    this.log(message, 'debug');
  }

  public info(message: string): void {
    this.log(message, 'info');
  }

  public warn(message: string): void {
    this.log(message, 'warn');
  }

  public error(message: string): void {
    this.log(message, 'error');
  }
}

export default Logger;




