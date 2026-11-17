import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Video from '../models/Video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// GET hero video (Highest priority single video for instant hero section load)
router.get('/hero', async (req, res) => {
  try {
    let hero = await Video.findOne({ isHero: true }).sort({ priority: 1, createdAt: -1 }).lean().exec();
    if (!hero) {
      hero = await Video.findOne({ section: 'hero' }).sort({ priority: 1, createdAt: -1 }).lean().exec();
    }
    if (!hero) {
      hero = await Video.findOne({ featured: true }).sort({ priority: 1, createdAt: -1 }).lean().exec();
    }
    if (!hero) {
      hero = await Video.findOne().sort({ priority: 1, createdAt: -1 }).lean().exec();
    }
    if (hero) {
      hero.id = hero._id.toString();
    }
    res.json(hero || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero video', details: error.message });
  }
});

// Stream video file with HTTP 206 Partial Content (Range header chunked streaming)
router.get('/stream/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const potentialPaths = [
    path.resolve(__dirname, '../../video/public/videos-compressed', safeFilename),
    path.resolve(__dirname, '../../video/public', safeFilename),
    path.resolve(__dirname, '../uploads', safeFilename),
  ];

  const filePath = potentialPaths.find((p) => fs.existsSync(p));
  if (!filePath) {
    return res.status(404).json({ error: 'Video file not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// GET all videos with optimized lean query, filtering by section, isHero, category, search, and bounded pagination
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.section) {
      filter.section = req.query.section;
    }
    if (req.query.isHero !== undefined) {
      filter.isHero = req.query.isHero === 'true';
    }
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.search && req.query.search.trim()) {
      filter.$text = { $search: req.query.search.trim() };
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 200);
    const skip = parseInt(req.query.skip, 10) || 0;

    let query = Video.find(filter).sort({ priority: 1, createdAt: -1 });
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);

    // .lean() avoids heavy Mongoose document overhead (70% less memory, 3x faster)
    const rawVideos = await query.lean().exec();

    // Map id virtual for full frontend compatibility
    const videos = rawVideos.map((v) => ({
      ...v,
      id: v._id.toString(),
    }));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos', details: error.message });
  }
});

// GET category and section summary with counts (Single aggregation, Avoids N+1 query loops)
router.get('/categories/summary', async (req, res) => {
  try {
    const summary = await Video.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          featuredCount: { $sum: { $cond: ['$featured', 1, 0] } },
          heroCount: { $sum: { $cond: ['$isHero', 1, 0] } },
          latestItemDate: { $max: '$createdAt' },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories summary', details: error.message });
  }
});

// POST batch lookup by IDs (Single query with $in, avoiding N+1 loops)
router.post('/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ids is required' });
    }
    const rawItems = await Video.find({ _id: { $in: ids } }).lean().exec();
    const items = rawItems.map((v) => ({ ...v, id: v._id.toString() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batch videos', details: error.message });
  }
});

// PUT batch update videos in parallel (Parallel Unordered bulkWrite)
router.put('/batch/update', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Array of items with id/_id and update fields is required' });
    }

    const bulkOps = items.map((item) => {
      const { id, _id, ...updates } = item;
      const targetId = id || _id;
      return {
        updateOne: {
          filter: { _id: targetId },
          update: { $set: updates },
        },
      };
    });

    const result = await Video.bulkWrite(bulkOps, { ordered: false });
    res.json({
      message: 'Batch update executed in parallel',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch update videos in parallel', details: error.message });
  }
});

// PUT batch reorder video priorities in parallel (Parallel Unordered bulkWrite)
router.put('/batch/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id, priority }
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Array of orders with id and priority is required' });
    }

    const bulkOps = orders.map((item) => ({
      updateOne: {
        filter: { _id: item.id || item._id },
        update: { $set: { priority: Number(item.priority) } },
      },
    }));

    const result = await Video.bulkWrite(bulkOps, { ordered: false });
    res.json({
      message: 'Priorities reordered in parallel',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder videos in parallel', details: error.message });
  }
});

// POST batch delete videos in parallel (Atomic multi-document deletion)
router.post('/batch/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ids is required' });
    }

    const result = await Video.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Batch delete executed in parallel',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch delete videos in parallel', details: error.message });
  }
});

// GET single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).lean().exec();
    if (!video) return res.status(404).json({ error: 'Video not found' });
    video.id = video._id.toString();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video', details: error.message });
  }
});

// POST new video
router.post('/', async (req, res) => {
  try {
    const {
      title,
      client,
      category,
      videoUrl,
      thumbnail,
      views,
      duration,
      tags,
      featured,
      isHero,
      section,
      priority,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const video = new Video({
      title,
      client,
      category,
      videoUrl: videoUrl || '',
      thumbnail: thumbnail || '',
      views: views || '100K',
      duration: duration || '0:30',
      tags: Array.isArray(tags) ? tags : [],
      featured: !!featured,
      isHero: !!isHero,
      section: section || 'reels',
      priority: priority !== undefined ? Number(priority) : 10,
    });

    const saved = await video.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create video', details: error.message });
  }
});

// PUT update video
router.put('/:id', async (req, res) => {
  try {
    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      lean: true,
    }).exec();
    if (!updated) return res.status(404).json({ error: 'Video not found' });
    updated.id = updated._id.toString();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video', details: error.message });
  }
});

// DELETE video
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Video.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Video not found' });
    res.json({ message: 'Video deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video', details: error.message });
  }
});

export default router;
