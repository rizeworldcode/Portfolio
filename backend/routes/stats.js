import express from 'express';
import Graphic from '../models/Graphic.js';
import Video from '../models/Video.js';
import Seo from '../models/Seo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [graphicsCount, videosCount, seoCount] = await Promise.all([
      Graphic.countDocuments(),
      Video.countDocuments(),
      Seo.countDocuments(),
    ]);

    res.json({
      graphicsCount,
      videosCount,
      seoCount,
      totalAssets: graphicsCount + videosCount + seoCount,
      studioHealth: '100%',
      status: 'Live & Synced',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

export default router;
