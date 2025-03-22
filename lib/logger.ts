import fs from 'fs';
import path from 'path';

class Logger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(process.cwd(), 'app.log');
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private async writeToFile(level: string, message: string, data?: any): Promise<void> {
    const timestamp = this.getTimestamp();
    const logEntry = `[${timestamp}] ${level}: ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
    
    try {
      await fs.promises.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async info(message: string, data?: any): Promise<void> {
    console.log(`[INFO] ${message}`, data || '');
    await this.writeToFile('INFO', message, data);
  }

  async error(message: string, error?: any): Promise<void> {
    console.error(`[ERROR] ${message}`, error || '');
    await this.writeToFile('ERROR', message, error);
  }

  async debug(message: string, data?: any): Promise<void> {
    console.debug(`[DEBUG] ${message}`, data || '');
    await this.writeToFile('DEBUG', message, data);
  }

  async warn(message: string, data?: any): Promise<void> {
    console.warn(`[WARN] ${message}`, data || '');
    await this.writeToFile('WARN', message, data);
  }
}

export const logger = new Logger();