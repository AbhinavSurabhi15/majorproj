# Read for Speed - Project Documentation

## Project Overview
**Name:** Read for Speed (Major Project)  
**Purpose:** A web application to help users enhance their reading speed and comprehension through exercises and tools.  
**Team:** Sahil Ali, Syed Kumail Rizvi, Mohd Maaz

---

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Radix UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas - clusterrfs.ccumhyd.mongodb.net)
- **State Management:** Redux Toolkit + Redux Persist
- **Authentication:** JWT, bcryptjs, reCAPTCHA
- **AI/ML:** Google Generative AI (Gemini), OpenAI
- **Other:** Nodemailer (email), Chart.js, WebGazer (eye tracking)

---

## Project Structure

```
majorproj/
├── BackEnd/           # Main User Backend (Port 8080)
├── FrontEnd/          # Main User Frontend (Port 5173)
├── admin/
│   ├── Backend/       # Admin Backend (Port 8082)
│   └── Frontend/      # Admin Frontend
└── README.md
```

---

## Backend Architecture (Main - Port 8080)

### Entry Point
- `server.js` - Express server, CORS, routes setup, MongoDB connection

### Database
- **Connection:** `db/dbConnect.js`
- **DB Name:** `mpdb` (from constants.js)
- **Connection String:** env.MONGODB_URI

### Models (MongoDB Schemas)

| Model | File | Key Fields |
|-------|------|------------|
| **User** | `UserModel.js` | name, email, password (hashed), isEmailVerified, isMFAEnabled, city, age, role (ref) |
| **Role** | `RoleModel.js` | name (user/admin) |
| **Exercise** | `ExerciseModel.js` | name, description, difficulty (minAge, maxAge, level), content (ref) |
| **Content** | `ContentModel.js` | contentType (text/textOnImage), text, imageUrl, description, mcqs[] (ref) |
| **MCQ** | `MCQModel.js` | question, options[], correctAnswer |
| **Result** | `ResultModel.js` | user (ref), exercise (ref), score, wpm, createdAt |
| **Verification** | `VerificationModel.js` | email, otp, otpExpiry |

### API Routes

#### User Routes (`/user/`)
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| POST | `/register` | registerUser | Create new user account |
| POST | `/login` | loginUser | Authenticate user, return JWT |
| POST | `/getAllDetails` | getAllDetails | Get user profile + results |
| PUT | `/update` | updateUser | Update user profile |
| POST | `/forgotPassword` | forgotPassword | Initiate password reset |

#### Exercise Routes (`/exercise/`)
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/getAll` | getAllExercise | Get all exercises with content |
| GET | `/getByName/:name` | getExcerciseByName | Get exercise by name |
| GET | `/getById/:id` | getExerciseById | Get exercise by ID |
| GET | `/getByAge/:age` | getExercisesByAge | Get exercises for age group |

#### Result Routes (`/user/result/`)
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| POST | `/create` | createResult | Save exercise result (score, wpm) |
| GET | `/getById/:id` | getResultById | Get result by ID |
| GET | `/getByUser/:email` | getResultByUserEmail | Get all results for user |

#### Email Routes (`/email/`)
- OTP generation and verification for email
- Uses Nodemailer with Gmail SMTP

### Middleware
- `checkAuth.js` - JWT verification

### Services
- `emailVerificationService.js` - OTP email + verification
- `forgetPasswordEmailService.js` - Password reset email

---

## Frontend Architecture (Main - Port 5173)

### Entry Point
- `main.jsx` - React Router setup, Redux Provider, routes

### State Management
- **Store:** `store/store.js` - Redux + Persist
- **Auth Slice:** `features/authSlice.js`
  - State: `currentUser`, `loggedIn`, `role`
  - Actions: `login`, `logout`

### API Configuration
- `services/axiosConfig.js` - Axios with JWT interceptor
- Base URL: `http://localhost:8080`

### Routes (React Router)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | App (Hero + Tables) | Home page |
| `/login` | Login | User login with reCAPTCHA |
| `/signup` | Signup | User registration |
| `/profile` | Profile | User dashboard + progress |
| `/exercise` | AllExercise | Exercise list |
| `/explore` | Explore | Browse content |
| `/leaderboard` | Leaderboard | Rankings (auth required) |
| `/community` | Community | Social features (auth required) |
| `/contact` | Contact | Contact form |
| `/fixations` | FixationPage | Eye fixation exercise |
| `/general-exercise` | GeneralExercise | General reading exercise |
| `/speedread` | SpeedReadingPage | Speed reading practice |
| `/comprehension` | Comprehension | MCQ quiz after reading |
| `/voice-exercise` | VoiceReadingPage | Voice-based reading |
| `/subvocalization` | WordbyWord | Word-by-word reading |
| `/skimming` | SkimmingExercise | Skimming practice |
| `/text-import` | TextImportAndSyncPage | Import custom text |
| `/test` | EyeTrackingComponent | WebGazer eye tracking |

### Key Components
- `Layout.jsx` - Main layout with Nav, theme, Chatbot
- `Nav.jsx` - Navigation bar
- `Chatbot.jsx` - AI chatbot (Gemini)
- `Profile.jsx` - User profile + progress charts

### Exercise Flow
1. User selects exercise from `/exercise`
2. Reads content in ExerciseOne/SpeedReadingPage (tracks time/WPM)
3. Answers MCQs in Comprehension
4. Result saved and displayed

