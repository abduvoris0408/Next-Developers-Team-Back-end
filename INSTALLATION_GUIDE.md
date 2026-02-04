# Software Company API - O'rnatish Qo'llanmasi

## Tizim Talablari

- **Node.js**: v14.0.0 yoki yuqori
- **MongoDB**: v4.4 yoki yuqori
- **npm** yoki **yarn**

## 1. Loyihani O'rnatish

### Zip faylni ochish
```bash
unzip software-company-api.zip
cd software-company-api
```

### Dependencies o'rnatish
```bash
npm install
```

## 2. Environment Variables

`.env` fayl allaqachon yaratilgan va to'ldirilgan. Agar kerak bo'lsa, o'zgartirishlar kiriting:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://abduvoris04:6spWcUHvcyRtut9@cluster0.esl6cri.mongodb.net/software_company?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary (rasm yuklash uchun)
CLOUDINARY_CLOUD_NAME=dknud04zr
CLOUDINARY_API_KEY=998631728138773
CLOUDINARY_API_SECRET=k3BCchIgZJ6_J-0kMQ4qM--U694
```

## 3. Demo Ma'lumotlarni Yuklash

Database'ga demo ma'lumotlar yuklash uchun:

```bash
node seeder.js -i
```

Bu quyidagilarni yaratadi:
- 2 ta admin user
- Features (xizmatlar)
- Products (mahsulotlar)
- Team members (jamoa a'zolari)
- Technologies
- Awards
- Testimonials

**Default Admin Login:**
- Email: `admin@company.com`
- Parol: `admin123`

**Super Admin Login:**
- Email: `superadmin@company.com`
- Parol: `super123`

### Ma'lumotlarni o'chirish

```bash
node seeder.js -d
```

## 4. Serverni Ishga Tushirish

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server `http://localhost:5000` da ishga tushadi.

## 5. API Dokumentatsiya

Swagger dokumentatsiyasini ko'rish:
```
http://localhost:5000/api-docs
```

## 6. API Endpoints

Barcha endpointlar:
```
http://localhost:5000/
```

Bu quyidagi ma'lumotlarni ko'rsatadi:
- Barcha mavjud endpointlar
- API versiyasi
- Dokumentatsiya linki

## 7. Postman Testing

Postman collection faylini import qiling va API'ni test qiling:
1. Postman'da `Import` tugmasini bosing
2. `postman-collection.json` faylni tanlang
3. Collection import bo'ladi

## 8. Authentication

API JWT authentication ishlatadi.

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123"
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
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### Token ishlatish

Har bir protected endpoint uchun token headerga qo'shiladi:
```
Authorization: Bearer <your-token-here>
```

## 9. Davomat Tizimi

### Check-in (Keldi)
```bash
POST /api/v1/attendance/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": "team-member-id",
  "location": {
    "coordinates": [69.2401, 41.2995],
    "address": "Tashkent, Uzbekistan"
  },
  "notes": "Keldim"
}
```

### Check-out (Ketdi)
```bash
PUT /api/v1/attendance/checkout/:attendanceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Ketdim"
}
```

## 10. Dashboard

Dashboard statistikasini olish:

```bash
GET /api/v1/dashboard/overview
Authorization: Bearer <token>
```

Bu quyidagi ma'lumotlarni qaytaradi:
- Umumiy statistika
- Bugungi davomat
- So'nggi faoliyatlar
- Oylik tendensiyalar

## 11. Troubleshooting

### MongoDB Connection Error

Agar MongoDB'ga ulanishda xatolik bo'lsa:
1. Internet ulanishini tekshiring
2. MongoDB URI to'g'riligini tekshiring
3. MongoDB serveringiz ishlayotganligini tekshiring

### Port allaqachon band

Agar 5000 port band bo'lsa:
1. `.env` faylda `PORT` ni o'zgartiring
2. Yoki boshqa procesni to'xtating: `lsof -ti:5000 | xargs kill -9`

### Dependencies Error

Agar dependencies o'rnatishda xatolik bo'lsa:
```bash
# node_modules va lock faylni o'chirish
rm -rf node_modules package-lock.json

# Qayta o'rnatish
npm install
```

## 12. Production Deployment

### Environment Variables
Production'da `.env` faylni to'ldiring:
- `NODE_ENV=production`
- O'zingizning MongoDB URI
- O'zingizning JWT_SECRET
- CORS_ORIGIN'ni frontend URL'ga o'zgartiring

### PM2 bilan
```bash
npm install -g pm2
pm2 start server.js --name software-company-api
pm2 save
pm2 startup
```

### Docker bilan
Docker file ham qo'shilishi mumkin.

## Yordam

Savollar yoki muammolar bo'lsa:
- GitHub Issues
- Email: support@yourcompany.com

## Litsenziya

MIT
