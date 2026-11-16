import express from 'express';
import Seo from '../models/Seo.js';

const router = express.Router();

// GET all SEO cases
router.get('/', async (req, res) => {
  try {
    const cases = await Seo.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEO cases', details: error.message });
  }
});

// GET single SEO case
router.get('/:id', async (req, res) => {
  try {
    const seoCase = await Seo.findById(req.params.id);
    if (!seoCase) return res.status(404).json({ error: 'SEO case not found' });
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
    const updated = await Seo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'SEO case not found' });
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
