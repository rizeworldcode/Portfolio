import express from 'express';
import Video from '../models/Video.js';

const router = express.Router();

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos', details: error.message });
  }
});

// GET single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video', details: error.message });
  }
});

// POST new video
router.post('/', async (req, res) => {
  try {
    const { title, client, category, videoUrl, thumbnail, views, duration, tags, featured } = req.body;
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
    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Video not found' });
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
