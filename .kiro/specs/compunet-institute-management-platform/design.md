# Design Document: CompuNet Institute Management Platform

## Overview

The CompuNet Institute Management Platform transforms the existing static website into a comprehensive institute management system while preserving all public-facing content. The platform consists of three main areas:

1. **Public Website** - Existing 8 pages (index, about, courses, admission, notes, gallery, payment, contact) remain accessible without authentication
2. **Student Portal** - Authenticated area for students to manage profiles, download notes, view certificates, and submit payments
3. **Admin Panel** - Authenticated area for administrators to manage students, courses, payments, notes, and certificates

The design follows a modern web architecture with a clear separation between frontend presentation, backend business logic, and data persistence layers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │   Student    │  │    Admin     │      │
│  │   Website    │  │   Portal     │  │    Panel     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Node.js + Express Backend               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Auth     │  │  Student   │  │   Admin    │    │   │
│  │  │  Service   │  │  Service   │  │  Service   │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   MongoDB    │              │   Firebase   │            │
│  │   Database   │              │   Storage    │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack Decision

**Backend: Node.js + Express + MongoDB**

Rationale:
- Full control over business logic and data validation
- Better suited for complex admin operations (bulk imports, exports, analytics)
- Easier to implement custom certificate generation with PDF libraries
- More flexible for future integrations (accounting software, SMS gateways)
- Better performance for complex queries and reporting
- Lower long-term costs compared to Firebase for high-volume operations

**File Storage: Firebase Storage**

Rationale:
- Excellent CDN performance for PDF downloads
- Simple integration with secure download URLs
- Built-in security rules for access control
- Automatic image optimization
- Cost-effective for file storage

**Frontend: Vanilla JavaScript + Bootstrap 5**

Rationale:
- Maintains consistency with existing website design
- No framework learning curve for maintenance
- Lightweight and fast page loads
- Progressive enhancement approach

### System Components

#### 1. Authentication Service
- Handles student and admin login/logout
- Session management with JWT tokens
- Password hashing with bcrypt
- Rate limiting for failed attempts
- Password reset functionality

#### 2. Student Service
- Profile management
- Course enrollment tracking
- Payment submission
- Notes access control
- Certificate retrieval

#### 3. Admin Service
- Student CRUD operations
- Course management
- Payment verification
- Notes upload and management
- Certificate generation
- Analytics and reporting

#### 4. File Service
- Upload to Firebase Storage
- Secure download URL generation
- File validation and size limits
- Metadata management

#### 5. Notification Service
- Email sending (admission confirmation, payment verification, certificates)
- SMS sending (critical notifications)
- Template management

## Components and Interfaces

### Frontend Components

#### Public Website Components
- Navigation menu (sticky)
- Course cards
- Statistics counters (animated)
- Testimonials carousel
- Gallery lightbox
- Contact form
- WhatsApp floating button

#### Student Portal Components
- Login form
- Dashboard summary cards
- Profile editor
- Notes list with download buttons
- Certificate viewer
- Payment submission form
- Payment history table

#### Admin Panel Components
- Admin login form
- Dashboard statistics cards
- Student management table (paginated, searchable)
- Course management interface
- Notes upload interface
- Payment verification queue
- Certificate generator
- Export buttons (Excel)
- Audit log viewer

### Backend API Interfaces

#### Authentication Endpoints

```
POST   /api/auth/student/login
POST   /api/auth/student/logout
POST   /api/auth/student/reset-password
POST   /api/auth/student/reset-password/confirm

POST   /api/auth/admin/login
POST   /api/auth/admin/logout

GET    /api/auth/verify-session
```

#### Student Endpoints

```
POST   /api/students/register          (public - admission form)
GET    /api/students/me                (authenticated student)
PUT    /api/students/me                (authenticated student)
GET    /api/students/me/notes          (authenticated student)
GET    /api/students/me/certificates   (authenticated student)
GET    /api/students/me/payments       (authenticated student)
POST   /api/students/me/payments       (authenticated student)
```

#### Admin Student Management Endpoints

```
GET    /api/admin/students             (paginated, searchable)
POST   /api/admin/students             (create student)
GET    /api/admin/students/:id
PUT    /api/admin/students/:id
DELETE /api/admin/students/:id
POST   /api/admin/students/import      (Excel upload)
GET    /api/admin/students/export      (Excel download)
```

#### Admin Course Management Endpoints

```
GET    /api/admin/courses
POST   /api/admin/courses
GET    /api/admin/courses/:id
PUT    /api/admin/courses/:id
GET    /api/admin/courses/:id/students
```

#### Admin Notes Management Endpoints

```
GET    /api/admin/notes
POST   /api/admin/notes                (multipart/form-data)
GET    /api/admin/notes/:id
PUT    /api/admin/notes/:id
DELETE /api/admin/notes/:id
GET    /api/admin/notes/:id/analytics
```

#### Admin Payment Management Endpoints

```
GET    /api/admin/payments             (filterable by status)
GET    /api/admin/payments/:id
PUT    /api/admin/payments/:id/verify
PUT    /api/admin/payments/:id/reject
GET    /api/admin/payments/export      (Excel download)
```

#### Admin Certificate Management Endpoints

```
GET    /api/admin/certificates
POST   /api/admin/certificates/generate
GET    /api/admin/certificates/:id
POST   /api/admin/certificates/:id/regenerate
```

#### Admin Analytics Endpoints

```
GET    /api/admin/dashboard/stats
GET    /api/admin/analytics/downloads
GET    /api/admin/analytics/enrollments
GET    /api/admin/audit-logs
```

#### File Download Endpoints

```
GET    /api/files/notes/:id/download
GET    /api/files/certificates/:id/download
```

### API Request/Response Formats

#### Student Registration Request
```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "course": "RS-CIT",
  "address": "123 Main St, Jaipur"
}
```

#### Student Registration Response
```json
{
  "success": true,
  "message": "Registration successful. Login credentials sent to your email.",
  "data": {
    "studentId": "STU001",
    "email": "rahul@example.com"
  }
}
```

#### Login Request
```json
{
  "identifier": "rahul@example.com",
  "password": "temp123"
}
```

#### Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "STU001",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "role": "student"
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "phone": "Phone number must be exactly 10 digits",
      "email": "Email is already registered"
    }
  }
}
```

## Data Models

### Database Schema (MongoDB)

#### Students Collection
```javascript
{
  _id: ObjectId,
  studentId: String,           // Unique: "STU001", "STU002", etc.
  name: String,                // Required
  phone: String,               // Required, Unique, 10 digits
  email: String,               // Required, Unique
  password: String,            // Hashed with bcrypt
  course: String,              // Required, references courses
  address: String,             // Required
  enrollmentDate: Date,        // Auto-generated
  paymentStatus: String,       // "not_submitted", "pending", "verified"
  isActive: Boolean,           // Default: true
  createdAt: Date,
  updatedAt: Date,
  createdBy: String,           // "self" or admin ID
  
  // Indexes
  indexes: [
    { studentId: 1 },
    { email: 1 },
    { phone: 1 },
    { course: 1 },
    { enrollmentDate: -1 }
  ]
}
```

#### Courses Collection
```javascript
{
  _id: ObjectId,
  courseId: String,            // Unique: "CRS001", etc.
  name: String,                // Required, Unique
  duration: String,            // e.g., "3 months", "6 months"
  fee: Number,                 // In rupees
  description: String,
  isActive: Boolean,           // Default: true
  enrollmentCount: Number,     // Cached count
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    { courseId: 1 },
    { name: 1 },
    { isActive: 1 }
  ]
}
```

#### Payments Collection
```javascript
{
  _id: ObjectId,
  paymentId: String,           // Unique: "PAY001", etc.
  studentId: String,           // References students
  studentName: String,         // Denormalized for reporting
  course: String,              // Denormalized for reporting
  amount: Number,              // In rupees
  screenshotUrl: String,       // Firebase Storage URL
  screenshotPath: String,      // Firebase Storage path
  status: String,              // "pending", "verified", "rejected"
  submittedAt: Date,
  verifiedAt: Date,
  verifiedBy: String,          // Admin ID
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    { paymentId: 1 },
    { studentId: 1 },
    { status: 1 },
    { submittedAt: -1 }
  ]
}
```

#### Notes Collection
```javascript
{
  _id: ObjectId,
  noteId: String,              // Unique: "NOTE001", etc.
  title: String,               // Required
  course: String,              // Required, references courses
  fileUrl: String,             // Firebase Storage URL
  filePath: String,            // Firebase Storage path
  fileSize: Number,            // In bytes
  uploadedBy: String,          // Admin ID
  uploadedAt: Date,
  downloadCount: Number,       // Cached count
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    { noteId: 1 },
    { course: 1 },
    { uploadedAt: -1 }
  ]
}
```

#### Certificates Collection
```javascript
{
  _id: ObjectId,
  certificateId: String,       // Unique: "CERT001", etc.
  certificateNumber: String,   // Unique: "CC/2024/001", etc.
  studentId: String,           // References students
  studentName: String,         // Denormalized
  course: String,              // Denormalized
  issueDate: Date,
  completionDate: Date,
  fileUrl: String,             // Firebase Storage URL
  filePath: String,            // Firebase Storage path
  generatedBy: String,         // Admin ID
  version: Number,             // For regeneration tracking
  isActive: Boolean,           // Latest version = true
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    { certificateId: 1 },
    { certificateNumber: 1 },
    { studentId: 1 },
    { isActive: 1 }
  ]
}
```

#### Admins Collection
```javascript
{
  _id: ObjectId,
  adminId: String,             // Unique: "ADM001", etc.
  name: String,                // Required
  email: String,               // Required, Unique
  password: String,            // Hashed with bcrypt
  role: String,                // "super_admin", "admin"
  isActive: Boolean,           // Default: true
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date,
  
  // Indexes
  indexes: [
    { adminId: 1 },
    { email: 1 }
  ]
}
```

#### Downloads Collection (Analytics)
```javascript
{
  _id: ObjectId,
  studentId: String,           // References students
  resourceType: String,        // "note" or "certificate"
  resourceId: String,          // Note ID or Certificate ID
  downloadedAt: Date,
  ipAddress: String,
  
  // Indexes
  indexes: [
    { studentId: 1, downloadedAt: -1 },
    { resourceId: 1, downloadedAt: -1 }
  ]
}
```

#### AuditLogs Collection
```javascript
{
  _id: ObjectId,
  userId: String,              // Student ID or Admin ID
  userType: String,            // "student" or "admin"
  action: String,              // "login", "create", "update", "delete", etc.
  resource: String,            // "student", "payment", "note", etc.
  resourceId: String,
  changes: Object,             // Before/after values for updates
  ipAddress: String,
  userAgent: String,
  timestamp: Date,
  
  // Indexes
  indexes: [
    { userId: 1, timestamp: -1 },
    { action: 1, timestamp: -1 },
    { resource: 1, timestamp: -1 }
  ]
}
```

#### Sessions Collection
```javascript
{
  _id: ObjectId,
  sessionId: String,           // Unique JWT token ID
  userId: String,              // Student ID or Admin ID
  userType: String,            // "student" or "admin"
  token: String,               // JWT token
  ipAddress: String,
  userAgent: String,
  expiresAt: Date,
  createdAt: Date,
  
  // Indexes
  indexes: [
    { sessionId: 1 },
    { userId: 1 },
    { expiresAt: 1 }            // TTL index for auto-deletion
  ]
}
```

### Firebase Storage Structure

```
/
├── payment-screenshots/
│   ├── {studentId}/
│   │   ├── {paymentId}_{timestamp}.jpg
│   │   └── {paymentId}_{timestamp}.png
│
├── notes/
│   ├── {course}/
│   │   ├── {noteId}_{title}.pdf
│   │   └── {noteId}_{title}.pdf
│
├── certificates/
│   ├── {year}/
│   │   ├── {certificateId}_{studentId}.pdf
│   │   └── {certificateId}_{studentId}.pdf
│
└── backups/
    ├── database/
    │   └── {date}/
    └── files/
        └── {date}/
