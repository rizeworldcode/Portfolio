import mongoose from 'mongoose';

const graphicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  client: {
    type: String,
    trim: true,
    default: 'Creative Client',
  },
  category: {
    type: String,
    trim: true,
    default: 'Brand Artwork',
  },
  image: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'Poster (4:5)',
  },
  tags: {
    type: [String],
    default: [],
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

// Virtual id field for frontend compatibility
graphicSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
graphicSchema.set('toJSON', { virtuals: true });
graphicSchema.set('toObject', { virtuals: true });

// ==========================================
// WORK 1: MONGODB INDEXING (PERFORMANCE)
// ==========================================
// 1. Default chronological sorting
graphicSchema.index({ createdAt: -1 });

// 2. Category filtering & sorting
graphicSchema.index({ category: 1, createdAt: -1 });

// 3. Featured graphics queries
graphicSchema.index({ featured: 1, createdAt: -1 });

// 4. Format filtering (e.g. Poster, Square)
graphicSchema.index({ format: 1, createdAt: -1 });

// 5. Full-text search index for title, client, tags
graphicSchema.index({ title: 'text', client: 'text', tags: 'text' });

const Graphic = mongoose.model('Graphic', graphicSchema);
export default Graphic;
