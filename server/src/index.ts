import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { StorageService } from './services/storageService';

// Import Routes
import fileRoutes from './routes/fileRoutes';
import mergeRoutes from './routes/mergeRoutes';
import splitRoutes from './routes/splitRoutes';
import compressRoutes from './routes/compressRoutes';
import convertRoutes from './routes/convertRoutes';
import editRoutes from './routes/editRoutes';
import protectRoutes from './routes/protectRoutes';
import signRoutes from './routes/signRoutes';
import ocrRoutes from './routes/ocrRoutes';

// Import Swagger spec
import swaggerSpec from './swagger/openapi.json';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'localpdf-engine' });
});

// API Routes
app.use('/api', fileRoutes);
app.use('/api/merge', mergeRoutes);
app.use('/api/split', splitRoutes);
app.use('/api/compress', compressRoutes);
app.use('/api/convert', convertRoutes);
app.use('/api/edit', editRoutes);
app.use('/api/protect', protectRoutes);
app.use('/api/sign', signRoutes);
app.use('/api/ocr', ocrRoutes);

// Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error Handler]', err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
});

// Schedule file cleanup every hour
const cleanupInterval = setInterval(() => {
  StorageService.cleanupExpiredFiles();
}, 60 * 60 * 1000);
cleanupInterval.unref();

// Export for tests or run server
export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🚀 localpdf Backend Server running on port ${config.port}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${config.port}/api-docs`);
    console.log(`📂 Upload directory: ${config.uploadDir}`);
    console.log(`===============================================`);
  });
}