```

### Firebase Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Payment screenshots - students can upload, admins can view
    match /payment-screenshots/{studentId}/{filename} {
      allow write: if request.auth != null && 
                      request.auth.token.studentId == studentId &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*|application/pdf');
      allow read: if request.auth != null && 
                     (request.auth.token.studentId == studentId || 
                      request.auth.token.role == 'admin');
    }
    
    // Notes - admins can upload, enrolled students can download
    match /notes/{course}/{filename} {
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin' &&
                      request.resource.size < 50 * 1024 * 1024 &&
                      request.resource.contentType == 'application/pdf';
      allow read: if request.auth != null && 
                     (request.auth.token.course == course || 
                      request.auth.token.role == 'admin');
    }
    
    // Certificates - admins can upload, specific students can download
    match /certificates/{year}/{filename} {
      allow write: if request.auth != null && 
                      request.auth.token.role == 'admin';
      allow read: if request.auth != null && 
                     (filename.matches('.*_' + request.auth.token.studentId + '.pdf') || 
                      request.auth.token.role == 'admin');
    }
    
    // Backups - admin only
    match /backups/{allPaths=**} {
      allow read, write: if request.auth != null && 
                            request.auth.token.role == 'admin';
    }
  }
}
```


## Authentication Flow

### Student Registration and Login Flow

```
┌─────────────┐
│   Student   │
│  Visits     │
│  Admission  │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  1. Fill admission form                 │
│     - Name, phone, email, course, addr  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  2. Frontend validation                 │
│     - Required fields                   │
│     - Email format                      │
│     - Phone format (10 digits)          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  3. POST /api/students/register         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  4. Backend validation                  │
│     - Check email uniqueness            │
│     - Check phone uniqueness            │
│     - Validate course exists            │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  5. Create student record               │
│     - Generate studentId (STU001)       │
│     - Generate temp password            │
│     - Hash password with bcrypt         │
│     - Save to database                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  6. Send notifications                  │
│     - Email with credentials            │
│     - SMS confirmation                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  7. Return success response             │
│     - Student ID                        │
│     - Confirmation message              │
└─────────────────────────────────────────┘
```


### Student Login Flow

```
┌─────────────┐
│   Student   │
│  Visits     │
│ Login Page  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  1. Enter credentials                   │
│     - Email or phone                    │
│     - Password                          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  2. POST /api/auth/student/login        │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  3. Find user by email or phone         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  4. Verify password with bcrypt         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  5. Check rate limiting                 │
│     - Max 5 attempts per 15 min         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  6. Generate JWT token                  │
│     - Payload: studentId, email, course │
│     - Expiry: 24 hours                  │
│     - Sign with secret key              │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  7. Create session record               │
│     - Store in sessions collection      │
│     - Record IP and user agent          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  8. Log audit event                     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  9. Return token and user data          │
│     - Set HTTP-only cookie              │
│     - Return JSON response              │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  10. Redirect to student dashboard      │
└─────────────────────────────────────────┘
```


### Admin Login Flow

```
┌─────────────┐
│    Admin    │
│  Visits     │
│ Admin Login │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  1. Enter credentials                   │
│     - Email                             │
│     - Password                          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  2. POST /api/auth/admin/login          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  3. Find admin by email                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  4. Verify password with bcrypt         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  5. Check rate limiting                 │
│     - Max 3 attempts per 10 min per IP  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  6. Generate JWT token                  │
│     - Payload: adminId, email, role     │
│     - Expiry: 8 hours                   │
│     - Sign with secret key              │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  7. Create session record               │
│     - Store in sessions collection      │
│     - Record IP and user agent          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  8. Log audit event                     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  9. Return token and admin data         │
│     - Set HTTP-only cookie              │
│     - Return JSON response              │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  10. Redirect to admin dashboard        │
└─────────────────────────────────────────┘
```

### Session Management

**JWT Token Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "STU001",
    "email": "rahul@example.com",
    "role": "student",
    "course": "RS-CIT",
    "iat": 1704067200,
    "exp": 1704153600
  }
}
```

**Session Validation Middleware:**
- Extract token from Authorization header or cookie
- Verify token signature
- Check expiration
- Validate session exists in database
- Attach user data to request object

**Session Expiry:**
- Student sessions: 24 hours
- Admin sessions: 8 hours
- Automatic cleanup of expired sessions via TTL index


## Security Design

### Authentication Security

**Password Security:**
- Bcrypt hashing with cost factor 12
- Automatic salt generation
- No password storage in plain text
- Password reset via secure email tokens (1-hour expiry)

**Session Security:**
- JWT tokens signed with HS256 algorithm
- HTTP-only cookies to prevent XSS attacks
- Secure flag on cookies (HTTPS only)
- SameSite=Strict to prevent CSRF
- Token rotation on sensitive operations

**Rate Limiting:**
- Student login: 5 attempts per 15 minutes per account
- Admin login: 3 attempts per 10 minutes per IP
- API endpoints: 100 requests per minute per IP
- File uploads: 10 uploads per hour per user

### Authorization Security

**Role-Based Access Control (RBAC):**

```javascript
// Middleware: requireAuth
function requireAuth(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware: requireRole
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/students/me', requireAuth, requireRole('student'), getMyProfile);
app.get('/api/admin/students', requireAuth, requireRole('admin'), getAllStudents);
```

**Resource-Level Authorization:**
- Students can only access their own data
- Students can only download notes for their enrolled course
- Students can only download their own certificates
- Admins can access all resources


### Input Validation and Sanitization

**Validation Strategy:**
- Frontend validation for immediate user feedback
- Backend validation as the source of truth
- Use express-validator for request validation
- Sanitize all inputs to prevent injection attacks

**Validation Rules:**

```javascript
// Student registration validation
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).escape(),
  body('phone').matches(/^[0-9]{10}$/),
  body('email').isEmail().normalizeEmail(),
  body('course').isIn(['RS-CIT', 'Tally', 'Excel', 'Typing', 'Basic Computer', ...]),
  body('address').trim().isLength({ min: 5, max: 500 }).escape()
];

