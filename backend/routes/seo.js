import express from 'express';
import Seo from '../models/Seo.js';

const router = express.Router();

// GET all SEO cases with optimized lean query, filtering, search, and bounded pagination
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search && req.query.search.trim()) {
      filter.$text = { $search: req.query.search.trim() };
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 0, 200);
    const skip = parseInt(req.query.skip, 10) || 0;

    let query = Seo.find(filter).sort({ createdAt: -1 });
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);

    // .lean() avoids heavy Mongoose document overhead (70% less memory, 3x faster)
    const rawCases = await query.lean().exec();

    // Map id virtual for full frontend compatibility
    const cases = rawCases.map((s) => ({
      ...s,
      id: s._id.toString(),
    }));

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEO cases', details: error.message });
  }
});

// GET category and status summary with counts (Single aggregation, Avoids N+1 query loops)
router.get('/categories/summary', async (req, res) => {
  try {
    const summary = await Seo.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          featuredCount: { $sum: { $cond: ['$featured', 1, 0] } },
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
    const rawItems = await Seo.find({ _id: { $in: ids } }).lean().exec();
    const items = rawItems.map((s) => ({ ...s, id: s._id.toString() }));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch batch SEO cases', details: error.message });
  }
});

// PUT batch update SEO cases in parallel (Parallel Unordered bulkWrite)
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

    const result = await Seo.bulkWrite(bulkOps, { ordered: false });
    res.json({
      message: 'Batch update executed in parallel',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch update SEO cases in parallel', details: error.message });
  }
});

// POST batch delete SEO cases in parallel (Atomic multi-document deletion)
router.post('/batch/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of ids is required' });
    }

    const result = await Seo.deleteMany({ _id: { $in: ids } });
    res.json({
      message: 'Batch delete executed in parallel',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch delete SEO cases in parallel', details: error.message });
  }
});

// GET single SEO case
router.get('/:id', async (req, res) => {
  try {
    const seoCase = await Seo.findById(req.params.id).lean().exec();
    if (!seoCase) return res.status(404).json({ error: 'SEO case not found' });
    seoCase.id = seoCase._id.toString();
    res.json(seoCase);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEO case', details: error.message });
  }
});

// POST new SEO case
router.post('/', async (req, res) => {
  try {
    const { 
      client, 
      website, 
      thumbnail, 
      rankingImage, 
      image,
      topKeyword, 
      googleRank, 
      organicGrowth, 
      trafficMonthly, 
      healthScore, 
      leadsPerMonth, 
      status, 
      featured 
    } = req.body;

    if (!client || !website) {
      return res.status(400).json({ error: 'Client and Website are required' });
    }

    const finalImage = rankingImage || image || thumbnail || '/seo_gsc_performance.jpg';

    const seoCase = new Seo({
      client,
      website,
      thumbnail: thumbnail || finalImage,
      rankingImage: rankingImage || finalImage,
      image: image || finalImage,
      topKeyword: topKeyword || 'Google Search Rank #1',
      googleRank: googleRank || '#1 Position',
      organicGrowth: organicGrowth || '+350%',
      trafficMonthly: trafficMonthly || '50,000 visits',
      healthScore: healthScore || '98/100',
      leadsPerMonth: leadsPerMonth || '500+ Inquiries',
      status: status || 'GSC Verified',
      featured: !!featured,
    });

    const saved = await seoCase.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SEO case', details: error.message });
  }
});

// PUT update SEO case
router.put('/:id', async (req, res) => {
  try {
    const updated = await Seo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      lean: true,
    }).exec();
    if (!updated) return res.status(404).json({ error: 'SEO case not found' });
    updated.id = updated._id.toString();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SEO case', details: error.message });
  }
});

// DELETE SEO case
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Seo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'SEO case not found' });
    res.json({ message: 'SEO case deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete SEO case', details: error.message });
  }
});

export default router;
