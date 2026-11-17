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