// File upload validation
const fileValidation = {
  paymentScreenshot: {
    mimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024  // 5MB
  },
  notePdf: {
    mimeTypes: ['application/pdf'],
    maxSize: 50 * 1024 * 1024  // 50MB
  }
};
```

**SQL/NoSQL Injection Prevention:**
- Use MongoDB parameterized queries
- Never concatenate user input into queries
- Use Mongoose schema validation
- Sanitize special characters

**XSS Prevention:**
- Escape HTML in user inputs
- Content Security Policy headers
- HTTP-only cookies
- Sanitize before rendering

**CSRF Prevention:**
- SameSite cookie attribute
- CSRF tokens for state-changing operations
- Verify Origin and Referer headers

### Data Protection

**Encryption:**
- TLS 1.3 for all data in transit
- HTTPS enforced on all endpoints
- Passwords hashed with bcrypt (never encrypted)
- Sensitive data encrypted at rest in database

**Data Access Control:**
- Database credentials stored in environment variables
- Firebase service account key secured
- No direct database access from frontend
- API gateway pattern for all data access

**Privacy Compliance:**
- Minimal data collection (only required fields)
- Student data accessible only to authorized users
- Audit logs for all data access
- Data retention policy (1 year for audit logs)


### Security Headers

```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "firebasestorage.googleapis.com"],
      connectSrc: ["'self'", "https://firebasestorage.googleapis.com"],
      fontSrc: ["'self'", "cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## File Storage Strategy

### Upload Flow

```
┌─────────────┐
│    User     │
│  Selects    │
│    File     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  1. Frontend validation                 │
│     - File type                         │
│     - File size                         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  2. Upload to backend                   │
│     - Multipart form data               │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  3. Backend validation                  │
│     - Verify file type                  │
│     - Verify file size                  │
│     - Scan for malware (optional)       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  4. Generate unique filename            │
│     - {resourceId}_{timestamp}.ext      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  5. Upload to Firebase Storage          │
│     - Use Firebase Admin SDK            │
│     - Set metadata                      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  6. Get download URL                    │
│     - Generate signed URL               │
│     - Set expiry (optional)             │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  7. Save metadata to database           │
│     - File URL                          │
│     - File path                         │
│     - File size                         │
│     - Upload timestamp                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  8. Return success response             │
└─────────────────────────────────────────┘
```


### Download Flow

```
┌─────────────┐
│    User     │
│   Clicks    │
│  Download   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  1. GET /api/files/{type}/{id}/download │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  2. Verify authentication               │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  3. Check authorization                 │
│     - Student: own course notes/certs   │
│     - Admin: all files                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  4. Fetch file metadata from database   │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  5. Generate signed download URL        │
│     - Firebase Storage signed URL       │
│     - 1-hour expiry                     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  6. Log download event                  │
│     - Record in downloads collection    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  7. Redirect to signed URL              │
│     - Browser downloads file            │
└─────────────────────────────────────────┘
```

### File Management

**Naming Convention:**
- Payment screenshots: `{paymentId}_{timestamp}.{ext}`
- Notes: `{noteId}_{sanitizedTitle}.pdf`
- Certificates: `{certificateId}_{studentId}.pdf`

**Metadata Storage:**
- File URL and path stored in MongoDB
- File size, upload date, uploader tracked
- Download count cached in database

**File Deletion:**
- Soft delete: mark as inactive in database
- Hard delete: remove from Firebase Storage after 30 days
- Cascade delete: when student deleted, mark all files inactive


## Frontend Architecture

### Page Structure

**Public Pages (No Authentication Required):**
- `/` - Homepage with statistics, testimonials
- `/about.html` - About institute
- `/courses.html` - Course listings
- `/admission.html` - Admission form (enhanced with API integration)
- `/notes.html` - Public notes info (redirects to login)
- `/gallery.html` - Photo gallery
- `/payment.html` - Payment info (redirects to login)
- `/contact.html` - Contact form

**Student Portal Pages (Authentication Required):**
- `/student/login.html` - Student login
- `/student/dashboard.html` - Dashboard with profile summary
- `/student/profile.html` - Profile management
- `/student/notes.html` - Course notes download
- `/student/certificates.html` - Certificate download
- `/student/payments.html` - Payment submission and history

**Admin Panel Pages (Admin Authentication Required):**
- `/admin/login.html` - Admin login
- `/admin/dashboard.html` - Statistics and overview
- `/admin/students.html` - Student management
- `/admin/courses.html` - Course management
- `/admin/notes.html` - Notes upload and management
- `/admin/payments.html` - Payment verification
- `/admin/certificates.html` - Certificate generation
- `/admin/analytics.html` - Download analytics
- `/admin/audit-logs.html` - Audit log viewer

### Routing Strategy

**Client-Side Routing:**
- Use vanilla JavaScript for navigation
- History API for clean URLs
- Page-specific JavaScript modules

**Route Protection:**
```javascript
// Check authentication on page load
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/verify-session', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      // Redirect to login
      window.location.href = '/student/login.html';
      return;
    }
    
    const { user } = await response.json();
    return user;
  } catch (error) {
    window.location.href = '/student/login.html';
  }
}

// Run on protected pages
document.addEventListener('DOMContentLoaded', async () => {
  const user = await checkAuth();
  if (user) {
    initializePage(user);
  }
});
```


### State Management

**Simple State Management Pattern:**
```javascript
// Global state object
const AppState = {
  user: null,
  students: [],
  courses: [],
  payments: [],
  notes: [],
  
  // Setters with side effects
  setUser(user) {
    this.user = user;
    this.render();
  },
  
  setStudents(students) {
    this.students = students;
    this.render();
  },
  
  // Render function
  render() {
    // Update UI based on state
    updateUI(this);
  }
};

// API service
const API = {
  async get(endpoint) {
    const response = await fetch(endpoint, { credentials: 'include' });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};
```

### UI Components

**Reusable Components:**

1. **Loading Spinner**
```html
<div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
```

2. **Alert Messages**
```javascript
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.getElementById('alert-container').appendChild(alert);
  
  setTimeout(() => alert.remove(), 5000);
}
```

3. **Data Table with Pagination**
```javascript
class DataTable {
  constructor(containerId, columns, data) {
    this.container = document.getElementById(containerId);
    this.columns = columns;
    this.data = data;
    this.currentPage = 1;
    this.pageSize = 20;
  }
  
  render() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageData = this.data.slice(start, end);
    
    // Render table HTML
    this.container.innerHTML = this.generateTableHTML(pageData);
    this.attachEventListeners();
  }
  
  generateTableHTML(data) {
    // Generate table markup
  }
}
```

4. **File Upload Component**
```javascript
class FileUploader {
  constructor(inputId, options) {
    this.input = document.getElementById(inputId);
    this.options = options;
    this.setupValidation();
  }
  
  setupValidation() {
    this.input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!this.validate(file)) {
        this.input.value = '';
        return;
      }
      this.preview(file);
    });
  }
  
  validate(file) {
    if (!this.options.allowedTypes.includes(file.type)) {
      showAlert('Invalid file type', 'danger');
      return false;
    }
    if (file.size > this.options.maxSize) {
      showAlert('File too large', 'danger');
      return false;
    }
    return true;
  }
}
```


5. **Modal Dialog**
```javascript
function showModal(title, content, actions) {
  const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('modalFooter').innerHTML = actions;
  modal.show();
}

// Usage
showModal(
  'Confirm Delete',
  'Are you sure you want to delete this student?',
  `
    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    <button class="btn btn-danger" onclick="deleteStudent()">Delete</button>
  `
);
```

### Form Handling

**Form Validation Pattern:**
```javascript
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.errors = {};
  }
  
  validate() {
    this.errors = {};
    const formData = new FormData(this.form);
    
    // Validate each field
    for (const [name, value] of formData.entries()) {
      const error = this.validateField(name, value);
      if (error) {
        this.errors[name] = error;
      }
    }
    
    this.displayErrors();
    return Object.keys(this.errors).length === 0;
  }
  
  validateField(name, value) {
    const rules = this.form.querySelector(`[name="${name}"]`).dataset;
    
    if (rules.required && !value) {
      return 'This field is required';
    }
    
    if (rules.email && !this.isValidEmail(value)) {
      return 'Invalid email format';
    }
    
    if (rules.phone && !this.isValidPhone(value)) {
      return 'Phone must be 10 digits';
    }
    
    return null;
  }
  
  displayErrors() {
    // Clear previous errors
    this.form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    this.form.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });
    
    // Display new errors
    for (const [name, error] of Object.entries(this.errors)) {
      const input = this.form.querySelector(`[name="${name}"]`);
      input.classList.add('is-invalid');
      
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = error;
      input.parentNode.appendChild(feedback);
    }
  }
  
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
  }
}
```


### Responsive Design Strategy

**Breakpoints (Bootstrap 5):**
- Mobile: < 576px
- Tablet: 576px - 991px
- Desktop: ≥ 992px

**Mobile-First Approach:**
```css
/* Base styles for mobile */
.student-card {
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .student-card {
    padding: 1.5rem;
  }
}

/* Desktop and up */
@media (min-width: 992px) {
  .student-card {
    padding: 2rem;
  }
}
```

**Mobile Navigation:**
```html
<!-- Mobile menu toggle -->
<button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
        data-bs-target="#navbarNav">
  <span class="navbar-toggler-icon"></span>
</button>

<!-- Collapsible menu -->
<div class="collapse navbar-collapse" id="navbarNav">
  <ul class="navbar-nav ms-auto">
    <li class="nav-item"><a class="nav-link" href="/student/dashboard.html">Dashboard</a></li>
    <li class="nav-item"><a class="nav-link" href="/student/notes.html">Notes</a></li>
    <li class="nav-item"><a class="nav-link" href="/student/certificates.html">Certificates</a></li>
    <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Logout</a></li>
  </ul>
</div>
```

## Integration Points

### Existing Website Integration

**Admission Form Enhancement:**
- Current: Static form with no backend
- Enhanced: Form submits to `/api/students/register`
- Preserve: Existing HTML structure and styling
- Add: JavaScript for API integration and validation

**Notes Page Enhancement:**
- Current: Static page with download links
- Enhanced: Redirect unauthenticated users to login
- Authenticated: Show course-specific notes from database
- Preserve: Page layout and design

**Payment Page Enhancement:**
- Current: Static page with UPI details
- Enhanced: Redirect to student portal for payment submission
- Preserve: UPI ID and QR code display

### Backend Integration Points

**Email Service Integration:**
```javascript
// Using Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendAdmissionEmail(student, tempPassword) {
  const mailOptions = {
    from: 'CompuNet Computer Center <noreply@compunet.com>',
    to: student.email,
    subject: 'Welcome to CompuNet Computer Center',
    html: `
      <h2>Welcome ${student.name}!</h2>
      <p>Your admission has been confirmed.</p>
      <p><strong>Student ID:</strong> ${student.studentId}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please login and change your password.</p>
      <p><a href="https://compunet.com/student/login.html">Login Here</a></p>
    `
  };
  
  await transporter.sendMail(mailOptions);
}
```


**SMS Service Integration:**
```javascript
// Using Twilio or similar SMS gateway
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendAdmissionSMS(student) {
  await client.messages.create({
    body: `Welcome to CompuNet! Your Student ID: ${student.studentId}. Check email for login details.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+91${student.phone}`
  });
}
```

**Certificate Generation Integration:**
```javascript
// Using PDFKit
const PDFDocument = require('pdfkit');
const fs = require('fs');

async function generateCertificate(student, course) {
  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape'
  });
  
  const filename = `${student.certificateId}_${student.studentId}.pdf`;
  const stream = fs.createWriteStream(`/tmp/${filename}`);
  
  doc.pipe(stream);
  
  // Add certificate content
  doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(25).text(student.name, { align: 'center', underline: true });
  doc.moveDown();
  doc.fontSize(18).text(`has successfully completed the course`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(22).text(course.name, { align: 'center', bold: true });
  doc.moveDown(2);
  doc.fontSize(14).text(`Certificate No: ${student.certificateNumber}`, { align: 'center' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(12).text('Director: Gayatri Joshi', { align: 'left' });
  doc.text('Principal: Suresh Joshi', { align: 'right' });
  
  doc.end();
  
  // Wait for file to be written
  await new Promise((resolve) => stream.on('finish', resolve));
  
  // Upload to Firebase Storage
  const bucket = admin.storage().bucket();
  await bucket.upload(`/tmp/${filename}`, {
    destination: `certificates/${new Date().getFullYear()}/${filename}`
  });
  
  // Clean up temp file
  fs.unlinkSync(`/tmp/${filename}`);
  
  return filename;
}
```

**Excel Export Integration:**
```javascript
// Using ExcelJS
const ExcelJS = require('exceljs');

async function exportStudentsToExcel(students) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students');
  
  // Define columns
  worksheet.columns = [
    { header: 'Student ID', key: 'studentId', width: 15 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Phone', key: 'phone', width: 15 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Course', key: 'course', width: 20 },
    { header: 'Enrollment Date', key: 'enrollmentDate', width: 15 },
    { header: 'Payment Status', key: 'paymentStatus', width: 15 }
  ];
  
  // Add rows
  students.forEach(student => {
    worksheet.addRow({
      studentId: student.studentId,
      name: student.name,
      phone: student.phone,
      email: student.email,
      course: student.course,
      enrollmentDate: student.enrollmentDate.toLocaleDateString('en-IN'),
      paymentStatus: student.paymentStatus
    });
  });
  
  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
```


## Error Handling

### Error Classification

**Client Errors (4xx):**
- 400 Bad Request - Invalid input data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource doesn't exist
- 409 Conflict - Duplicate email/phone
- 413 Payload Too Large - File size exceeded
- 429 Too Many Requests - Rate limit exceeded

**Server Errors (5xx):**
- 500 Internal Server Error - Unexpected server error
- 503 Service Unavailable - Database or external service down

### Error Response Format

```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "phone": "Phone number must be exactly 10 digits",
      "email": "Email is already registered"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Handling Strategy

**Database Errors:**
```javascript
try {
  await Student.create(studentData);
} catch (error) {
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ERROR',
        message: `${field} is already registered`
      }
    });
  }
  
  // Log error for debugging
  logger.error('Database error:', error);
  
  return res.status(500).json({
    success: false,
    error: {
      code: 'DATABASE_ERROR',
      message: 'An error occurred while processing your request'
    }
  });
}
```

**File Upload Errors:**
```javascript
async function handleFileUpload(req, res) {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'No file uploaded'
        }
      });
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }
      });
    }
    
    // Upload to Firebase
    const url = await uploadToFirebase(file);
    
    res.json({ success: true, url });
  } catch (error) {
    logger.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: 'Failed to upload file'
      }
    });
  }
}
```


**Authentication Errors:**
```javascript
async function login(req, res) {
  try {
    const { identifier, password } = req.body;
    
    // Check rate limiting
    const attempts = await getFailedAttempts(identifier);
    if (attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'TOO_MANY_ATTEMPTS',
          message: 'Too many failed login attempts. Please try again later.'
        }
      });
    }
    
    // Find user
    const user = await Student.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    
    if (!user) {
      await recordFailedAttempt(identifier);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials'
        }
      });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await recordFailedAttempt(identifier);
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials'
        }
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.studentId, email: user.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ success: true, token, user });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'An error occurred during login'
      }
    });
  }
}
```


**Frontend Error Handling:**
```javascript
async function submitForm(formData) {
  try {
    showLoading();
    
    const response = await fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error codes
      if (data.error.code === 'DUPLICATE_ERROR') {
        showAlert(data.error.message, 'warning');
      } else if (data.error.code === 'VALIDATION_ERROR') {
        displayValidationErrors(data.error.details);
      } else {
        showAlert('An error occurred. Please try again.', 'danger');
      }
      return;
    }
    
    showAlert('Registration successful!', 'success');
    redirectToLogin();
  } catch (error) {
    console.error('Network error:', error);
    showAlert('Network error. Please check your connection.', 'danger');
  } finally {
    hideLoading();
  }
}
```

### Logging Strategy

**Log Levels:**
- ERROR: System errors, exceptions
- WARN: Validation failures, rate limiting
- INFO: User actions (login, registration, downloads)
- DEBUG: Detailed debugging information

**Log Format:**
```javascript
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "service": "auth-service",
  "userId": "STU001",
  "action": "login",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "message": "Student login successful"
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Valid Student Registration Creates Database Record

