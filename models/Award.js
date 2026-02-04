const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Mukofot nomi kiritilishi shart'],
      trim: true,
      maxlength: [200, 'Nom 200 belgidan oshmasligi kerak'],
    },
    description: {
      type: String,
      required: [true, 'Tavsif kiritilishi shart'],
      maxlength: [1000, 'Tavsif 1000 belgidan oshmasligi kerak'],
    },
    organization: {
      type: String,
      required: [true, 'Tashkilot nomi kiritilishi shart'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'innovation',
        'quality',
        'design',
        'customer-service',
        'growth',
        'leadership',
        'technology',
        'industry-specific',
        'other'
      ],
      default: 'other',
    },
    year: {
      type: Number,
      required: [true, 'Yil kiritilishi shart'],
      min: 1900,
      max: 2100,
    },
    date: {
      type: Date,
    },
    image: {
      public_id: String,
      url: String,
    },
    certificate: {
      public_id: String,
      url: String,
    },
    verificationUrl: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'URL formati noto\'g\'ri',
      ],
    },
    rank: {
      type: String,
      trim: true,
      comment: 'Masalan: 1st Place, Gold Medal, Top 10',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
AwardSchema.index({ title: 'text', description: 'text', organization: 'text' });
AwardSchema.index({ year: -1 });
AwardSchema.index({ category: 1 });
AwardSchema.index({ order: 1 });

module.exports = mongoose.model('Award', AwardSchema);
