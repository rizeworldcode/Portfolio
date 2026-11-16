# 🌐 RizeWorld Digital Marketing - Complete URLs Directory

Yahan aapke poore project ke saare **Backend, APIs, Portfolios aur Database URLs** ek jagah diye gaye hain:

---

## ⚡ 1. Live Backend Server (Render)
| Service | URL | Description |
| :--- | :--- | :--- |
| **Backend Main URL** | `https://portfolio-j73f.onrender.com` | Live Render Cloud Server |
| **Central API Base** | `https://portfolio-j73f.onrender.com/api` | Sabhi CRUD & Auth requests ke liye |
| **Health Check** | `https://portfolio-j73f.onrender.com/api/health` | Live Server & DB connection status check |
| **Static Uploads** | `https://portfolio-j73f.onrender.com/uploads` | Uploaded images, posters & reels storage |

---

## 🔐 2. Admin & Authentication APIs (Brevo OTP + MongoDB Atlas)
| Endpoint | Method | Full URL | Description |
| :--- | :---: | :--- | :--- |
| **Admin Login** | `POST` | `https://portfolio-j73f.onrender.com/api/auth/login` | Email & Password verification |
| **Admin Register** | `POST` | `https://portfolio-j73f.onrender.com/api/auth/register` | New Admin creation |
| **Forgot Password** | `POST` | `https://portfolio-j73f.onrender.com/api/auth/forgot-password` | Brevo email par 6-digit OTP bhejne ke liye |
| **Verify OTP** | `POST` | `https://portfolio-j73f.onrender.com/api/auth/verify-otp` | OTP verify karne ke liye |
| **Reset Password** | `POST` | `https://portfolio-j73f.onrender.com/api/auth/reset-password` | Naya password save karne ke liye |
| **Current Admin Info**| `GET` | `https://portfolio-j73f.onrender.com/api/auth/me` | Session verification |

---

## 🎨 3. Creative Portfolios Data APIs
| Portfolio | Method | Full URL | Description |
| :--- | :---: | :--- | :--- |
| **Graphic Artworks** | `GET / POST` | `https://portfolio-j73f.onrender.com/api/graphics` | Graphic designs, posters, packaging |
| **Graphic Item By ID**| `PUT / DELETE` | `https://portfolio-j73f.onrender.com/api/graphics/:id` | Edit ya delete graphic artwork |
| **Video Reels** | `GET / POST` | `https://portfolio-j73f.onrender.com/api/videos` | 4K Cinema Reels & shoot videos |
| **Video Item By ID** | `PUT / DELETE` | `https://portfolio-j73f.onrender.com/api/videos/:id` | Edit ya delete video reel |
| **SEO Domination** | `GET / POST` | `https://portfolio-j73f.onrender.com/api/seo` | Client rank proofs, GSC metrics |
| **SEO Item By ID** | `PUT / DELETE` | `https://portfolio-j73f.onrender.com/api/seo/:id` | Edit ya delete SEO partner |
| **File Uploader** | `POST` | `https://portfolio-j73f.onrender.com/api/upload` | Upload images/videos to server |
| **Live Stats** | `GET` | `https://portfolio-j73f.onrender.com/api/stats` | Agency counts & live health metrics |

---

## 💻 4. Local Frontend Portfolio Ports
| Portfolio | Local Dev Port & URL | Description |
| :--- | :--- | :--- |
| **Admin Operations Studio** | `http://localhost:5176` | Central Studio Dashboard |
| **Graphic Studio Portfolio**| `http://localhost:5174` | Graphic Artworks & Visuals |
| **Video Reels Portfolio** | `http://localhost:5175` | 4K Commercials & Reels |
| **SEO Domination Portfolio**| `http://localhost:5173` | Google #1 SERP Domination |

---

## 🗄️ 5. Database Connection (MongoDB Atlas Cloud)
| Property | Value |
| :--- | :--- |
| **Cluster Host** | `portfolio.fwiulw5.mongodb.net` |
| **Database Name** | `rizeworld` |
| **Collections** | `admins`, `users`, `graphics`, `videos`, `seos` |
| **Master Admin Email** | `amamroney1166@gmail.com` |
| **Master Admin Password** | `Admin@123` |

---

## 📁 6. Where are these configured in Code?
- **Admin Central Config:** `admin/src/config/urls.js`
- **Admin Env File:** `admin/.env`
- **Admin API Service:** `admin/src/services/api.js`
- **Admin Vite Proxy:** `admin/vite.config.js`
- **Backend Env File:** `backend/.env`
- **Backend Server Entry:** `backend/server.js`
