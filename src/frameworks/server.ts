import dotenv from "dotenv";
dotenv.config(); // ⚠️ Must be first — loads .env before any infrastructure imports

import express, { Request, Response } from "express";
import cors from "cors";
import initRoutes from "./routes";
import { Logger } from "../shared/logger";
import "../infrastructure/supabase"; // Initializes Supabase client

const app = express();

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(
  cors({
    credentials: true,
    origin: "*", 
  })
);
app.use(express.json());

const PORT = Number(process.env.PORT) || 8081;

let httpServer: ReturnType<typeof app.listen> | null = null;

const startServer = async () => {
  httpServer = app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`🚀 Fest Ticket Hub backend (Supabase) listening on http://0.0.0.0:${PORT}`);
    Logger.info(`💚 Health check available at http://0.0.0.0:${PORT}/health`);
  });

  httpServer.on("error", (error: any) => {
    Logger.error(`❌ Server error: ${error}`);
    process.exit(1);
  });

  try {
    // Initialize app routes
    await initRoutes(app, {} as any); // Passing empty object as we don't need DataSource anymore
    Logger.info("✅ Routes initialized");
  } catch (err: any) {
    Logger.error(`❌ Routes initialization failed: ${err}`);
  }
};

const gracefulShutdown = (signal: string) => {
  Logger.info(`${signal} received, shutting down gracefully...`);
  if (httpServer) {
    httpServer.close(() => {
      Logger.info("HTTP server closed.");
      process.exit(0);
    });
    (setTimeout(() => process.exit(0), 5000) as any).unref();
  } else {
    process.exit(0);
  }
};

process.on("uncaughtException", (error: Error) => {
  Logger.error(`❌ Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  Logger.error(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer().catch((error) => {
  Logger.error(`❌ Failed to start server: ${error}`);
  process.exit(1);
});
