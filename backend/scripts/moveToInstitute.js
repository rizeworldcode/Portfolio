import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Video from '../models/Video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function moveReelsToInstitute() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB!');

    const res1 = await Video.findOneAndUpdate(
      { videoUrl: '/videos-compressed/june-17.mp4' },
      {
        $set: {
          title: 'Institute',
          client: 'Institute',
          category: 'School & Institute',
          thumbnail: '/posters/june-17.webp',
          tags: ['Institute', 'Skill Training', 'Education', 'Student Life'],
          section: 'reels',
        }
      },
      { new: true }
    );
    console.log('Updated june-17.mp4 in DB:', res1?._id, res1?.category, res1?.title);

    const res2 = await Video.findOneAndUpdate(
      { videoUrl: '/videos-compressed/water-cinematic.mp4' },
      {
        $set: {
          title: 'Institute',
          client: 'Institute',
          category: 'School & Institute',
          thumbnail: '/posters/water-cinematic.webp',
          tags: ['Institute', 'Campus Comedy', 'Youth', 'Student Reel'],
          section: 'reels',
        }
      },
      { new: true }
    );
    console.log('Updated water-cinematic.mp4 in DB:', res2?._id, res2?.category, res2?.title);

    const instCount = await Video.countDocuments({ category: 'School & Institute' });
    console.log('Total School & Institute videos in DB:', instCount);

    const lifeCount = await Video.countDocuments({ category: 'Lifestyle' });
    console.log('Remaining Lifestyle videos in DB:', lifeCount);

    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
  } catch (err) {
    console.error('Error updating DB:', err);
    process.exit(1);
  }
}

moveReelsToInstitute();
