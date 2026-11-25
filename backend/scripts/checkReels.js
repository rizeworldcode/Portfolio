import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Video from '../models/Video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const items = await Video.find({
    videoUrl: { $in: ['/videos-compressed/june-17.mp4', '/videos-compressed/water-cinematic.mp4'] }
  }).lean();
  console.log('Found in DB:\n', JSON.stringify(items, null, 2));
  await mongoose.disconnect();
}
check();
