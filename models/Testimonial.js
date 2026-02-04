const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Mijoz ismi kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Ism 100 belgidan oshmasligi kerak'],
    },
    clientPosition: {
      type: String,
      trim: true,
      maxlength: [100, 'Lavozim 100 belgidan oshmasligi kerak'],
    },
    clientCompany: {
      type: String,
      trim: true,
      maxlength: [100, 'Kompaniya nomi 100 belgidan oshmasligi kerak'],
    },
    clientAvatar: {
      public_id: String,
      url: String,
    },
    companyLogo: {
      public_id: String,
      url: String,
    },
    testimonial: {
      type: String,
      required: [true, 'Sharh kiritilishi shart'],
      minlength: [10, 'Sharh kamida 10 belgidan iborat bo\'lishi kerak'],
      maxlength: [2000, 'Sharh 2000 belgidan oshmasligi kerak'],
    },
    rating: {
      type: Number,
      required: [true, 'Reyting kiritilishi shart'],
      min: 1,
      max: 5,
      default: 5,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    service: {
      type: String,
      enum: ['web-development', 'mobile-development', 'ui-ux-design', 'consulting', 'maintenance', 'other'],
    },
    dateReceived: {
      type: Date,
      default: Date.now,
    },
    location: {
      country: String,
      city: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    socialProof: {
      linkedinUrl: String,
      websiteUrl: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
TestimonialSchema.index({ clientName: 'text', testimonial: 'text' });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ isFeatured: -1, order: 1 });
TestimonialSchema.index({ dateReceived: -1 });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
