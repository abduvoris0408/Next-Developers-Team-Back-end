require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Feature = require('./models/Feature');
const Product = require('./models/Product');
const TeamMember = require('./models/TeamMember');
const Technology = require('./models/Technology');
const Award = require('./models/Award');
const Testimonial = require('./models/Testimonial');
const Contact = require('./models/Contact');
const Attendance = require('./models/Attendance');

// Demo data
const users = [
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Super Admin',
    email: 'superadmin@company.com',
    password: 'super123',
    role: 'super-admin',
  },
];

const features = [
  {
    title: 'Web Development',
    description: 'Professional web dasturlash xizmatlari. Modern texnologiyalar va eng yaxshi amaliyotlar bilan.',
    icon: 'fas fa-code',
    category: 'development',
    benefits: [
      'Responsive dizayn',
      'SEO optimizatsiya',
      'Tez ishlash',
      '24/7 texnik yordam'
    ],
    order: 1,
  },
  {
    title: 'Mobile App Development',
    description: 'iOS va Android uchun mobil ilovalar yaratish. Native va cross-platform yechimlar.',
    icon: 'fas fa-mobile-alt',
    category: 'development',
    benefits: [
      'Cross-platform yechim',
      'Native perfomance',
      'Push notifications',
      'Offline rejim'
    ],
    order: 2,
  },
  {
    title: 'UI/UX Design',
    description: 'Zamonaviy va foydalanuvchilarga qulay interfeys dizayni. Brending va identifikatsiya.',
    icon: 'fas fa-palette',
    category: 'design',
    benefits: [
      'User research',
      'Wireframing',
      'Prototyping',
      'Usability testing'
    ],
    order: 3,
  },
];

const technologies = [
  {
    name: 'React',
    description: 'Frontend library for building user interfaces',
    category: 'frontend',
    type: 'library',
    proficiencyLevel: 'expert',
    yearsOfExperience: 5,
    isFeatured: true,
    color: '#61DAFB',
  },
  {
    name: 'Node.js',
    description: 'JavaScript runtime for backend development',
    category: 'backend',
    type: 'platform',
    proficiencyLevel: 'expert',
    yearsOfExperience: 5,
    isFeatured: true,
    color: '#339933',
  },
  {
    name: 'MongoDB',
    description: 'NoSQL database',
    category: 'database',
    type: 'platform',
    proficiencyLevel: 'advanced',
    yearsOfExperience: 4,
    isFeatured: true,
    color: '#47A248',
  },
  {
    name: 'Python',
    description: 'Programming language for AI/ML and web development',
    category: 'backend',
    type: 'language',
    proficiencyLevel: 'advanced',
    yearsOfExperience: 3,
    color: '#3776AB',
  },
];

const products = [
  {
    name: 'E-Commerce Platform',
    shortDescription: 'To\'liq funksional onlayn do\'kon platformasi',
    fullDescription: 'Zamonaviy e-commerce platformasi. To\'lov tizimlari, inventar boshqaruvi, analytics va ko\'plab boshqa imkoniyatlar.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800',
    },
    category: 'web-app',
    price: 'paid',
    status: 'stable',
    version: '2.1.0',
    isFeatured: true,
    features: [
      'To\'lov tizimlari integratsiyasi',
      'Inventar boshqaruvi',
      'Real-time analytics',
      'Multi-vendor support'
    ],
  },
  {
    name: 'Task Management App',
    shortDescription: 'Vazifalarni boshqarish uchun mobil ilova',
    fullDescription: 'Jamoa uchun mo\'ljallangan task management ilovasi. Kanban board, time tracking, reporting.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    },
    category: 'mobile-app',
    price: 'freemium',
    status: 'stable',
    version: '1.5.0',
    isFeatured: true,
    features: [
      'Kanban board',
      'Time tracking',
      'Team collaboration',
      'Detailed reporting'
    ],
  },
];

