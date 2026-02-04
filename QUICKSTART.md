# 🚀 Quick Start Guide

## 1 daqiqada ishga tushiring!

### 1. O'rnatish
```bash
# Zip faylni oching
unzip software-company-api.zip
cd software-company-api

# Dependencies
npm install
```

### 2. Database'ni to'ldiring
```bash
# Demo ma'lumotlarni yuklang
node seeder.js -i
```

### 3. Ishga tushiring
```bash
# Development mode
npm run dev

# Yoki production mode
npm start
```

✅ Server: `http://localhost:5000`

✅ API Docs: `http://localhost:5000/api-docs`

### 4. Login qiling

**Admin:**
- Email: `admin@company.com`
- Parol: `admin123`

**Super Admin:**
- Email: `superadmin@company.com`
- Parol: `super123`

### 5. Test qiling

#### Postman orqali
1. Postman'ni oching
2. Import qiling: File → Import
3. Collection'ni test qiling

#### cURL orqali
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'

# Products olish
curl http://localhost:5000/api/v1/products

# Dashboard
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/dashboard/overview
```

## Asosiy Endpointlar

### Public (token kerak emas)
- `GET /api/v1/products` - Mahsulotlar
- `GET /api/v1/team` - Jamoa
- `GET /api/v1/testimonials` - Sharhlar
- `POST /api/v1/contacts` - Aloqa formasi

### Protected (token kerak)
- `GET /api/v1/dashboard/overview` - Dashboard
- `POST /api/v1/attendance/checkin` - Keldi
- `PUT /api/v1/attendance/checkout/:id` - Ketdi

## Tezkor Komandalar

```bash
# Demo data yuklash
node seeder.js -i

# Demo data o'chirish
node seeder.js -d

# Development mode
npm run dev

# Production mode
npm start

# Test
npm test
```

## Keyingi Qadamlar

1. **Swagger'ni o'rganing**: `/api-docs`
2. **README.md'ni o'qing**: To'liq dokumentatsiya
3. **INSTALLATION_GUIDE.md**: Batafsil o'rnatish
4. **API_FEATURES.md**: Barcha xususiyatlar

## Yordam Kerakmi?

- 📚 Swagger Docs: `/api-docs`
- 📖 README.md
- 📧 support@yourcompany.com

---
**Omad!** 🎉
