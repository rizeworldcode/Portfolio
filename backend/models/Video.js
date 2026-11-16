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

const Video = mongoose.model('Video', videoSchema);
export default Video;
