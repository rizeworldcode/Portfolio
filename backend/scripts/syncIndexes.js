import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Video from '../models/Video.js';
import Graphic from '../models/Graphic.js';
import Seo from '../models/Seo.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.mongo_URI || process.env.MONGO_URI;

async function syncAllIndexes() {
  console.log('🔄 Connecting to MongoDB to build and sync indexes...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas Cloud!');

    const models = [
      { name: 'Video', model: Video },
      { name: 'Graphic', model: Graphic },
      { name: 'Seo', model: Seo },
      { name: 'Admin', model: Admin },
      { name: 'User', model: User },
    ];

    for (const { name, model } of models) {
      console.log(`\n📌 Syncing indexes for [${name}]...`);
      await model.syncIndexes();
      const indexes = await model.collection.indexes();
      console.log(`   Active indexes on ${name} (${indexes.length}):`);
      indexes.forEach((idx, i) => {
        const keys = Object.entries(idx.key).map(([k, v]) => `${k}: ${v}`).join(', ');
        console.log(`   ${i + 1}. ${idx.name || 'unnamed'} -> { ${keys} }`);
      });
    }

    console.log('\n🎉 ALL MONGODB INDEXES CREATED & SYNCED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Error syncing indexes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

syncAllIndexes();
