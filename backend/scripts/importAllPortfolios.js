import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import Graphic from '../models/Graphic.js';
import Video from '../models/Video.js';
import Seo from '../models/Seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

// Import graphics from graphic/src/data/portfolioData.js
async function loadAllGraphics() {
  const portfolioDataPath = path.resolve(__dirname, '../../graphic/src/data/portfolioData.js');
  const module = await import(`file://${portfolioDataPath}`);
  const categories = module.PORTFOLIO_CATEGORIES || [];
  
  const graphics = [];
  for (const cat of categories) {
    for (const img of (cat.images || [])) {
      graphics.push({
        title: img.name || `${cat.title} Design`,
        client: cat.title || 'Brand Client',
        category: cat.tag || cat.category || 'Brand Artwork',
        image: img.src,
        format: img.aspectRatio === 1 ? 'Square (1:1)' : 'Poster (4:5)',
        tags: [cat.tag || cat.id, 'Client Portfolio', 'Design'],
        featured: cat.coverImage === img.src,
      });
    }
  }
  return graphics;
}

// Load all authentic video reels from allVideos.json
function loadAllVideos() {
  const allVideosPath = path.resolve(__dirname, '../../admin/src/data/allVideos.json');
  const raw = fs.readFileSync(allVideosPath, 'utf8');
  const list = JSON.parse(raw);
  return list.map((v, idx) => ({
    title: v.title,
    client: v.client,
    category: v.category,
    videoUrl: v.videoUrl || v.video,
    thumbnail: v.thumbnail || '',
    views: v.views || '180K',
    duration: v.duration || '0:30',
    tags: v.tags || [],
    featured: !!v.featured,
    isHero: idx === 0 || !!v.isHero,
    section: idx === 0 ? 'hero' : (v.section || 'reels'),
    priority: idx === 0 ? 1 : (idx + 2),
  }));
}

// Full SEO real rankings list
const allSeoCases = [
  {
    client: "Zoniraz Apparel",
    website: "zoniraz.com",
    thumbnail: "/seo_gsc_performance.jpg",
    rankingImage: "/seo_gsc_performance.jpg",
    image: "/seo_gsc_performance.jpg",
    topKeyword: "Urban Streetwear & Fashion India",
    googleRank: "Avg Pos 8.5",
    organicGrowth: "+480%",
    trafficMonthly: "2.72K Impressions",
    healthScore: "98/100",
    leadsPerMonth: "176 Clicks",
    status: "GSC Verified",
    featured: true,
  },
  {
    client: "Saniya Hospital",
    website: "saniyahospitalalwar.com",
    thumbnail: "/local-seo-alwar-rank.jpeg",
    rankingImage: "/local-seo-alwar-rank.jpeg",
    image: "/local-seo-alwar-rank.jpeg",
    topKeyword: "Best Multispeciality Hospital in Alwar",
    googleRank: "#1 Position",
    organicGrowth: "+420%",
    trafficMonthly: "64,200 visits",
    healthScore: "98/100",
    leadsPerMonth: "850+ Patient Inquiries",
    status: "Top 3 Secured",
    featured: true,
  },
  {
    client: "DWPS Alwar",
    website: "dwpsalwar.com",
    thumbnail: "/target-keywords-report.jpeg",
    rankingImage: "/target-keywords-report.jpeg",
    image: "/target-keywords-report.jpeg",
    topKeyword: "Top CBSE International School Alwar",
    googleRank: "#1 Position",
    organicGrowth: "+290%",
    trafficMonthly: "48,500 visits",
    healthScore: "96/100",
    leadsPerMonth: "420+ Admissions Forms",
    status: "Dominating SERP",
    featured: true,
  },
  {
    client: "Medicompares Portal",
    website: "medicompares.com",
    thumbnail: "/deepdive-gsc-performance.jpeg",
    rankingImage: "/deepdive-gsc-performance.jpeg",
    image: "/deepdive-gsc-performance.jpeg",
    topKeyword: "Medical Insurance Comparison India",
    googleRank: "#2 Position",
    organicGrowth: "+580%",
    trafficMonthly: "112,000 visits",
    healthScore: "99/100",
    leadsPerMonth: "2,400+ Policy Leads",
    status: "High Velocity",
    featured: false,
  },
  {
    client: "Local SEO in Alwar",
    website: "alwarbrands.in",
    thumbnail: "/local-seo-alwar-rank.jpeg",
    rankingImage: "/local-seo-alwar-rank.jpeg",
    image: "/local-seo-alwar-rank.jpeg",
    topKeyword: "Local Search Pack Dominance",
    googleRank: "#1 Local Pack",
    organicGrowth: "+520%",
    trafficMonthly: "88,000 impressions",
    healthScore: "99/100",
    leadsPerMonth: "1,200+ Calls",
    status: "GSC Verified",
    featured: true,
  },
  {
    client: "Technical SEO & Core Vitals",
    website: "healthcheck.org",
    thumbnail: "/technical-seo-code.jpeg",
    rankingImage: "/technical-seo-code.jpeg",
    image: "/technical-seo-code.jpeg",
    topKeyword: "Page Speed & Schema Markup",
    googleRank: "99% Health",
    organicGrowth: "+310%",
    trafficMonthly: "45,000 visits",
    healthScore: "99/100",
    leadsPerMonth: "400+ Inquiries",
    status: "Top 3 Secured",
    featured: false,
  },
  {
    client: "On-Page SEO Mapping",
    website: "contentrelevance.com",
    thumbnail: "/onpage-seo-mapping.jpeg",
    rankingImage: "/onpage-seo-mapping.jpeg",
    image: "/onpage-seo-mapping.jpeg",
    topKeyword: "Search Intent Keyword Structuring",
    googleRank: "#1 Position",
    organicGrowth: "+410%",
    trafficMonthly: "72,000 visits",
    healthScore: "97/100",
    leadsPerMonth: "950+ Conversions",
    status: "Dominating SERP",
    featured: true,
  },
];

async function importAll() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    console.log('📦 Reading all real Graphic Portfolio assets & Video Reels...');
    const allGraphics = await loadAllGraphics();
    const allVideos = loadAllVideos();
    console.log(`✨ Found ${allGraphics.length} authentic Graphic designs/photos!`);
    console.log(`✨ Found ${allVideos.length} authentic Video Reels!`);

    console.log('🧹 Clearing previous collections...');
    await Promise.all([
      Graphic.deleteMany({}),
      Video.deleteMany({}),
      Seo.deleteMany({}),
    ]);

    console.log('🌱 Inserting all real portfolio items into MongoDB Atlas...');
    await Promise.all([
      Graphic.insertMany(allGraphics),
      Video.insertMany(allVideos),
      Seo.insertMany(allSeoCases),
    ]);

    console.log(`🎉 SUCCESS! Imported:`);
    console.log(`   🎨 ${allGraphics.length} Graphic Artworks & Posters`);
    console.log(`   🎬 ${allVideos.length} Authentic Video Reels`);
    console.log(`   🚀 ${allSeoCases.length} Real SEO & Ranking Case Studies`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importAll();
