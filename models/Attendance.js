const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeamMember',
      required: [true, 'Xodim kiritilishi shart'],
    },
    date: {
      type: Date,
      required: [true, 'Sana kiritilishi shart'],
      default: Date.now,
    },
    checkIn: {
      type: Date,
      required: [true, 'Kelish vaqti kiritilishi shart'],
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half-day', 'leave', 'holiday'],
      default: 'present',
    },
    leaveType: {
      type: String,
      enum: ['sick', 'casual', 'annual', 'unpaid', 'other'],
    },
    workHours: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
      address: String,
    },
    notes: {
      type: String,
      maxlength: [500, 'Izoh 500 belgidan oshmasligi kerak'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    ipAddress: String,
    device: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate work hours before saving
AttendanceSchema.pre('save', function (next) {
  if (this.checkIn && this.checkOut) {
    const duration = (this.checkOut - this.checkIn) / (1000 * 60 * 60); // hours
    this.workHours = Math.round(duration * 100) / 100;

    // Calculate overtime (more than 8 hours)
    if (duration > 8) {
      this.overtime = Math.round((duration - 8) * 100) / 100;
    }
  }

  // Calculate late minutes (after 9:00 AM)
  if (this.checkIn) {
    const checkInTime = new Date(this.checkIn);
    const scheduledStart = new Date(checkInTime);
    scheduledStart.setHours(9, 0, 0, 0);

    if (checkInTime > scheduledStart) {
      this.lateMinutes = Math.round((checkInTime - scheduledStart) / (1000 * 60));
      if (this.lateMinutes > 15) {
        this.status = 'late';
      }
    }
  }

  next();
});

// Indexing
AttendanceSchema.index({ employee: 1, date: 1 });
AttendanceSchema.index({ date: -1 });
AttendanceSchema.index({ status: 1 });
AttendanceSchema.index({ location: '2dsphere' });

// Compound index to prevent duplicate entries
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
