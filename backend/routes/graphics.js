import express from 'express';
import Graphic from '../models/Graphic.js';

const router = express.Router();

// GET all graphics
router.get('/', async (req, res) => {
  try {
    const graphics = await Graphic.find().sort({ createdAt: -1 });
    res.json(graphics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graphics', details: error.message });
  }
});

// GET single graphic
router.get('/:id', async (req, res) => {
  try {
    const graphic = await Graphic.findById(req.params.id);
    if (!graphic) return res.status(404).json({ error: 'Graphic not found' });
    res.json(graphic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graphic', details: error.message });
  }
});

// POST new graphic
router.post('/', async (req, res) => {
  try {
    const { title, client, category, image, format, tags, featured } = req.body;
    if (!title || !image) {
      return res.status(400).json({ error: 'Title and image are required' });
    }
    const graphic = new Graphic({
      title,
      client,
      category,
      image,
      format,
      tags: Array.isArray(tags) ? tags : [],
      featured: !!featured,
    });
    const saved = await graphic.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create graphic', details: error.message });
  }
});

// PUT update graphic
router.put('/:id', async (req, res) => {
  try {
    const updated = await Graphic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Graphic not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update graphic', details: error.message });
  }
});

// DELETE graphic
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Graphic.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Graphic not found' });
    res.json({ message: 'Graphic deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete graphic', details: error.message });
  }
});

export default router;
