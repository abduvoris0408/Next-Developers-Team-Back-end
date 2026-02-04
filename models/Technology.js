const mongoose = require('mongoose');
const slugify = require('slugify');

const TechnologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Texnologiya nomi kiritilishi shart'],
      trim: true,
      unique: true,
      maxlength: [100, 'Nom 100 belgidan oshmasligi kerak'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Tavsif 500 belgidan oshmasligi kerak'],
    },
    icon: {
      public_id: String,
      url: String,
    },
    logo: {
      public_id: String,
      url: String,
    },
    category: {
      type: String,
      required: [true, 'Kategoriya kiritilishi shart'],
      enum: [
        'frontend',
        'backend',
        'database',
        'mobile',
        'devops',
        'cloud',
        'ai-ml',
        'blockchain',
        'testing',
        'design',
        'other'
      ],
    },
    type: {
      type: String,
      enum: ['language', 'framework', 'library', 'tool', 'platform', 'other'],
      default: 'other',
    },
    officialWebsite: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'URL formati noto\'g\'ri',
      ],
    },
    documentation: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'URL formati noto\'g\'ri',
      ],
    },
    proficiencyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#000000',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Slug yaratish
TechnologySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Indexing
TechnologySchema.index({ name: 'text', description: 'text' });
TechnologySchema.index({ slug: 1 });
TechnologySchema.index({ category: 1 });
TechnologySchema.index({ isFeatured: -1, order: 1 });

module.exports = mongoose.model('Technology', TechnologySchema);