---

## Admin Module (Port 8082)

### Admin Backend Routes (`/admin/`)

| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| POST | `/login` | login | Admin authentication |
| GET | `/exercise/getAll` | getAllExercise | List all exercises |
| GET | `/exercise/getById/:id` | getExerciseById | Get exercise details |
| POST | `/exercise/create` | createExercise | Create new exercise |
| PUT | `/exercise/updateById` | updateExerciseById | Update exercise |
| DELETE | `/exercise/deleteById/:id` | deleteExerciseById | Delete exercise |

### Admin Frontend
- Protected routes, redirects to login if no user
- SliderBar navigation
- Exercise management (CRUD)

---

## Database Seeding
- `seed.js` - Creates sample exercises for different age groups
- 6 sample exercises: Easy (6-8), Grade 2 (8-10), Grade 3 (10-12), Grade 4 (12-14), Grade 5 (14-16), Grade 6 (16-18)

---

## Environment Variables Required

```env
# Backend (.env)
PORT=8080
MONGODB_URI=mongodb+srv://<user>:<pass>@clusterrfs.ccumhyd.mongodb.net
JWT_SECRET=<secret>
CORS_ORIGIN=http://localhost:5173
EMAIL_USER=<email>
EMAIL_PASSWORD=<app-password>

# Frontend (for chatbot)
REACT_APP_GOOGLE_API_KEY=<gemini-api-key>
```

---

## Key Features

1. **Speed Reading Exercises**
   - Timed reading with WPM calculation
   - Age-appropriate difficulty levels (Easy/Medium/Hard)
   - Text and image-based content

2. **Comprehension Testing**
   - MCQ-based quizzes after reading
   - Score tracking and progress

3. **User Progress Tracking**
   - Results stored per exercise
   - Charts showing improvement
   - Average WPM calculation

4. **AI Chatbot**
   - Google Gemini integration
   - Speed reading tips and help

5. **Eye Tracking**
   - WebGazer integration
   - Fixation exercises

6. **Authentication**
   - JWT-based auth
   - Email verification with OTP
   - reCAPTCHA protection
   - MFA support (flag exists)

7. **Admin Panel**
   - Separate backend/frontend
   - Exercise CRUD operations
   - User management

---

## Common Tasks / How To

### Add New Exercise (via Admin)
POST `/admin/exercise/create` with:
```json
{
  "name": "Exercise Name",
  "description": "Description",
  "difficulty": { "minAge": 10, "maxAge": 12, "level": "Medium" },
  "contents": [{
    "contentType": "text",
    "text": "Reading content...",
    "mcqs": [
      { "question": "Q1?", "options": ["A","B","C","D"], "correctAnswer": "A" }
    ]
  }]
}
```

### User Registration Flow
1. POST `/user/register` → Creates user with hashed password
2. Email verification OTP sent
3. POST `/email/verify` → Verifies email

### Result Storage
POST `/user/result/create`:
```json
{
  "userId": "<ObjectId>",
  "exerciseId": "<ObjectId>",
  "score": 80,
  "wpm": 250
}
```

---

## Notes & Potential Issues

1. **CORS:** Configured for localhost:5173, update for production
2. **Passwords:** Hashed with bcryptjs (salt rounds: 8)
3. **JWT Expiry:** 12 hours (43200 seconds)
4. **Email:** Uses Gmail SMTP, needs app password
5. **Admin login:** Checks role === 'admin' via populated role

---

## Data Flow Diagrams

### User Authentication Flow
```
User → Login Page → POST /user/login → Backend validates → JWT returned → Stored in localStorage → Redux state updated
```

### Exercise Completion Flow
```
User → Select Exercise → Read Content (timer starts) → Complete Reading (WPM calculated) → Answer MCQs → POST /user/result/create → Result saved → Profile updated
```

### Admin Exercise Creation Flow
```
Admin → Login → Dashboard → Create Exercise Form → POST /admin/exercise/create → MCQs created → Content created → Exercise created → Response returned
```

---

## File Quick Reference

| Purpose | File |
|---------|------|
| DB Connection | `BackEnd/db/dbConnect.js` |
| User Model | `BackEnd/models/UserModel.js` |
| Exercise Model | `BackEnd/models/ExerciseModel.js` |
| Auth Logic | `BackEnd/controllers/userController.js` |
| Exercise Logic | `BackEnd/controllers/exerciseController.js` |
| Redux Auth | `FrontEnd/src/features/authSlice.js` |
| API Config | `FrontEnd/src/services/axiosConfig.js` |
| Router | `FrontEnd/src/main.jsx` |
| Profile Page | `FrontEnd/src/pages/User/Profile.jsx` |
| Exercise Pages | `FrontEnd/src/pages/Exercise/*.jsx` |

---

## Running the Project

### Backend (Main)
```bash
cd BackEnd
npm install
# Create .env file with required variables
npm run start
# Server runs on http://localhost:8080
```

### Frontend (Main)
```bash
cd FrontEnd
npm install
npm run dev
# App runs on http://localhost:5173
```

### Admin Backend
```bash
cd admin/Backend
npm install
npm run start
# Server runs on http://localhost:8082
```

### Admin Frontend
```bash
cd admin/Frontend
npm install
npm run dev
```

### Seeding Database
```bash
cd BackEnd
node seed.js
```
