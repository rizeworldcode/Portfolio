import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  rankingImage: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  topKeyword: {
    type: String,
    default: 'Google Search Rank #1',
  },
  category: {
    type: String,
    default: 'Local Business & Maps (GMB)',
    trim: true,
  },
  googleRank: {
    type: String,
    default: '#1 Position',
  },
  organicGrowth: {
    type: String,
    default: '+350%',
  },
  trafficMonthly: {
    type: String,
    default: '50,000 visits',
  },
  healthScore: {
    type: String,
    default: '98/100',
  },
  leadsPerMonth: {
    type: String,
    default: '500+ Leads',
  },
  status: {
    type: String,
    default: 'Top 3 Secured',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

seoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
seoSchema.set('toJSON', { virtuals: true });
seoSchema.set('toObject', { virtuals: true });

// ==========================================
// WORK 1: MONGODB INDEXING (PERFORMANCE)
// ==========================================
// 1. Default chronological sorting
seoSchema.index({ createdAt: -1 });

// 2. Category filtering & sorting
seoSchema.index({ category: 1, createdAt: -1 });

// 3. Featured case studies queries
seoSchema.index({ featured: 1, createdAt: -1 });

// 4. Status filtering (e.g. 'Top 3 Secured')
seoSchema.index({ status: 1, createdAt: -1 });

// 5. Full-text search index for client, website, topKeyword
seoSchema.index({ client: 'text', website: 'text', topKeyword: 'text' });

const Seo = mongoose.model('Seo', seoSchema);
export default Seo;
