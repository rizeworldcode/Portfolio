import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  client: {
    type: String,
    trim: true,
    default: 'Production Client',
  },
  category: {
    type: String,
    trim: true,
    default: 'Commercial Reel',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  views: {
    type: String,
    default: '120K',
  },
  duration: {
    type: String,
    default: '0:30',
  },
  tags: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isHero: {
    type: Boolean,
    default: false,
    index: true,
  },
  section: {
    type: String,
    enum: ['hero', 'showcase', 'stream', 'reels'],
    default: 'reels',
    index: true,
  },
  priority: {
    type: Number,
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

videoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
videoSchema.set('toJSON', { virtuals: true });
videoSchema.set('toObject', { virtuals: true });

// ==========================================
// WORK 1: MONGODB INDEXING (PERFORMANCE)
// ==========================================
// 1. Ultra-fast Hero video lookup (<1ms)
videoSchema.index({ isHero: 1, priority: 1, createdAt: -1 });

// 2. Section & Priority listing (Showcase, Stream, Reels)
videoSchema.index({ section: 1, priority: 1, createdAt: -1 });

// 3. Category filtering and sorting
videoSchema.index({ category: 1, priority: 1, createdAt: -1 });

// 4. Featured video queries
videoSchema.index({ featured: 1, createdAt: -1 });

// 5. Default chronological sort
videoSchema.index({ createdAt: -1 });

// 6. Full-text search index for title, client, tags
videoSchema.index({ title: 'text', client: 'text', tags: 'text' });

const Video = mongoose.model('Video', videoSchema);
export default Video;
