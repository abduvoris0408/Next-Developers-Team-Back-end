# Software Company Website API

Dasturlar yaratadigan kompaniya sayti uchun to'liq backend API. Node.js, Express va MongoDB bilan qurilgan.

## 🚀 Features (Xususiyatlar)

- ✅ **Features Management** - Kompaniya xizmatlari boshqaruvi
- ✅ **Products Management** - Mahsulotlar va loyihalar
- ✅ **Team Management** - Jamoa a'zolari (Developers)
- ✅ **Technologies** - Ishlatilgan texnologiyalar
- ✅ **Awards & Achievements** - Yutuqlar va mukofotlar
- ✅ **Testimonials** - Mijozlar sharhlari
- ✅ **Contact Management** - Aloqa so'rovlari
- ✅ **Attendance System** - Xodimlar davomat tizimi (Check-in/Check-out)
- ✅ **Dashboard & Analytics** - To'liq statistika va hisobotlar
- ✅ **Authentication & Authorization** - JWT authentication
- ✅ **Role-based Access Control** - Admin va User rollari
- ✅ **Advanced Filtering & Pagination** - Qidirish va filtrlash
- ✅ **Swagger Documentation** - To'liq API dokumentatsiyasi
- ✅ **Security** - Helmet, XSS, Rate Limiting

## 📋 Requirements

- Node.js v14+
- MongoDB v4.4+
- npm yoki yarn

## ⚙️ O'rnatish

1. Repositoriyani clone qiling:

```bash
git clone <repository-url>
cd software-company-api
```

2. Dependencies o'rnating:

```bash
npm install
```

3. `.env` faylni sozlang:

```bash
cp .env.example .env
```

`.env` faylni tahrirlang va o'zingizning ma'lumotlaringizni kiriting.

4. Serverni ishga tushiring:

**Development rejimida:**

```bash
npm run dev
```

**Production rejimida:**

```bash
npm start
```

Server default ravishda `http://localhost:5000` da ishga tushadi.

## 📚 API Dokumentatsiya

API dokumentatsiyasini ko'rish uchun server ishga tushgandan keyin:

```
http://localhost:5000/api-docs
```

Swagger UI orqali barcha endpointlarni test qilish mumkin.

## 📚 API Endpoints

### Authentication

```
POST   /api/v1/auth/register       - Ro'yxatdan o'tish
POST   /api/v1/auth/login          - Tizimga kirish
GET    /api/v1/auth/logout         - Tizimdan chiqish
GET    /api/v1/auth/me             - Joriy user ma'lumotlari
PUT    /api/v1/auth/updatedetails  - User ma'lumotlarini yangilash
PUT    /api/v1/auth/updatepassword - Parolni yangilash
```

### Features (Xizmatlar)

```
GET    /api/v1/features           - Barcha xizmatlar
GET    /api/v1/features/active    - Faol xizmatlar
GET    /api/v1/features/:id       - Bitta xizmat
POST   /api/v1/features           - Yangi xizmat (Admin)
PUT    /api/v1/features/:id       - Xizmatni yangilash (Admin)
DELETE /api/v1/features/:id       - Xizmatni o'chirish (Admin)
```

### Products (Mahsulotlar)

```
GET    /api/v1/products                    - Barcha mahsulotlar
GET    /api/v1/products/featured/list      - Featured mahsulotlar
GET    /api/v1/products/category/:category - Kategoriya bo'yicha
GET    /api/v1/products/stats/overview     - Statistika (Admin)
GET    /api/v1/products/:idOrSlug          - Bitta mahsulot
POST   /api/v1/products                    - Yangi mahsulot (Admin)
PUT    /api/v1/products/:id                - Yangilash (Admin)
DELETE /api/v1/products/:id                - O'chirish (Admin)
```

### Team (Jamoa)

```
GET    /api/v1/team                       - Barcha jamoa a'zolari
GET    /api/v1/team/featured/list         - Featured a'zolar
GET    /api/v1/team/department/:dept      - Bo'lim bo'yicha
GET    /api/v1/team/:id                   - Bitta a'zo
POST   /api/v1/team                       - Yangi a'zo (Admin)
PUT    /api/v1/team/:id                   - Yangilash (Admin)
DELETE /api/v1/team/:id                   - O'chirish (Admin)
```

### Technologies (Texnologiyalar)

```
GET    /api/v1/technologies                   - Barcha texnologiyalar
GET    /api/v1/technologies/featured/list     - Featured texnologiyalar
GET    /api/v1/technologies/category/:cat     - Kategoriya bo'yicha
GET    /api/v1/technologies/:idOrSlug         - Bitta texnologiya
POST   /api/v1/technologies                   - Yangi (Admin)
PUT    /api/v1/technologies/:id               - Yangilash (Admin)
DELETE /api/v1/technologies/:id               - O'chirish (Admin)
```

### Awards (Mukofotlar)

```
GET    /api/v1/awards                 - Barcha mukofotlar
GET    /api/v1/awards/year/:year      - Yil bo'yicha
GET    /api/v1/awards/stats/overview  - Statistika
GET    /api/v1/awards/:id             - Bitta mukofot
POST   /api/v1/awards                 - Yangi (Admin)
PUT    /api/v1/awards/:id             - Yangilash (Admin)
DELETE /api/v1/awards/:id             - O'chirish (Admin)
```

