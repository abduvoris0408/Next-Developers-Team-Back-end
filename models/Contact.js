const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Ism 100 belgidan oshmasligi kerak'],
    },
    email: {
      type: String,
      required: [true, 'Email kiritilishi shart'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email formati noto\'g\'ri',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Kompaniya nomi 100 belgidan oshmasligi kerak'],
    },
    subject: {
      type: String,
      required: [true, 'Mavzu kiritilishi shart'],
      trim: true,
      maxlength: [200, 'Mavzu 200 belgidan oshmasligi kerak'],
    },
    message: {
      type: String,
      required: [true, 'Xabar kiritilishi shart'],
      minlength: [10, 'Xabar kamida 10 belgidan iborat bo\'lishi kerak'],
      maxlength: [5000, 'Xabar 5000 belgidan oshmasligi kerak'],
    },
    service: {
      type: String,
      enum: [
        'web-development',
        'mobile-development',
        'ui-ux-design',
        'consulting',
        'maintenance',
        'custom-software',
        'other'
      ],
    },
    budget: {
      type: String,
      enum: ['< $5000', '$5000 - $10000', '$10000 - $25000', '$25000 - $50000', '> $50000', 'not-sure'],
    },
    timeline: {
      type: String,
      enum: ['urgent', '1-month', '1-3-months', '3-6-months', '6+ months', 'flexible'],
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'replied', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    source: {
      type: String,
      enum: ['website', 'social-media', 'referral', 'other'],
      default: 'website',
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ priority: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ name: 'text', email: 'text', message: 'text' });

module.exports = mongoose.model('Contact', ContactSchema);