For any valid student data (name, 10-digit phone, valid email, existing course, address), when submitted through the admission form, the system should create a corresponding Student_Record in the database with all provided fields stored correctly.

**Validates: Requirements 1.2**

### Property 2: Invalid Input Produces Validation Errors

For any admission form submission with invalid data (empty required fields, invalid email format, non-10-digit phone), the system should return field-specific validation error messages without creating a database record.

**Validates: Requirements 1.3, 1.6, 1.7**

### Property 3: Unique Student Credentials Generation

For any successfully created Student_Record, the system should generate a unique studentId and temporary password, with the password hashed using bcrypt before storage.

**Validates: Requirements 1.4, 2.7**

### Property 4: Duplicate Email/Phone Rejection

For any admission attempt using an email or phone number that already exists in the database, the system should reject the submission and return an appropriate error message without creating a duplicate record.

**Validates: Requirements 1.8, 1.9**

### Property 5: Valid Credentials Create Authenticated Session

For any valid student credentials (registered email/phone + correct password), the authentication service should create a session with a JWT token, store the session in the database, and return the token to the client.

**Validates: Requirements 2.2**

### Property 6: Invalid Credentials Rejected Without Information Leakage

For any invalid credential combination (unregistered identifier or incorrect password), the system should return a generic error message without revealing which credential was incorrect.

