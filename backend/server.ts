import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import Server from './src/index';

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.listen(PORT, 'localhost', () => {
    console.log(`Server started on port ${PORT}`);
})
.on("error", (err: any) => {
    if (err.code && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose a different port.`);
    }
    else {
        console.error("Error starting server:", err);
    }
});