const teamMembers = [
  {
    name: 'John Doe',
    position: 'Lead Developer',
    bio: '10+ yillik tajribaga ega fullstack dasturchi. React va Node.js mutaxassisi.',
    avatar: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    email: 'john@company.com',
    department: 'fullstack',
    experience: 10,
    isFeatured: true,
    projectsCompleted: 50,
  },
  {
    name: 'Jane Smith',
    position: 'UI/UX Designer',
    bio: 'Kreativ dizayner. Foydalanuvchi tajribasini yaxshilashga ixtisoslashgan.',
    avatar: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    email: 'jane@company.com',
    department: 'design',
    experience: 7,
    isFeatured: true,
    projectsCompleted: 40,
  },
];

const awards = [
  {
    title: 'Best Software Company 2024',
    description: 'Yilning eng yaxshi dasturiy ta\'minot kompaniyasi mukofoti',
    organization: 'Tech Awards',
    category: 'quality',
    year: 2024,
    rank: '1st Place',
  },
  {
    title: 'Innovation Award',
    description: 'Innovatsion yechimlar uchun mukofot',
    organization: 'Innovation Forum',
    category: 'innovation',
    year: 2023,
    rank: 'Gold Medal',
  },
];

const testimonials = [
  {
    clientName: 'Michael Brown',
    clientPosition: 'CEO',
    clientCompany: 'Tech Startup Inc',
    testimonial: 'Ajoyib jamoa! Loyihamizni o\'z vaqtida va mukammal sifatda bajarishdi. Tavsiya qilamiz!',
    rating: 5,
    service: 'web-development',
    isVerified: true,
    isFeatured: true,
  },
  {
    clientName: 'Sarah Johnson',
    clientPosition: 'Marketing Director',
    clientCompany: 'Digital Agency',
    testimonial: 'Professional yondashuv va sifatli natija. Hamkorlikni davom ettiramiz.',
    rating: 5,
    service: 'mobile-development',
    isVerified: true,
    isFeatured: true,
  },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Delete existing data
    await User.deleteMany();
    await Feature.deleteMany();
    await Product.deleteMany();
    await TeamMember.deleteMany();
    await Technology.deleteMany();
    await Award.deleteMany();
    await Testimonial.deleteMany();
    await Contact.deleteMany();
    await Attendance.deleteMany();

    // Create new data
    const createdUsers = await User.create(users);
    const createdTechnologies = await Technology.create(technologies);
    
    // Products'ga technology'larni qo'shish
    products[0].technologies = [createdTechnologies[0]._id, createdTechnologies[1]._id];
    products[1].technologies = [createdTechnologies[0]._id];
    
    // TeamMembers'ga skill'larni qo'shish
    teamMembers[0].skills = [createdTechnologies[0]._id, createdTechnologies[1]._id];
    teamMembers[1].skills = [createdTechnologies[0]._id];

    await Feature.create(features);
    const createdProducts = await Product.create(products);
    await TeamMember.create(teamMembers);
    await Award.create(awards);
    
    // Testimonials'ga product qo'shish
    testimonials[0].project = createdProducts[0]._id;
    await Testimonial.create(testimonials);

    console.log('✅ Ma\'lumotlar muvaffaqiyatli import qilindi!');
    console.log(`\n📧 Admin login: admin@company.com`);
    console.log(`🔑 Parol: admin123\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Feature.deleteMany();
    await Product.deleteMany();
    await TeamMember.deleteMany();
    await Technology.deleteMany();
    await Award.deleteMany();
    await Testimonial.deleteMany();
    await Contact.deleteMany();

    console.log('❌ Barcha ma\'lumotlar o\'chirildi!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Xatolik:', error);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Foydalanish:');
  console.log('  node seeder.js -i  (Ma\'lumotlarni import qilish)');
  console.log('  node seeder.js -d  (Ma\'lumotlarni o\'chirish)');
  process.exit(0);
}