**Validates: Requirements 2.3**


### Property 7: Logout Terminates Session

For any authenticated user session, when the logout action is triggered, the system should terminate the session in the database and invalidate the JWT token.

**Validates: Requirements 2.5**

### Property 8: Unauthenticated Access Redirects to Login

For any attempt to access protected student portal pages without a valid authentication token, the system should redirect to the student login page.

**Validates: Requirements 2.6**

### Property 9: Password Reset Sends Email

For any valid password reset request with a registered email, the system should generate a secure reset token and send a password reset email to the registered address.

**Validates: Requirements 2.8**

### Property 10: Profile Updates Preserve Restricted Fields

For any student profile update request, the system should allow modification of phone, email, and address fields while preventing changes to name, enrolled course, and enrollment date.

**Validates: Requirements 3.4, 3.5**

### Property 11: Failed Profile Update Preserves Data

For any profile update that fails validation or encounters an error, the system should retain the previous valid data without corruption.

**Validates: Requirements 3.9**

### Property 12: Course-Specific Notes Access Control

For any student accessing the notes section, the system should display only Note_Documents that match their enrolled course, filtering out notes from other courses.

**Validates: Requirements 4.1, 4.8**

### Property 13: Note Download Logging

For any successful Note_Document download by a student, the system should record a download event in the downloads collection with studentId, noteId, and timestamp.

