import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Graphic from '../models/Graphic.js';
import Video from '../models/Video.js';
import Seo from '../models/Seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const initialGraphics = [
  {
    title: "Chirag Jewellers Luxury Diamond Collection",
    client: "Chirag Jewellers",
    category: "Brand Campaign",
    format: "Poster (4:5)",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
    tags: ["Jewelry", "Luxury", "Poster"],
    featured: true,
  },
  {
    title: "Zoniraz Urban Streetwear Drop Lookbook",
    client: "Zoniraz Apparel",
    category: "Social Media Campaign",
    format: "Square (1:1)",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    tags: ["Fashion", "Gen-Z", "Streetwear"],
    featured: true,
  },
  {
    title: "Kafesa Cafe Artisan Menu & Table Tent",
    client: "Kafesa Lounge",
    category: "Print & Packaging",
    format: "Brochure (A4)",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    tags: ["Menu Design", "Cafe Branding", "Print"],
    featured: false,
  },
  {
    title: "Ambhuti Industrial Tile Adhesive Tub 3D",
    client: "Ambhuti Chemicals",
    category: "3D Product Render",
    format: "Packaging (16:9)",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80",
    tags: ["Packaging", "3D CGI", "Industrial"],
    featured: false,
  },
];

const initialVideos = [
  {
    title: "Rizeworld Master Cinematic Showcase",
    client: "Rizeworld Studio",
    category: "Master Production",
    videoUrl: "/videos-compressed/rizeworld-gmb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    views: "520K",
    duration: "1:00",
    tags: ["Cinematic", "Showreel", "Hero Reel", "4K Video"],
    featured: true,
    isHero: true,
    section: "hero",
    priority: 1,
  },
  {
    title: "Avantika Crunch Logs Gourmet Bites",
    client: "Avantika Cafe & Restaurant",
    category: "Cafe & Restaurant",
    videoUrl: "/videos-compressed/avan-spring.mp4",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    views: "185K",
    duration: "0:45",
    tags: ["Crunch Logs", "Cafe Delights", "Food Reel"],
    featured: true,
  },
  {
    title: "Avantika Navratri Festive Grand Feast",
    client: "Avantika Restaurant & Banquet",
    category: "Cafe & Restaurant",
    videoUrl: "/videos-compressed/avantika-navratri.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    views: "245K",
    duration: "0:50",
    tags: ["Festive Feast", "Grand Celebrations", "Dining"],
    featured: true,
  },
  {
    title: "Ambhuti High-Performance Adhesives Reel 2.1",
    client: "Ambhuti Chemicals",
    category: "Real Estate & Infra",
    videoUrl: "/videos-compressed/ambhuti-reel-2-1.mp4",
    thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
    views: "160K",
    duration: "0:40",
    tags: ["Construction", "Adhesives", "Build Tech"],
    featured: false,
  },
  {
    title: "Saniya Hospital Specialized Doctors & OPD",
    client: "Saniya Hospital",
    category: "Hospital & Healthcare",
    videoUrl: "/videos-compressed/saniya-bhumika.mp4",
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    views: "156K",
    duration: "0:40",
    tags: ["Healthcare", "Surgery", "Medical OPD"],
    featured: false,
  },
  {
    title: "DWPS Foundation Day Celebrations",
    client: "DWPS Alwar",
    category: "School & Education",
    videoUrl: "/videos-compressed/dwps-26.mp4",
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    views: "210K",
    duration: "0:52",
    tags: ["Annual Function", "Dance", "School"],
    featured: true,
  },
];

const initialSeo = [
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
    thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    rankingImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
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
    thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    rankingImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
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
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    rankingImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
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
    client: "Sigdi Food Lounge",
    website: "sigdifoodlounge.com",
    thumbnail: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    rankingImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    topKeyword: "Best Family Restaurant & BBQ Alwar",
    googleRank: "#1 Position",
    organicGrowth: "+350%",
    trafficMonthly: "38,000 visits",
    healthScore: "95/100",
    leadsPerMonth: "650+ Table Bookings",
    status: "Top 3 Secured",
    featured: false,
  },
];

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!');

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      Graphic.deleteMany({}),
      Video.deleteMany({}),
      Seo.deleteMany({}),
    ]);

    console.log('🌱 Inserting initial Graphics, Videos & SEO...');
    await Promise.all([
      Graphic.insertMany(initialGraphics),
      Video.insertMany(initialVideos),
      Seo.insertMany(initialSeo),
    ]);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
