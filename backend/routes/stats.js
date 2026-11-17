import express from 'express';
import Graphic from '../models/Graphic.js';
import Video from '../models/Video.js';
import Seo from '../models/Seo.js';

const router = express.Router();

// Comprehensive Dashboard Breakdown using MongoDB $facet Aggregation (Zero N+1 Queries)
router.get('/breakdown', async (req, res) => {
  try {
    const [graphicsFacet, videosFacet, seoFacet] = await Promise.all([
      // Single aggregation pipeline for all Graphics metrics
      Graphic.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            featured: [{ $match: { featured: true } }, { $count: 'count' }],
            byCategory: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            byFormat: [
              { $group: { _id: '$format', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
          },
        },
      ]),

      // Single aggregation pipeline for all Video metrics
      Video.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            featured: [{ $match: { featured: true } }, { $count: 'count' }],
            heroCount: [{ $match: { isHero: true } }, { $count: 'count' }],
            byCategory: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            bySection: [
              { $group: { _id: '$section', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
          },
        },
      ]),

      // Single aggregation pipeline for all SEO metrics
      Seo.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            featured: [{ $match: { featured: true } }, { $count: 'count' }],
            byCategory: [
              { $group: { _id: '$category', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
          },
        },
      ]),
    ]);

    const gData = graphicsFacet[0] || {};
    const vData = videosFacet[0] || {};
    const sData = seoFacet[0] || {};

    const graphicsCount = gData.total?.[0]?.count || 0;
    const videosCount = vData.total?.[0]?.count || 0;
    const seoCount = sData.total?.[0]?.count || 0;

    res.json({
      summary: {
        totalAssets: graphicsCount + videosCount + seoCount,
        graphicsCount,
        videosCount,
        seoCount,
        featuredTotal: (gData.featured?.[0]?.count || 0) + (vData.featured?.[0]?.count || 0) + (sData.featured?.[0]?.count || 0),
      },
      graphics: {
        total: graphicsCount,
        featured: gData.featured?.[0]?.count || 0,
        categories: gData.byCategory || [],
        formats: gData.byFormat || [],
      },
      videos: {
        total: videosCount,
        featured: vData.featured?.[0]?.count || 0,
        heroCount: vData.heroCount?.[0]?.count || 0,
        categories: vData.byCategory || [],
        sections: vData.bySection || [],
      },
      seo: {
        total: seoCount,
        featured: sData.featured?.[0]?.count || 0,
        categories: sData.byCategory || [],
        statuses: sData.byStatus || [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch breakdown stats', details: error.message });
  }
});

// Parallel Unified Multi-portfolio Data Retrieval (Parallel DB calls via Promise.all)
router.get('/all-portfolios', async (req, res) => {
  try {
    const [graphics, videos, seo] = await Promise.all([
      Graphic.find().sort({ createdAt: -1 }).lean().exec(),
      Video.find().sort({ priority: 1, createdAt: -1 }).lean().exec(),
      Seo.find().sort({ createdAt: -1 }).lean().exec(),
    ]);

    res.json({
      graphics: graphics.map((g) => ({ ...g, id: g._id.toString() })),
      videos: videos.map((v) => ({ ...v, id: v._id.toString() })),
      seo: seo.map((s) => ({ ...s, id: s._id.toString() })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all portfolios in parallel', details: error.message });
  }
});

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