### Testimonials (Sharhlar)

```
GET    /api/v1/testimonials                 - Barcha sharhlar
GET    /api/v1/testimonials/featured/list   - Featured sharhlar
GET    /api/v1/testimonials/rating/:rating  - Reyting bo'yicha
GET    /api/v1/testimonials/stats/overview  - Statistika
GET    /api/v1/testimonials/:id             - Bitta sharh
POST   /api/v1/testimonials                 - Yangi (Admin)
PUT    /api/v1/testimonials/:id             - Yangilash (Admin)
DELETE /api/v1/testimonials/:id             - O'chirish (Admin)
```

### Contacts (Aloqa)

```
POST   /api/v1/contacts                  - Yangi so'rov (Public)
GET    /api/v1/contacts                  - Barcha so'rovlar (Admin)
GET    /api/v1/contacts/stats/overview   - Statistika (Admin)
GET    /api/v1/contacts/:id              - Bitta so'rov (Admin)
PUT    /api/v1/contacts/:id              - Yangilash (Admin)
DELETE /api/v1/contacts/:id              - O'chirish (Admin)
POST   /api/v1/contacts/:id/notes        - Note qo'shish (Admin)
PUT    /api/v1/contacts/:id/assign/:uid  - Assign qilish (Admin)
```

### Attendance (Davomat)

```
POST   /api/v1/attendance/checkin        - Check-in (Keldi)
PUT    /api/v1/attendance/checkout/:id   - Check-out (Ketdi)
GET    /api/v1/attendance                - Barcha davomatlar (Admin)
GET    /api/v1/attendance/today/all      - Bugungi davomatlar (Admin)
GET    /api/v1/attendance/employee/:id   - Xodim bo'yicha davomatlar
GET    /api/v1/attendance/stats/overview - Davomat statistikasi (Admin)
GET    /api/v1/attendance/report/monthly - Oylik hisobot (Admin)
GET    /api/v1/attendance/:id            - Bitta davomat
POST   /api/v1/attendance                - Yangi davomat (Admin)
PUT    /api/v1/attendance/:id            - Yangilash (Admin)
PUT    /api/v1/attendance/:id/approve    - Tasdiqlash (Admin)
DELETE /api/v1/attendance/:id            - O'chirish (Admin)
```

### Dashboard (Statistika)

```
GET    /api/v1/dashboard/overview        - Umumiy ko'rinish (Admin)
GET    /api/v1/dashboard/products        - Mahsulotlar statistikasi (Admin)
GET    /api/v1/dashboard/team            - Jamoa statistikasi (Admin)
GET    /api/v1/dashboard/attendance      - Davomat statistikasi (Admin)
GET    /api/v1/dashboard/contacts        - Kontaktlar statistikasi (Admin)
GET    /api/v1/dashboard/analytics       - To'liq analytics (Admin)
```

## 🔍 Query Parameters

Barcha GET requestlarda quyidagi parametrlardan foydalanish mumkin:

### Pagination

```
?page=1&limit=10
```

### Sorting

```
?sort=name          # Ascending
?sort=-createdAt    # Descending
?sort=order,-name   # Multiple fields
```

### Field Limiting

```
?fields=name,description,image
```

### Filtering

```
?category=web-app
?isActive=true
?rating[gte]=4
```

### Search

```
?search=react
```

## 🔐 Authentication

API JWT (JSON Web Token) authentication ishlatadi.

### Login qilish:

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:

```json
{
	"success": true,
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"id": "...",
		"name": "Admin User",
		"email": "admin@example.com",
		"role": "admin"
	}
}
```

### Token ishlatish:

Header'da token yuborish:

```
Authorization: Bearer <token>
```

Yoki cookie orqali avtomatik yuboriladi.

## 🛡️ Roles & Permissions

- **Public** - Umumiy ma'lumotlarni ko'rish
- **User** - Asosiy funksiyalar
- **Admin** - CRUD operatsiyalari
- **Super Admin** - To'liq kirish

## 📦 Database Models

- **User** - Foydalanuvchilar
- **Feature** - Xizmatlar
- **Product** - Mahsulotlar
- **TeamMember** - Jamoa a'zolari
- **Technology** - Texnologiyalar
- **Award** - Mukofotlar
- **Testimonial** - Sharhlar
- **Contact** - Aloqa so'rovlari
- **Attendance** - Davomat (Check-in/Check-out)

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/software_company_db

JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@yourcompany.com
FROM_NAME=Your Company

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment

### Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
# ... boshqa environment variables
```

### DigitalOcean / VPS

```bash
# PM2 bilan
npm install -g pm2
pm2 start server.js --name software-company-api
pm2 save
pm2 startup
```

## 📄 License

MIT

## 👨‍💻 Author

Your Company Name

## 🤝 Contributing

Pull requests are welcome!

## 📞 Support

Savollar uchun: support@yourcompany.com

# Next-Developers-Team-Back-end