**Validates: Requirements 4.4**

### Property 14: Note Metadata Display Completeness

For any Note_Document displayed to a student, the system should include all metadata fields: title, upload date, and file size.

**Validates: Requirements 4.6**


### Property 15: Certificate Access Control

For any student accessing the certificates section, the system should display only certificates generated for that specific student, not certificates belonging to other students.

**Validates: Requirements 5.1**

### Property 16: Certificate Download Functionality

For any existing certificate, when a student clicks download, the system should retrieve the certificate PDF from Firebase Storage and initiate the download.

**Validates: Requirements 5.4**

### Property 17: Certificate Metadata Display

For any certificate displayed to a student, the system should include all metadata: course name, issue date, and certificate number.

**Validates: Requirements 5.5**

### Property 18: Payment Screenshot File Type Validation

For any file uploaded as a payment screenshot, the system should accept only JPG, PNG, or PDF formats and reject all other file types with an appropriate error message.

**Validates: Requirements 6.4**

### Property 19: Payment Screenshot Size Limit

For any file uploaded as a payment screenshot, the system should reject files larger than 5MB and accept files within the size limit.

**Validates: Requirements 6.7**

### Property 20: Payment Submission Creates Record

For any valid payment screenshot upload, the system should store the file in Firebase Storage and create a corresponding Payment_Record in the database with status "pending verification".

**Validates: Requirements 6.5, 6.6**

### Property 21: Payment History Completeness

For any student viewing their payment history, the system should display all Payment_Records associated with that student, including timestamps and verification status.

**Validates: Requirements 6.8**

### Property 22: Payment Verification Status Update

For any payment verified by an admin, the system should update the payment status to "verified" and the student portal should display this status with the verification date.

**Validates: Requirements 6.9**


### Property 23: Excel Import Parsing

For any valid Excel file containing student data with required fields (name, phone, email, course), the parser should convert each row into a Student_Record object with all fields correctly mapped.

**Validates: Requirements 26.1, 26.5**

### Property 24: Excel Import Error Reporting

For any Excel file containing invalid data (missing required fields, invalid formats), the parser should return descriptive error messages indicating which specific rows contain errors.

**Validates: Requirements 26.2**

### Property 25: Excel Import Duplicate Detection

For any Excel file containing duplicate phone numbers or emails (either within the file or matching existing database records), the parser should report the conflicts and skip those rows without creating duplicate records.

**Validates: Requirements 26.7**

### Property 26: Excel Import Empty Row Handling

For any Excel file containing empty rows, the parser should skip those rows and continue processing valid rows without errors.

**Validates: Requirements 26.6**

### Property 27: Student Data Round-Trip Property

For any collection of valid Student_Record objects, exporting to Excel then parsing the Excel file then exporting again should produce equivalent Student_Record objects with all fields preserved.

**Validates: Requirements 26.4**

### Property 28: Payment Export Completeness

For any collection of Payment_Records exported to Excel, the resulting file should include all payment fields: student name, course, amount, date, and verification status with proper column headers.

**Validates: Requirements 27.1, 27.2**

### Property 29: Payment Export Currency Formatting

For any payment amount in an exported Excel file, the system should format the value with the rupee symbol (₹) and exactly two decimal places.

**Validates: Requirements 27.3**

### Property 30: Payment Export Date Formatting

For any date in an exported payment Excel file, the system should format it in DD-MM-YYYY format following Indian locale conventions.

**Validates: Requirements 27.4**


### Property 31: Payment Data Round-Trip Property

For any collection of Payment_Record objects, exporting to Excel then importing the Excel file then exporting again should produce equivalent data with all fields and formatting preserved.

**Validates: Requirements 27.5**

### Property 32: Payment Export Summary Calculations

For any collection of Payment_Records exported to Excel, the system should include summary rows with total amounts calculated separately for each verification status (verified, pending, rejected).

**Validates: Requirements 27.6**

## Testing Strategy

### Dual Testing Approach

The platform will employ both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples and edge cases
- Integration points between components
- Error conditions and boundary cases
- UI component behavior

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Round-trip properties for serialization
- Invariants that must be maintained

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property-based tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection:**
- JavaScript/Node.js: fast-check
- Minimum 100 iterations per property test
- Each test tagged with reference to design property

**Test Tag Format:**
```javascript
// Feature: compunet-institute-management-platform, Property 1: Valid Student Registration Creates Database Record
test('valid student registration creates database record', () => {
  fc.assert(
    fc.property(
      fc.record({
        name: fc.string({ minLength: 2, maxLength: 100 }),
        phone: fc.stringOf(fc.integer({ min: 0, max: 9 }), { minLength: 10, maxLength: 10 }),
        email: fc.emailAddress(),
        course: fc.constantFrom('RS-CIT', 'Tally', 'Excel', 'Typing', 'Basic Computer'),
        address: fc.string({ minLength: 5, maxLength: 500 })
      }),
      async (studentData) => {
        const result = await registerStudent(studentData);
        const dbRecord = await Student.findOne({ email: studentData.email });
        
        expect(dbRecord).toBeDefined();
        expect(dbRecord.name).toBe(studentData.name);
        expect(dbRecord.phone).toBe(studentData.phone);
        expect(dbRecord.email).toBe(studentData.email);
        expect(dbRecord.course).toBe(studentData.course);
        expect(dbRecord.address).toBe(studentData.address);
      }
    ),
    { numRuns: 100 }
  );
});
```


### Unit Testing Strategy

**Backend Unit Tests (Jest):**
- API endpoint tests with supertest
- Database model validation tests
- Authentication middleware tests
- File upload/download tests
- Email/SMS service mocks
- Error handling tests

**Frontend Unit Tests (Jest + Testing Library):**
- Form validation tests
- Component rendering tests
- API integration tests with mocked responses
- State management tests
- Error display tests

**Test Coverage Goals:**
- Minimum 80% code coverage
- 100% coverage for critical paths (authentication, payment, data export)
- All error conditions tested

### Integration Testing

**API Integration Tests:**
- End-to-end user flows (registration → login → profile update)
- File upload and download flows
- Payment submission and verification flows
- Certificate generation and download flows
- Excel import/export flows

