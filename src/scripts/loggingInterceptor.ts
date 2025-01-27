// src/scripts/loggingInterceptor.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { writeFileSync } from 'fs';

export class LoggingInterceptor {
    async intercept(config: AxiosRequestConfig): Promise<AxiosResponse> {
        // Log the request details
        const requestLog = `Request: ${config.method?.toUpperCase()} ${config.url}`;
        console.log(requestLog);

        // Proceed with the request
        const response = await axios(config);

        // Log the response details
        const responseLog = `Response: ${response.config.url} with status code: ${response.status}`;
        console.log(responseLog);

        // Save logs to api_logs.json
        const logEntry = `{"timestamp": "${new Date().toISOString()}", "message": "${requestLog}", "level": "INFO"}\n`;
        writeFileSync("api_logs.json", logEntry, { flag: 'a' });
        const responseLogEntry = `{"timestamp": "${new Date().toISOString()}", "message": "${responseLog}", "level": "INFO"}\n`;
        writeFileSync("api_logs.json", responseLogEntry, { flag: 'a' });

        return response;
    }
}