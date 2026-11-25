import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Video from '../models/Video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || process.env.mongo_URI;

if (!mongoUri) {
  console.error('MONGO_URI is missing in .env');
  process.exit(1);
}

const electionReels = [
  {
    title: 'Election',
    client: 'Election',
    category: 'Political & Election',
    videoUrl: '/videos-compressed/bhau-final.mp4',
    thumbnail: '/posters/bhau-final.webp',
    views: '210K',
    duration: '0:45',
    tags: ['Election', 'Political Campaign', 'Leadership', 'Public Rally'],
    featured: true,
    section: 'reels',
    priority: 1,
  },
  {
    title: 'Election',
    client: 'Election',
    category: 'Political & Election',
    videoUrl: '/videos-compressed/influencer-reel.mp4',
    thumbnail: '/posters/influencer-reel.webp',
    views: '195K',
    duration: '0:35',
    tags: ['Election', 'Voter Outreach', 'Campaign Video', 'Digital Campaign'],
    featured: true,
    section: 'reels',
    priority: 2,
  },
];

async function addReels() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('Connected to MongoDB successfully!');

    for (const item of electionReels) {
      const existing = await Video.findOne({ videoUrl: item.videoUrl });
      if (existing) {
        existing.title = item.title;
        existing.client = item.client;
        existing.category = item.category;
        existing.thumbnail = item.thumbnail;
        existing.views = item.views;
        existing.duration = item.duration;
        existing.tags = item.tags;
        existing.featured = item.featured;
        existing.section = item.section;
        await existing.save();
        console.log(`Updated existing video in DB: ${item.videoUrl} (_id: ${existing._id})`);
      } else {
        const created = await Video.create(item);
        console.log(`Created new video in DB: ${item.videoUrl} (_id: ${created._id})`);
      }
    }

    const count = await Video.countDocuments({ category: 'Political & Election' });
    console.log(`Total Political & Election videos in DB: ${count}`);

    await mongoose.disconnect();
    console.log('Disconnected cleanly from MongoDB.');
  } catch (err) {
    console.error('MongoDB operation error:', err.message);
    process.exit(1);
  }
}

addReels();
