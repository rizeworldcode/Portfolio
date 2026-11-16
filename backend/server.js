import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import graphicsRoutes from './routes/graphics.js';
import videosRoutes from './routes/videos.js';
import seoRoutes from './routes/seo.js';
import uploadRoutes from './routes/upload.js';
import statsRoutes from './routes/stats.js';
import adminLoginRoutes, { autoSeedMasterAdmin } from './routes/adminLogin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup
const allowedOrigins = [
  'https://portfolio-j73f.onrender.com',
  'http://localhost:5173', // SEO Portfolio
  'http://localhost:5174', // Graphic Portfolio
  'http://localhost:5175', // Video Portfolio
  'http://localhost:5176', // Admin Panel
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev mode: allow any local port
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads & portfolio assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.resolve(__dirname, '../graphic/public')));
app.use(express.static(path.resolve(__dirname, '../video/public')));
app.use(express.static(path.resolve(__dirname, '../seo/public')));

// Mount API routes
app.use('/api/auth', adminLoginRoutes);
app.use('/api/admin', adminLoginRoutes);
app.use('/api/graphics', graphicsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'RizeWorld Central API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('⚡ RizeWorld Central Backend API is running on Port ' + PORT);
});

// Connect to MongoDB & Start Server
const MONGO_URI = process.env.mongo_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rizeworld';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas Cloud successfully!');
    await autoSeedMasterAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 RizeWorld Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Still start server so API health and errors can be monitored
    app.listen(PORT, () => {
      console.log(`⚠️ Server running with DB warning at http://localhost:${PORT}`);
    });
  });
