import type { FastifyRequest, FastifyReply } from "fastify";
import { config } from "../config/index.js";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

interface LogContext {
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["trace", "debug", "info", "warn", "error", "fatal"];
    const configLevel = (config.logLevel as LogLevel) || "info";
    return levels.indexOf(level) >= levels.indexOf(configLevel);
  }

  trace(message: string, context?: LogContext): void {
    if (this.shouldLog("trace")) {
      console.trace(this.formatMessage("trace", message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context));
    }
  }

  fatal(message: string, context?: LogContext): void {
    if (this.shouldLog("fatal")) {
      console.error(this.formatMessage("fatal", message, context));
    }
  }

  /**
   * 请求日志
   */
  request(request: FastifyRequest, reply: FastifyReply, responseTime: number): void {
    const context: LogContext = {
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: `${responseTime}ms`,
    };

    if (reply.statusCode >= 400) {
      this.warn(`请求完成 [${request.method} ${request.url}]`, context);
    } else {
      this.info(`请求完成 [${request.method} ${request.url}]`, context);
    }
  }
}

export const logger = new Logger();
