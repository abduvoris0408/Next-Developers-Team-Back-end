const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Ism 100 belgidan oshmasligi kerak'],
    },
    position: {
      type: String,
      required: [true, 'Lavozim kiritilishi shart'],
      trim: true,
      maxlength: [100, 'Lavozim 100 belgidan oshmasligi kerak'],
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio 1000 belgidan oshmasligi kerak'],
    },
    avatar: {
      public_id: String,
      url: {
        type: String,
        required: [true, 'Rasm kiritilishi shart'],
      },
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email formati noto\'g\'ri',
      ],
    },
    phone: {
      type: String,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technology',
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
      website: String,
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
      comment: 'Yillar bilan',
    },
    department: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'mobile', 'devops', 'design', 'qa', 'management', 'marketing', 'other'],
      default: 'other',
    },
    joinDate: {
      type: Date,
      default: Date.now,
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
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
TeamMemberSchema.index({ name: 'text', position: 'text', bio: 'text' });
TeamMemberSchema.index({ department: 1 });
TeamMemberSchema.index({ isFeatured: -1, order: 1 });

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