**Database Integration Tests:**
- CRUD operations for all collections
- Index performance tests
- Transaction rollback tests
- Concurrent access tests

### Test Environment Setup

**Test Database:**
- Separate MongoDB instance for testing
- Database reset before each test suite
- Seed data for consistent test scenarios

**Test File Storage:**
- Firebase Storage emulator for local testing
- Separate bucket for test files
- Automatic cleanup after tests

**Mock Services:**
- Email service mocked with nodemailer-mock
- SMS service mocked with test doubles
- JWT tokens with test secret key

### Performance Testing

**Load Testing:**
- Simulate 100 concurrent users
- Test API response times under load
- Database query performance monitoring
- File upload/download performance

**Stress Testing:**
- Test with 1000+ student records
- Large file uploads (50MB PDFs)
- Bulk Excel imports (1000 records)
- Concurrent payment verifications


### Security Testing

**Authentication Tests:**
- Brute force protection (rate limiting)
- Session hijacking prevention
- Token expiration enforcement
- Password reset token security

**Authorization Tests:**
- Role-based access control enforcement
- Resource-level permission checks
- Cross-user data access prevention
- Admin privilege escalation prevention

**Input Validation Tests:**
- SQL/NoSQL injection attempts
- XSS attack prevention
- File upload malicious content
- CSRF token validation

**Security Scanning:**
- npm audit for dependency vulnerabilities
- OWASP ZAP for web application scanning
- Snyk for continuous security monitoring

### Accessibility Testing

**WCAG 2.1 Level AA Compliance:**
- Keyboard navigation testing
- Screen reader compatibility
- Color contrast validation
- Form label associations
- ARIA attribute correctness

**Testing Tools:**
- axe DevTools for automated accessibility scanning
- Manual testing with NVDA/JAWS screen readers
- Keyboard-only navigation testing

### Browser Compatibility Testing

**Supported Browsers:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile Browsers:**
- Chrome Mobile (Android)
- Safari Mobile (iOS)

### Continuous Integration

**CI/CD Pipeline:**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm test
      
      - name: Run property-based tests
        run: npm run test:property
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Check code coverage
        run: npm run coverage
      
      - name: Security audit
        run: npm audit
```


## Deployment Architecture

### Production Environment

**Hosting Options:**

**Option 1: Traditional VPS (Recommended for Cost)**
- DigitalOcean/Linode VPS ($10-20/month)
- Node.js application with PM2 process manager
- Nginx reverse proxy
- MongoDB Atlas (free tier or $9/month)
- Firebase Storage (pay-as-you-go)
- SSL certificate via Let's Encrypt (free)

**Option 2: Platform as a Service**
- Heroku/Railway for Node.js backend
- MongoDB Atlas for database
- Firebase Storage for files
- Higher cost but easier management

### Deployment Configuration

**Environment Variables:**
```bash
# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://compunet.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/compunet

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY_STUDENT=24h
JWT_EXPIRY_ADMIN=8h

# Firebase
FIREBASE_PROJECT_ID=compunet-platform
FIREBASE_STORAGE_BUCKET=compunet-platform.appspot.com
FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@compunet.com
EMAIL_PASSWORD=app-specific-password

# SMS
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

**PM2 Configuration:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'compunet-platform',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```


**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name compunet.com www.compunet.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name compunet.com www.compunet.com;

    ssl_certificate /etc/letsencrypt/live/compunet.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/compunet.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Static files
    location / {
        root /var/www/compunet/public;
        try_files $uri $uri/ =404;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Student portal
    location /student {
        root /var/www/compunet/public;
        try_files $uri $uri/ /student/index.html;
    }

    # Admin panel
    location /admin {
        root /var/www/compunet/public;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

### Monitoring and Logging

**Application Monitoring:**
- PM2 monitoring dashboard
- Error tracking with Sentry
- Performance monitoring with New Relic (optional)
- Uptime monitoring with UptimeRobot

**Log Management:**
```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

**Database Monitoring:**
- MongoDB Atlas monitoring dashboard
- Query performance tracking
- Index usage analysis
- Storage usage alerts

**Backup Strategy:**
- Automated daily MongoDB backups via Atlas
- Firebase Storage weekly backups
- Backup retention: 30 days (daily), 90 days (weekly)
- Backup verification monthly


### Disaster Recovery

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 24 hours

**Recovery Procedures:**
1. Restore MongoDB from latest backup
2. Restore Firebase Storage from latest backup
3. Deploy application from Git repository
4. Verify data integrity
5. Update DNS if necessary
6. Notify users of service restoration

### Maintenance Windows

**Scheduled Maintenance:**
- Weekly: Sunday 2:00 AM - 4:00 AM IST
- Database optimization and index maintenance
- Security updates and patches
- Backup verification

**Zero-Downtime Deployment:**
- Blue-green deployment strategy
- PM2 cluster mode for rolling restarts
- Database migrations run before deployment
- Rollback plan for failed deployments

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up development environment
- Initialize Node.js + Express backend
- Configure MongoDB connection
- Set up Firebase Storage
- Implement basic authentication (student + admin)
- Create database models and schemas

### Phase 2: Student Features (Weeks 3-4)
- Student registration and admission form
- Student login and dashboard
- Profile management
- Password reset functionality
- Email/SMS notification integration

### Phase 3: Content Management (Weeks 5-6)
- Notes upload and management (admin)
- Notes download (student)
- File storage integration
- Download tracking and analytics
- Course management

### Phase 4: Payment System (Week 7)
- Payment screenshot upload (student)
- Payment verification (admin)
- Payment history and tracking
- Payment status notifications

### Phase 5: Certificate System (Week 8)
- Certificate generation (admin)
- Certificate download (student)
- PDF generation with PDFKit
- Certificate template design

### Phase 6: Admin Panel (Weeks 9-10)
- Student management (CRUD)
- Dashboard statistics
- Excel import/export
- Audit logs
- Analytics and reporting

### Phase 7: Testing and Refinement (Weeks 11-12)
- Unit test implementation
- Property-based test implementation
- Integration testing
- Security testing
- Performance optimization
- Bug fixes

### Phase 8: Deployment (Week 13)
- Production environment setup
- Database migration
- SSL certificate configuration
- Monitoring setup
- User acceptance testing
- Go-live

