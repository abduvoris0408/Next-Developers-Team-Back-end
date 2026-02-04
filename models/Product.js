const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi kiritilishi shart'],
      trim: true,
      unique: true,
      maxlength: [100, 'Nom 100 belgidan oshmasligi kerak'],
    },
    slug: {
      type: String,
      unique: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Qisqa tavsif kiritilishi shart'],
      maxlength: [200, 'Qisqa tavsif 200 belgidan oshmasligi kerak'],
    },
    fullDescription: {
      type: String,
      required: [true, 'To\'liq tavsif kiritilishi shart'],
    },
    mainImage: {
      public_id: String,
      url: {
        type: String,
        required: [true, 'Asosiy rasm kiritilishi shart'],
      },
    },
    gallery: [
      {
        public_id: String,
        url: String,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
      },
    ],
    category: {
      type: String,
      required: [true, 'Kategoriya kiritilishi shart'],
      enum: ['web-app', 'mobile-app', 'desktop-app', 'ai-ml', 'blockchain', 'iot', 'other'],
    },
    price: {
      type: String,
      enum: ['free', 'freemium', 'paid', 'custom'],
      default: 'custom',
    },
    pricing: {
      currency: {
        type: String,
        default: 'USD',
      },
      amount: Number,
      period: {
        type: String,
        enum: ['one-time', 'monthly', 'yearly'],
      },
    },
    demoUrl: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'URL formati noto\'g\'ri',
      ],
    },
    githubUrl: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'URL formati noto\'g\'ri',
      ],
    },
    downloadUrl: String,
    status: {
      type: String,
      enum: ['development', 'beta', 'stable', 'discontinued'],
      default: 'stable',
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    releaseDate: {
      type: Date,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
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
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slug yaratish
ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Indexing
ProductSchema.index({ name: 'text', shortDescription: 'text', fullDescription: 'text' });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: -1, order: 1 });

module.exports = mongoose.model('Product', ProductSchema);
