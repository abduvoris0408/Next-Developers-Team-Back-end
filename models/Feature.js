const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Feature nomi kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Nom 100 belgidan oshmasligi kerak'],
    },
    description: {
      type: String,
      required: [true, 'Tavsif kiritilishi shart'],
      maxlength: [1000, 'Tavsif 1000 belgidan oshmasligi kerak'],
    },
    icon: {
      type: String,
      required: [true, 'Icon kiritilishi shart'],
      default: 'fas fa-code',
    },
    image: {
      public_id: String,
      url: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ['development', 'design', 'marketing', 'consulting', 'support', 'other'],
      default: 'development',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
FeatureSchema.index({ title: 'text', description: 'text' });
FeatureSchema.index({ order: 1 });

module.exports = mongoose.model('Feature', FeatureSchema);
