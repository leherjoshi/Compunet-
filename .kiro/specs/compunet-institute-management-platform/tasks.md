# Implementation Plan: CompuNet Institute Management Platform

## Overview

This implementation plan transforms the existing static CompuNet Computer Center website into a comprehensive institute management platform. The platform will be built using Node.js + Express backend with MongoDB database, Firebase Storage for file management, and vanilla JavaScript frontend with Bootstrap 5. The implementation follows a 13-week roadmap with incremental feature delivery, property-based testing with fast-check, and comprehensive security measures.

## Technology Stack

- Backend: Node.js + Express.js
- Database: MongoDB with Mongoose ODM
- File Storage: Firebase Storage
- Authentication: JWT with bcrypt password hashing
- Frontend: Vanilla JavaScript + Bootstrap 5
- Testing: Jest + fast-check for property-based testing
- Email: Nodemailer
- PDF Generation: PDFKit
- Excel: ExcelJS

## Tasks

### Phase 1: Foundation and Project Setup (Weeks 1-2)

- [ ] 1. Initialize project structure and dependencies
  - Create project directory structure (server, public, config, models, routes, middleware, services, tests)
  - Initialize Node.js project with package.json
  - Install core dependencies: express, mongoose, jsonwebtoken, bcrypt, dotenv, cors, helmet
  - Install dev dependencies: jest, fast-check, nodemon, eslint
  - Create .env.example file with required environment variables
  - Set up .gitignore for node_modules, .env, logs
  - _Requirements: Foundation for all features_

- [ ] 2. Configure MongoDB connection and database models
  - [ ] 2.1 Set up MongoDB connection with Mongoose
    - Create database configuration file with connection string
    - Implement connection error handling and retry logic
    - Set up connection pooling and timeout settings
    - _Requirements: 1.2, 2.2, 3.4_

  - [ ] 2.2 Create Student model with schema validation
    - Define Student schema with fields: studentId, name, phone, email, password, course, address, enrollmentDate, paymentStatus, isActive
    - Add unique indexes on studentId, email, phone
    - Add compound indexes for common queries (course, enrollmentDate)
    - Implement pre-save hook for studentId auto-generation (STU001, STU002, etc.)
    - _Requirements: 1.2, 1.6, 1.7, 1.8, 1.9_


  - [ ]* 2.3 Write property test for Student model validation
    - **Property 1: Valid Student Registration Creates Database Record**
    - **Validates: Requirements 1.2**
    - Test that valid student data creates correct database record with all fields preserved

  - [ ] 2.4 Create Course model with schema validation
    - Define Course schema with fields: courseId, name, duration, fee, description, isActive, enrollmentCount
    - Add unique indexes on courseId and name
    - Implement pre-save hook for courseId auto-generation (CRS001, CRS002, etc.)
    - _Requirements: 1.1, 10.5_

  - [ ] 2.5 Create Payment model with schema validation
    - Define Payment schema with fields: paymentId, studentId, studentName, course, amount, screenshotUrl, screenshotPath, status, submittedAt, verifiedAt, verifiedBy, rejectionReason
    - Add indexes on paymentId, studentId, status, submittedAt
    - Implement pre-save hook for paymentId auto-generation (PAY001, PAY002, etc.)
    - _Requirements: 6.5, 6.6, 6.8_

  - [ ] 2.6 Create Notes model with schema validation
    - Define Notes schema with fields: noteId, title, course, fileUrl, filePath, fileSize, uploadedBy, uploadedAt, downloadCount
    - Add indexes on noteId, course, uploadedAt
    - Implement pre-save hook for noteId auto-generation (NOTE001, NOTE002, etc.)
    - _Requirements: 4.1, 4.6, 11.4_

  - [ ] 2.7 Create Certificate model with schema validation
    - Define Certificate schema with fields: certificateId, certificateNumber, studentId, studentName, course, issueDate, completionDate, fileUrl, filePath, generatedBy, version, isActive
    - Add indexes on certificateId, certificateNumber, studentId, isActive
    - Implement pre-save hook for certificateId and certificateNumber auto-generation
    - _Requirements: 5.1, 5.5, 12.1_

  - [ ] 2.8 Create Admin model with schema validation
    - Define Admin schema with fields: adminId, name, email, password, role, isActive, lastLoginAt
    - Add unique indexes on adminId and email
    - Implement pre-save hook for adminId auto-generation (ADM001, ADM002, etc.)
    - _Requirements: 7.1, 7.2_

  - [ ] 2.9 Create Sessions, Downloads, and AuditLogs models
    - Define Sessions schema with TTL index for automatic expiration
    - Define Downloads schema for tracking note and certificate downloads
    - Define AuditLogs schema for tracking all admin and student actions
    - Add appropriate indexes for query performance
    - _Requirements: 2.4, 4.4, 8.9_

- [ ] 3. Set up Firebase Storage integration
  - [ ] 3.1 Configure Firebase Admin SDK
    - Install firebase-admin package
    - Create Firebase project and download service account key
    - Initialize Firebase Admin SDK with credentials
    - Configure Firebase Storage bucket
    - _Requirements: 4.2, 5.4, 6.5, 11.4_

  - [ ] 3.2 Implement file upload service
    - Create uploadFile function with file type validation
    - Implement file size limit checks (5MB for payments, 50MB for notes)
    - Generate unique filenames with timestamp
    - Upload files to appropriate Firebase Storage paths
    - Return download URL and storage path
    - _Requirements: 6.4, 6.7, 11.3, 11.5_

  - [ ]* 3.3 Write property test for file validation
    - **Property 18: Payment Screenshot File Type Validation**
    - **Property 19: Payment Screenshot Size Limit**
    - **Validates: Requirements 6.4, 6.7**
    - Test file type and size validation logic

  - [ ] 3.4 Implement file download service
    - Create getSignedDownloadUrl function for secure file access
    - Implement 1-hour expiry for signed URLs
    - Add download event logging
    - _Requirements: 4.2, 4.4, 5.4_

  - [ ] 3.5 Implement file deletion service
    - Create deleteFile function to remove files from Firebase Storage
    - Implement soft delete with 30-day retention before hard delete
    - _Requirements: 11.6, 11.7_


- [ ] 4. Implement authentication system
  - [ ] 4.1 Create JWT token generation and verification utilities
    - Implement generateToken function with configurable expiry (24h for students, 8h for admins)
    - Implement verifyToken function with error handling
    - Create token payload structure with userId, email, role, course
    - _Requirements: 2.2, 2.4, 7.2, 7.4_

  - [ ] 4.2 Implement password hashing with bcrypt
    - Create hashPassword function with cost factor 12
    - Create comparePassword function for login verification
    - _Requirements: 2.7, 1.4_

  - [ ]* 4.3 Write property test for password hashing
    - **Property 3: Unique Student Credentials Generation**
    - **Validates: Requirements 1.4, 2.7**
    - Test that passwords are properly hashed and never stored in plain text

  - [ ] 4.4 Create authentication middleware
    - Implement requireAuth middleware to verify JWT tokens
    - Implement requireRole middleware for role-based access control
    - Extract token from Authorization header or cookies
    - Attach user data to request object
    - _Requirements: 2.6, 7.5, 7.8_

  - [ ] 4.5 Implement rate limiting middleware
    - Install express-rate-limit package
    - Configure rate limiter for login endpoints (5 attempts per 15 min for students, 3 per 10 min for admins)
    - Configure rate limiter for API endpoints (100 requests per minute per IP)
    - Configure rate limiter for file uploads (10 per hour per user)
    - _Requirements: 2.9, 7.6_

  - [ ] 4.6 Create session management service
    - Implement createSession function to store sessions in database
    - Implement validateSession function to check session validity
    - Implement terminateSession function for logout
    - Implement automatic cleanup of expired sessions via TTL index
    - _Requirements: 2.2, 2.4, 2.5, 7.2, 7.4, 7.7_

- [ ] 5. Checkpoint - Ensure foundation is solid
  - Verify MongoDB connection works correctly
  - Verify all models can create and query records
  - Verify Firebase Storage can upload and download files
  - Verify JWT token generation and verification works
  - Ensure all tests pass, ask the user if questions arise

### Phase 2: Student Registration and Authentication (Weeks 3-4)

- [ ] 6. Implement student registration API
  - [ ] 6.1 Create student registration endpoint
    - Implement POST /api/students/register route
    - Add input validation with express-validator (name, phone, email, course, address)
    - Check for duplicate email and phone numbers
    - Generate unique studentId and temporary password
    - Hash password before storing
    - Create Student record in database
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 1.8, 1.9_

  - [ ]* 6.2 Write property tests for registration validation
    - **Property 2: Invalid Input Produces Validation Errors**
    - **Property 4: Duplicate Email/Phone Rejection**
    - **Validates: Requirements 1.3, 1.6, 1.7, 1.8, 1.9**
    - Test validation logic and duplicate detection

  - [ ] 6.3 Integrate email notification service
    - Install nodemailer package
    - Configure email transporter with SMTP settings
    - Create sendAdmissionEmail function with HTML template
    - Send email with studentId and temporary password
    - _Requirements: 1.5_

  - [ ] 6.4 Integrate SMS notification service
    - Install Twilio SDK or similar SMS gateway
    - Configure SMS service with API credentials
    - Create sendAdmissionSMS function
    - Send SMS confirmation with studentId
    - _Requirements: 1.5_

  - [ ] 6.5 Update admission.html form to use API
    - Add JavaScript to handle form submission
    - Implement client-side validation
    - Make AJAX POST request to /api/students/register
    - Display success message or validation errors
    - Preserve existing HTML structure and styling
    - _Requirements: 1.1, 1.3_


- [ ] 7. Implement student authentication endpoints
  - [ ] 7.1 Create student login endpoint
    - Implement POST /api/auth/student/login route
    - Accept email or phone as identifier with password
    - Find user by email or phone
    - Verify password with bcrypt
    - Apply rate limiting
    - Generate JWT token with 24-hour expiry
    - Create session record in database
    - Log audit event
    - Return token and user data
    - _Requirements: 2.1, 2.2, 2.3, 2.7, 2.9_

  - [ ]* 7.2 Write property tests for authentication
    - **Property 5: Valid Credentials Create Authenticated Session**
    - **Property 6: Invalid Credentials Rejected Without Information Leakage**
    - **Validates: Requirements 2.2, 2.3**
    - Test authentication logic and security

  - [ ] 7.3 Create student logout endpoint
    - Implement POST /api/auth/student/logout route
    - Verify authentication token
    - Terminate session in database
    - Log audit event
    - Return success response
    - _Requirements: 2.5_

  - [ ]* 7.4 Write property test for logout
    - **Property 7: Logout Terminates Session**
    - **Validates: Requirements 2.5**
    - Test that logout properly invalidates sessions

  - [ ] 7.5 Create session verification endpoint
    - Implement GET /api/auth/verify-session route
    - Verify JWT token validity
    - Check session exists in database
    - Return user data if valid
    - _Requirements: 2.4, 2.6_

  - [ ] 7.6 Create password reset endpoints
    - Implement POST /api/auth/student/reset-password route to request reset
    - Generate secure reset token with 1-hour expiry
    - Send password reset email with link
    - Implement POST /api/auth/student/reset-password/confirm route to set new password
    - Verify reset token and update password
    - _Requirements: 2.8_

  - [ ]* 7.7 Write property test for password reset
    - **Property 9: Password Reset Sends Email**
    - **Validates: Requirements 2.8**
    - Test password reset flow

- [ ] 8. Create student login and dashboard pages
  - [ ] 8.1 Create student login page (public/student/login.html)
    - Design login form with email/phone and password fields
    - Add "Forgot Password" link
    - Implement form validation
    - Make AJAX POST request to /api/auth/student/login
    - Store JWT token in HTTP-only cookie
    - Redirect to dashboard on success
    - Display error messages on failure
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 8.2 Create student dashboard page (public/student/dashboard.html)
    - Create dashboard layout with navigation menu
    - Add authentication check on page load
    - Display profile summary card (name, studentId, course, enrollment date)
    - Display payment status card with visual indicator
    - Add quick access links to notes, certificates, payments, profile
    - Implement logout functionality
    - _Requirements: 3.1, 3.2, 3.6, 3.7_

  - [ ]* 8.3 Write property test for unauthenticated access
    - **Property 8: Unauthenticated Access Redirects to Login**
    - **Validates: Requirements 2.6**
    - Test that protected pages redirect properly

  - [ ] 8.4 Create reusable authentication utility (public/js/auth.js)
    - Implement checkAuth function to verify session
    - Implement logout function to terminate session
    - Implement redirectToLogin function
    - Implement getUser function to retrieve current user data
    - _Requirements: 2.4, 2.5, 2.6_

- [ ] 9. Checkpoint - Verify student authentication flow
  - Test student registration creates account and sends notifications
  - Test student login with valid credentials
  - Test login rejection with invalid credentials
  - Test rate limiting on failed login attempts
  - Test logout terminates session
  - Test password reset flow
  - Ensure all tests pass, ask the user if questions arise


### Phase 3: Student Profile and Dashboard Features (Week 4)

- [ ] 10. Implement student profile management API
  - [ ] 10.1 Create get student profile endpoint
    - Implement GET /api/students/me route
    - Verify authentication and extract studentId from token
    - Fetch student record from database
    - Return student data (exclude password)
    - _Requirements: 3.2_

  - [ ] 10.2 Create update student profile endpoint
    - Implement PUT /api/students/me route
    - Verify authentication
    - Validate input data (phone, email, address only)
    - Check for duplicate email/phone if changed
    - Prevent modification of name, course, enrollmentDate
    - Update student record in database
    - Log audit event
    - Return updated student data
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ]* 10.3 Write property tests for profile management
    - **Property 10: Profile Updates Preserve Restricted Fields**
    - **Property 11: Failed Profile Update Preserves Data**
    - **Validates: Requirements 3.4, 3.5, 3.9**
    - Test profile update restrictions and error handling

- [ ] 11. Create student profile page
  - [ ] 11.1 Create profile view/edit page (public/student/profile.html)
    - Display student information in read-only mode initially
    - Add "Edit Profile" button to enable editing
    - Allow editing of phone, email, and address fields only
    - Disable editing of name, course, and enrollment date
    - Implement form validation
    - Make AJAX PUT request to /api/students/me
    - Display success message or validation errors
    - Show loading indicator during save
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.8, 3.9_

### Phase 4: Notes Management System (Weeks 5-6)

- [ ] 12. Implement notes management API for students
  - [ ] 12.1 Create get student notes endpoint
    - Implement GET /api/students/me/notes route
    - Verify authentication and extract course from token
    - Fetch notes filtered by student's enrolled course
    - Return notes with metadata (title, uploadDate, fileSize)
    - _Requirements: 4.1, 4.6, 4.8_

  - [ ]* 12.2 Write property test for course-specific access
    - **Property 12: Course-Specific Notes Access Control**
    - **Validates: Requirements 4.1, 4.8**
    - Test that students only see notes for their course

  - [ ] 12.3 Create note download endpoint
    - Implement GET /api/files/notes/:id/download route
    - Verify authentication
    - Check authorization (student's course matches note's course)
    - Fetch note metadata from database
    - Generate signed download URL from Firebase Storage
    - Record download event in downloads collection
    - Increment download count in notes collection
    - Redirect to signed URL
    - _Requirements: 4.2, 4.4, 4.7_

  - [ ]* 12.4 Write property test for download logging
    - **Property 13: Note Download Logging**
    - **Validates: Requirements 4.4**
    - Test that downloads are properly logged

- [ ] 13. Create student notes page
  - [ ] 13.1 Create notes listing page (public/student/notes.html)
    - Fetch notes from /api/students/me/notes
    - Display notes in card layout with title, upload date, file size
    - Add download button for each note
    - Handle download click to call /api/files/notes/:id/download
    - Display "No notes available" message when empty
    - Show loading indicator while fetching
    - Display error message on download failure with retry option
    - _Requirements: 4.1, 4.2, 4.5, 4.6, 4.7_

  - [ ]* 13.2 Write property test for note metadata display
    - **Property 14: Note Metadata Display Completeness**
    - **Validates: Requirements 4.6**
    - Test that all metadata fields are displayed


- [ ] 14. Implement admin notes management API
  - [ ] 14.1 Create get all notes endpoint for admin
    - Implement GET /api/admin/notes route
    - Verify admin authentication
    - Fetch all notes from database
    - Group notes by course
    - Return notes with metadata and upload statistics
    - _Requirements: 11.1_

  - [ ] 14.2 Create note upload endpoint for admin
    - Implement POST /api/admin/notes route (multipart/form-data)
    - Verify admin authentication
    - Validate file is PDF format
    - Validate file size is under 50MB
    - Upload file to Firebase Storage in /notes/{course}/ path
    - Create note record in database with metadata
    - Log audit event
    - Return success response with note data
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

  - [ ]* 14.3 Write property test for note upload validation
    - Test PDF format validation
    - Test file size limit enforcement
    - **Validates: Requirements 11.3, 11.5**

  - [ ] 14.4 Create update note metadata endpoint
    - Implement PUT /api/admin/notes/:id route
    - Verify admin authentication
    - Allow updating title and course association
    - Update note record in database
    - Log audit event
    - _Requirements: 11.8_

  - [ ] 14.5 Create delete note endpoint
    - Implement DELETE /api/admin/notes/:id route
    - Verify admin authentication
    - Fetch note record from database
    - Delete file from Firebase Storage
    - Delete note record from database
    - Log audit event
    - _Requirements: 11.6, 11.7, 11.9_

  - [ ] 14.6 Create note analytics endpoint
    - Implement GET /api/admin/notes/:id/analytics route
    - Verify admin authentication
    - Fetch download statistics from downloads collection
    - Return download count, unique students, recent downloads
    - _Requirements: 4.4_

- [ ] 15. Create admin notes management page
  - [ ] 15.1 Create notes management interface (public/admin/notes.html)
    - Display notes grouped by course in table format
    - Show note title, upload date, file size, download count
    - Add "Upload Note" button with file upload modal
    - Implement file upload with progress indicator
    - Add edit button to modify note metadata
    - Add delete button with confirmation dialog
    - Display success/error messages
    - _Requirements: 11.1, 11.2, 11.6, 11.8, 11.9_

- [ ] 16. Checkpoint - Verify notes system
  - Test admin can upload PDF notes
  - Test students see only notes for their course
  - Test note downloads work and are logged
  - Test admin can edit and delete notes
  - Ensure all tests pass, ask the user if questions arise

### Phase 5: Certificate System (Week 6)

- [ ] 17. Implement certificate generation service
  - [ ] 17.1 Create PDF certificate generator
    - Install pdfkit package
    - Create generateCertificate function with template design
    - Add certificate header with institute name and logo
    - Add student name, course name, completion date
    - Add certificate number and issue date
    - Add director and principal signatures
    - Generate PDF and save to temporary file
    - Upload PDF to Firebase Storage in /certificates/{year}/ path
    - Return file URL and path
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 17.2 Create certificate generation endpoint
    - Implement POST /api/admin/certificates/generate route
    - Verify admin authentication
    - Accept studentId and completionDate in request body
    - Fetch student and course data from database
    - Generate unique certificate number (CC/2024/001 format)
    - Call generateCertificate function
    - Create certificate record in database
    - Send email notification to student with certificate link
    - Log audit event
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ] 17.3 Create certificate regeneration endpoint
    - Implement POST /api/admin/certificates/:id/regenerate route
    - Verify admin authentication
    - Fetch existing certificate record
    - Mark old certificate as inactive (isActive = false)
    - Generate new certificate with incremented version
    - Update certificate record
    - Log audit event
    - _Requirements: 12.5_


- [ ] 18. Implement certificate access API for students
  - [ ] 18.1 Create get student certificates endpoint
    - Implement GET /api/students/me/certificates route
    - Verify authentication and extract studentId from token
    - Fetch certificates for student where isActive = true
    - Return certificates with metadata (course, issueDate, certificateNumber)
    - _Requirements: 5.1, 5.5_

  - [ ]* 18.2 Write property test for certificate access control
    - **Property 15: Certificate Access Control**
    - **Validates: Requirements 5.1**
    - Test that students only see their own certificates

  - [ ] 18.3 Create certificate download endpoint
    - Implement GET /api/files/certificates/:id/download route
    - Verify authentication
    - Check authorization (certificate belongs to authenticated student)
    - Fetch certificate metadata from database
    - Generate signed download URL from Firebase Storage
    - Record download event in downloads collection
    - Redirect to signed URL
    - _Requirements: 5.2, 5.4, 5.6_

  - [ ]* 18.4 Write property tests for certificate functionality
    - **Property 16: Certificate Download Functionality**
    - **Property 17: Certificate Metadata Display**
    - **Validates: Requirements 5.4, 5.5**
    - Test download and metadata display

- [ ] 19. Create student certificates page
  - [ ] 19.1 Create certificates page (public/student/certificates.html)
    - Fetch certificates from /api/students/me/certificates
    - Display certificates in card layout with course, issue date, certificate number
    - Add download button for each certificate
    - Handle download click to call /api/files/certificates/:id/download
    - Display "No certificates available" message when empty
    - Show loading indicator while fetching
    - Display error message on download failure with retry option
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 20. Create admin certificate management page
  - [ ] 20.1 Create certificate management interface (public/admin/certificates.html)
    - Display list of all certificates with student name, course, issue date, certificate number
    - Add "Generate Certificate" button with modal form
    - Implement certificate generation form (select student, enter completion date)
    - Add regenerate button for existing certificates
    - Display success/error messages
    - Show loading indicator during generation
    - _Requirements: 12.1, 12.2, 12.5_

### Phase 6: Payment System (Week 7)

- [ ] 21. Implement payment submission API for students
  - [ ] 21.1 Create get student payments endpoint
    - Implement GET /api/students/me/payments route
    - Verify authentication and extract studentId from token
    - Fetch all payment records for student
    - Return payments with timestamps and verification status
    - _Requirements: 6.8_

  - [ ] 21.2 Create payment submission endpoint
    - Implement POST /api/students/me/payments route (multipart/form-data)
    - Verify authentication
    - Validate file is image format (JPG, PNG) or PDF
    - Validate file size is under 5MB
    - Upload screenshot to Firebase Storage in /payment-screenshots/{studentId}/ path
    - Create payment record in database with status "pending"
    - Update student's paymentStatus to "pending"
    - Log audit event
    - Return success response
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 21.3 Write property tests for payment submission
    - **Property 18: Payment Screenshot File Type Validation**
    - **Property 19: Payment Screenshot Size Limit**
    - **Property 20: Payment Submission Creates Record**
    - **Validates: Requirements 6.4, 6.5, 6.6, 6.7**
    - Test file validation and record creation

  - [ ]* 21.4 Write property test for payment history
    - **Property 21: Payment History Completeness**
    - **Validates: Requirements 6.8**
    - Test that all payments are displayed


- [ ] 22. Create student payment page
  - [ ] 22.1 Create payment submission page (public/student/payments.html)
    - Display UPI ID (compunetcenter@okaxis) prominently
    - Display QR code image for payment scanning
    - Display course fee amount for student's enrolled course
    - Add file upload interface for payment screenshot
    - Implement client-side file validation (type and size)
    - Make AJAX POST request to /api/students/me/payments
    - Display payment history table with timestamps and status
    - Show payment status with visual indicators (pending, verified, rejected)
    - Display verification date when payment is verified
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7, 6.8, 6.9_

- [ ] 23. Implement payment verification API for admin
  - [ ] 23.1 Create get all payments endpoint
    - Implement GET /api/admin/payments route
    - Verify admin authentication
    - Support filtering by status (pending, verified, rejected)
    - Fetch payments with student details
    - Return paginated results
    - _Requirements: 13.1, 13.2_

  - [ ] 23.2 Create payment verification endpoint
    - Implement PUT /api/admin/payments/:id/verify route
    - Verify admin authentication
    - Update payment status to "verified"
    - Set verifiedAt timestamp and verifiedBy admin ID
    - Update student's paymentStatus to "verified"
    - Send email notification to student
    - Log audit event
    - _Requirements: 13.3, 13.4, 13.5_

  - [ ]* 23.3 Write property test for payment verification
    - **Property 22: Payment Verification Status Update**
    - **Validates: Requirements 6.9**
    - Test that verification updates status correctly

  - [ ] 23.4 Create payment rejection endpoint
    - Implement PUT /api/admin/payments/:id/reject route
    - Verify admin authentication
    - Accept rejection reason in request body
    - Update payment status to "rejected"
    - Store rejection reason
    - Send email notification to student with reason
    - Log audit event
    - _Requirements: 13.6_

  - [ ] 23.5 Create payment export endpoint
    - Implement GET /api/admin/payments/export route
    - Verify admin authentication
    - Fetch all payments with student details
    - Generate Excel file with ExcelJS
    - Include columns: student name, course, amount, date, status
    - Format currency with rupee symbol and 2 decimal places
    - Format dates in DD-MM-YYYY format
    - Add summary rows with totals by status
    - Return Excel file as download
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.6_

  - [ ]* 23.6 Write property tests for payment export
    - **Property 28: Payment Export Completeness**
    - **Property 29: Payment Export Currency Formatting**
    - **Property 30: Payment Export Date Formatting**
    - **Property 31: Payment Data Round-Trip Property**
    - **Property 32: Payment Export Summary Calculations**
    - **Validates: Requirements 27.1, 27.2, 27.3, 27.4, 27.5, 27.6**
    - Test export functionality and formatting

- [ ] 24. Create admin payment verification page
  - [ ] 24.1 Create payment verification interface (public/admin/payments.html)
    - Display payments in table with filters (all, pending, verified, rejected)
    - Show student name, course, amount, screenshot thumbnail, submission date, status
    - Add "View Screenshot" button to open full-size image in modal
    - Add "Verify" button for pending payments
    - Add "Reject" button with reason input modal
    - Add "Export to Excel" button
    - Display success/error messages
    - Update table dynamically after verification/rejection
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.6, 27.1_

- [ ] 25. Checkpoint - Verify payment system
  - Test students can submit payment screenshots
  - Test file validation works correctly
  - Test admin can view pending payments
  - Test admin can verify and reject payments
  - Test payment status updates reflect in student portal
  - Test payment export generates correct Excel file
  - Ensure all tests pass, ask the user if questions arise


### Phase 7: Admin Panel Core Features (Weeks 8-9)

- [ ] 26. Implement admin authentication
  - [ ] 26.1 Create admin login endpoint
    - Implement POST /api/auth/admin/login route
    - Accept email and password
    - Find admin by email
    - Verify password with bcrypt
    - Apply rate limiting (3 attempts per 10 min per IP)
    - Generate JWT token with 8-hour expiry
    - Create session record in database
    - Update lastLoginAt timestamp
    - Log audit event
    - Return token and admin data
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

  - [ ] 26.2 Create admin logout endpoint
    - Implement POST /api/auth/admin/logout route
    - Verify admin authentication
    - Terminate session in database
    - Log audit event
    - _Requirements: 7.7_

  - [ ] 26.3 Create admin login page (public/admin/login.html)
    - Design admin login form with email and password
    - Implement form validation
    - Make AJAX POST request to /api/auth/admin/login
    - Store JWT token in HTTP-only cookie
    - Redirect to admin dashboard on success
    - Display error messages on failure
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ] 26.4 Implement admin authorization middleware
    - Enhance requireRole middleware to prevent students from accessing admin routes
    - Enhance requireRole middleware to prevent admins from accessing student routes
    - _Requirements: 7.5, 7.8, 7.9_

- [ ] 27. Implement admin dashboard API
  - [ ] 27.1 Create dashboard statistics endpoint
    - Implement GET /api/admin/dashboard/stats route
    - Verify admin authentication
    - Calculate total enrolled students count
    - Calculate active courses count
    - Calculate total verified payments amount
    - Fetch 10 most recent student enrollments
    - Calculate pending payment verifications count
    - Calculate certificates generated this month count
    - Return all statistics
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ] 27.2 Create admin dashboard page (public/admin/dashboard.html)
    - Create dashboard layout with navigation menu
    - Display statistics in card layout
    - Show total students, active courses, verified payments amount
    - Display recent enrollments table
    - Show pending payments count with link to verification page
    - Show certificates generated this month
    - Add loading indicators while fetching statistics
    - Implement auto-refresh on page load
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

- [ ] 28. Implement student management API for admin
  - [ ] 28.1 Create get all students endpoint
    - Implement GET /api/admin/students route
    - Verify admin authentication
    - Support pagination (20 students per page)
    - Support search by name, phone, email, or course
    - Fetch students with all fields except password
    - Return paginated results with total count
    - _Requirements: 9.1, 9.2, 9.9, 9.11_

  - [ ] 28.2 Create get single student endpoint
    - Implement GET /api/admin/students/:id route
    - Verify admin authentication
    - Fetch student by ID
    - Return student data with enrollment details
    - _Requirements: 9.5_

  - [ ] 28.3 Create add student endpoint
    - Implement POST /api/admin/students route
    - Verify admin authentication
    - Validate input data (same as registration)
    - Check for duplicate email/phone
    - Generate studentId and temporary password
    - Hash password
    - Create student record with createdBy = adminId
    - Send email and SMS notifications
    - Log audit event
    - _Requirements: 9.3, 9.4_

  - [ ] 28.4 Create update student endpoint
    - Implement PUT /api/admin/students/:id route
    - Verify admin authentication
    - Validate input data
    - Check for duplicate email/phone if changed
    - Update student record
    - Log audit event with before/after values
    - _Requirements: 9.5, 9.6_

  - [ ] 28.5 Create delete student endpoint
    - Implement DELETE /api/admin/students/:id route
    - Verify admin authentication
    - Fetch student record
    - Delete associated payments, downloads, sessions
    - Mark associated notes and certificates as inactive
    - Delete student record
    - Log audit event
    - _Requirements: 9.7, 9.8_


  - [ ] 28.6 Create student export endpoint
    - Implement GET /api/admin/students/export route
    - Verify admin authentication
    - Fetch all students with relevant fields
    - Generate Excel file with ExcelJS
    - Include columns: studentId, name, phone, email, course, enrollmentDate, paymentStatus
    - Format dates in DD-MM-YYYY format
    - Style header row with bold text and background color
    - Return Excel file as download
    - _Requirements: 9.10_

  - [ ] 28.7 Create student import endpoint
    - Implement POST /api/admin/students/import route (multipart/form-data)
    - Verify admin authentication
    - Parse Excel file with ExcelJS
    - Validate each row for required fields (name, phone, email, course)
    - Check for duplicate phone/email within file and database
    - Skip empty rows
    - Collect validation errors with row numbers
    - Create student records for valid rows
    - Generate credentials and send notifications
    - Return success count and error details
    - Log audit event
    - _Requirements: 26.1, 26.2, 26.5, 26.6, 26.7_

  - [ ]* 28.8 Write property tests for Excel import/export
    - **Property 23: Excel Import Parsing**
    - **Property 24: Excel Import Error Reporting**
    - **Property 25: Excel Import Duplicate Detection**
    - **Property 26: Excel Import Empty Row Handling**
    - **Property 27: Student Data Round-Trip Property**
    - **Validates: Requirements 26.1, 26.2, 26.4, 26.5, 26.6, 26.7**
    - Test Excel parsing, validation, and round-trip consistency

- [ ] 29. Create admin student management page
  - [ ] 29.1 Create student management interface (public/admin/students.html)
    - Display students in paginated table (20 per page)
    - Show columns: studentId, name, phone, email, course, enrollmentDate, paymentStatus
    - Add search bar with real-time filtering
    - Add "Add Student" button with modal form
    - Add edit button for each student row
    - Add delete button with confirmation dialog
    - Add "Import Excel" button with file upload
    - Add "Export to Excel" button
    - Implement pagination controls
    - Display success/error messages
    - Update table dynamically after CRUD operations
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11, 9.12, 26.1_

- [ ] 30. Implement course management API for admin
  - [ ] 30.1 Create get all courses endpoint
    - Implement GET /api/admin/courses route
    - Verify admin authentication
    - Fetch all courses with enrollment counts
    - Return courses with details
    - _Requirements: 10.1_

  - [ ] 30.2 Create get course students endpoint
    - Implement GET /api/admin/courses/:id/students route
    - Verify admin authentication
    - Fetch all students enrolled in specified course
    - Return students with enrollment dates and payment status
    - _Requirements: 10.2, 10.7_

  - [ ] 30.3 Create update student course endpoint
    - Implement PUT /api/admin/students/:id/course route
    - Verify admin authentication
    - Accept new courseId in request body
    - Update student's course field
    - Decrement old course enrollment count
    - Increment new course enrollment count
    - Log audit event
    - _Requirements: 10.3, 10.4_

  - [ ] 30.4 Create course management endpoints (optional)
    - Implement POST /api/admin/courses to create new courses
    - Implement PUT /api/admin/courses/:id to update course details
    - Implement DELETE /api/admin/courses/:id with enrollment check
    - _Requirements: 10.5, 10.6_

- [ ] 31. Create admin course management page
  - [ ] 31.1 Create course management interface (public/admin/courses.html)
    - Display courses in card layout with name, duration, fee, enrollment count
    - Add "View Students" button for each course
    - Display enrolled students in modal or separate section
    - Show student names, enrollment dates, payment status
    - Add option to change student's course from student list
    - Display success/error messages
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7_

- [ ] 32. Checkpoint - Verify admin panel core features
  - Test admin login and authentication
  - Test admin dashboard displays correct statistics
  - Test admin can view, add, edit, delete students
  - Test student search and pagination
  - Test Excel import with valid and invalid data
  - Test Excel export generates correct file
  - Test course management and student course changes
  - Ensure all tests pass, ask the user if questions arise


### Phase 8: Analytics and Audit System (Week 10)

- [ ] 33. Implement analytics API
  - [ ] 33.1 Create download analytics endpoint
    - Implement GET /api/admin/analytics/downloads route
    - Verify admin authentication
    - Support filtering by date range and resource type (notes/certificates)
    - Aggregate download statistics by course, student, and time period
    - Return download trends and top downloaded resources
    - _Requirements: 4.4, 14.1_

  - [ ] 33.2 Create enrollment analytics endpoint
    - Implement GET /api/admin/analytics/enrollments route
    - Verify admin authentication
    - Support filtering by date range and course
    - Aggregate enrollment statistics by course and time period
    - Return enrollment trends and course popularity
    - _Requirements: 8.5, 14.2_

  - [ ] 33.3 Create audit logs endpoint
    - Implement GET /api/admin/audit-logs route
    - Verify admin authentication
    - Support filtering by userId, action, resource, date range
    - Support pagination (50 logs per page)
    - Fetch audit logs with user details
    - Return paginated logs
    - _Requirements: 14.3_

- [ ] 34. Create admin analytics and audit pages
  - [ ] 34.1 Create analytics dashboard (public/admin/analytics.html)
    - Display download statistics with charts (Chart.js)
    - Show top downloaded notes and certificates
    - Display enrollment trends by course
    - Add date range filters
    - Show loading indicators while fetching data
    - _Requirements: 14.1, 14.2_

  - [ ] 34.2 Create audit logs viewer (public/admin/audit-logs.html)
    - Display audit logs in paginated table
    - Show columns: timestamp, user, action, resource, details
    - Add filters for user type, action, resource, date range
    - Implement search functionality
    - Display changes (before/after) for update actions
    - _Requirements: 14.3_

### Phase 9: Security Hardening and Error Handling (Week 11)

- [ ] 35. Implement comprehensive security measures
  - [ ] 35.1 Add security headers with Helmet.js
    - Install helmet package
    - Configure Content Security Policy
    - Enable HSTS with 1-year max age
    - Set X-Frame-Options to SAMEORIGIN
    - Set X-Content-Type-Options to nosniff
    - Set X-XSS-Protection
    - _Requirements: Security best practices_

  - [ ] 35.2 Implement input sanitization
    - Install express-validator and sanitize-html packages
    - Add sanitization middleware for all user inputs
    - Escape HTML in text fields
    - Normalize email addresses
    - Trim whitespace from strings
    - _Requirements: Security best practices_

  - [ ] 35.3 Implement CSRF protection
    - Install csurf package
    - Add CSRF token generation for forms
    - Validate CSRF tokens on state-changing operations
    - Set SameSite cookie attribute to Strict
    - _Requirements: Security best practices_

  - [ ] 35.4 Configure CORS properly
    - Install cors package
    - Configure allowed origins (production domain only)
    - Set credentials: true for cookie support
    - Restrict allowed methods and headers
    - _Requirements: Security best practices_

  - [ ] 35.5 Implement file upload security
    - Add file type validation using magic numbers (not just extensions)
    - Implement virus scanning (optional with ClamAV)
    - Generate random filenames to prevent path traversal
    - Set strict Firebase Storage security rules
    - _Requirements: 6.4, 11.3_

- [ ] 36. Implement comprehensive error handling
  - [ ] 36.1 Create centralized error handler middleware
    - Create error handler that catches all errors
    - Classify errors by type (validation, authentication, database, etc.)
    - Return appropriate HTTP status codes
    - Format error responses consistently
    - Log errors with Winston logger
    - Hide sensitive error details in production
    - _Requirements: Error handling for all features_

  - [ ] 36.2 Add error handling to all routes
    - Wrap async route handlers with try-catch
    - Handle database errors (duplicate keys, connection failures)
    - Handle file upload errors (size limits, invalid types)
    - Handle authentication errors (invalid tokens, expired sessions)
    - Handle authorization errors (insufficient permissions)
    - Return user-friendly error messages
    - _Requirements: 1.3, 3.9, 4.7, 5.6, 6.4, 11.9_

  - [ ] 36.3 Implement frontend error handling
    - Add global error handler for AJAX requests
    - Display user-friendly error messages
    - Implement retry logic for network errors
    - Show loading states during operations
    - Handle session expiration gracefully
    - _Requirements: 3.8, 4.7, 5.6_


- [ ] 37. Implement logging system
  - [ ] 37.1 Set up Winston logger
    - Install winston package
    - Configure log levels (error, warn, info, debug)
    - Set up file transports (error.log, combined.log)
    - Set up console transport for development
    - Format logs as JSON with timestamps
    - _Requirements: Monitoring and debugging_

  - [ ] 37.2 Add logging to critical operations
    - Log all authentication attempts (success and failure)
    - Log all CRUD operations with user and resource details
    - Log all file uploads and downloads
    - Log all payment verifications
    - Log all certificate generations
    - Log all errors with stack traces
    - _Requirements: 2.3, 7.3, 14.3_

- [ ] 38. Checkpoint - Verify security and error handling
  - Test security headers are set correctly
  - Test input sanitization prevents XSS
  - Test CSRF protection works
  - Test rate limiting prevents brute force
  - Test file upload security measures
  - Test error handling returns appropriate responses
  - Test logging captures all critical events
  - Ensure all tests pass, ask the user if questions arise

### Phase 10: Testing and Quality Assurance (Week 12)

- [ ] 39. Write comprehensive unit tests
  - [ ]* 39.1 Write unit tests for authentication service
    - Test password hashing and comparison
    - Test JWT token generation and verification
    - Test session creation and validation
    - Test rate limiting logic
    - _Requirements: 2.2, 2.7, 2.9_

  - [ ]* 39.2 Write unit tests for student service
    - Test student registration validation
    - Test duplicate detection
    - Test profile update restrictions
    - Test credential generation
    - _Requirements: 1.2, 1.8, 1.9, 3.4, 3.5_

  - [ ]* 39.3 Write unit tests for file service
    - Test file upload validation
    - Test file size limit enforcement
    - Test signed URL generation
    - Test file deletion
    - _Requirements: 6.4, 6.7, 11.3, 11.5_

  - [ ]* 39.4 Write unit tests for payment service
    - Test payment submission
    - Test payment verification
    - Test payment export formatting
    - _Requirements: 6.5, 13.4, 27.3, 27.4_

  - [ ]* 39.5 Write unit tests for certificate service
    - Test certificate generation
    - Test certificate number uniqueness
    - Test PDF creation
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ]* 39.6 Write unit tests for Excel service
    - Test Excel parsing
    - Test validation error reporting
    - Test duplicate detection
    - Test round-trip consistency
    - _Requirements: 26.1, 26.2, 26.7, 27.5_

- [ ] 40. Write integration tests
  - [ ]* 40.1 Write integration tests for student flow
    - Test complete registration → login → profile update flow
    - Test notes download flow
    - Test certificate download flow
    - Test payment submission flow
    - _Requirements: End-to-end student features_

  - [ ]* 40.2 Write integration tests for admin flow
    - Test admin login → student management flow
    - Test payment verification flow
    - Test certificate generation flow
    - Test Excel import/export flow
    - _Requirements: End-to-end admin features_

  - [ ]* 40.3 Write integration tests for authorization
    - Test students cannot access admin routes
    - Test admins cannot access student routes
    - Test students can only access their own data
    - Test unauthenticated users are redirected
    - _Requirements: 2.6, 7.5, 7.8, 7.9_

- [ ] 41. Perform security testing
  - [ ]* 41.1 Test authentication security
    - Test brute force protection with rate limiting
    - Test session hijacking prevention
    - Test token expiration enforcement
    - Test password reset token security
    - _Requirements: 2.9, 7.6_

  - [ ]* 41.2 Test authorization security
    - Test role-based access control enforcement
    - Test resource-level permission checks
    - Test cross-user data access prevention
    - _Requirements: 7.5, 7.8, 7.9_

  - [ ]* 41.3 Test input validation security
    - Test SQL/NoSQL injection prevention
    - Test XSS attack prevention
    - Test file upload malicious content handling
    - Test CSRF token validation
    - _Requirements: Security best practices_

  - [ ]* 41.4 Run security audit
    - Run npm audit to check for dependency vulnerabilities
    - Fix or mitigate all high and critical vulnerabilities
    - Document any remaining low/medium vulnerabilities
    - _Requirements: Security best practices_


- [ ] 42. Perform performance testing
  - [ ]* 42.1 Test API performance under load
    - Simulate 100 concurrent users with load testing tool (Artillery or k6)
    - Measure API response times for critical endpoints
    - Identify and optimize slow queries
    - Test database query performance with indexes
    - _Requirements: Performance optimization_

  - [ ]* 42.2 Test file upload/download performance
    - Test large file uploads (50MB PDFs)
    - Test concurrent file downloads
    - Measure Firebase Storage performance
    - _Requirements: 11.5_

  - [ ]* 42.3 Test bulk operations performance
    - Test Excel import with 1000 student records
    - Test Excel export with large datasets
    - Test concurrent payment verifications
    - _Requirements: 26.1, 27.1_

- [ ] 43. Perform accessibility testing
  - [ ]* 43.1 Run automated accessibility tests
    - Install axe-core or pa11y for automated testing
    - Test all pages for WCAG 2.1 Level AA compliance
    - Fix color contrast issues
    - Fix missing alt text on images
    - Fix form label associations
    - _Requirements: Accessibility compliance_

  - [ ]* 43.2 Test keyboard navigation
    - Test all forms can be completed with keyboard only
    - Test all buttons and links are keyboard accessible
    - Test focus indicators are visible
    - Test tab order is logical
    - _Requirements: Accessibility compliance_

  - [ ]* 43.3 Test screen reader compatibility
    - Test with NVDA or JAWS screen reader
    - Verify ARIA attributes are correct
    - Verify page structure is semantic
    - Verify dynamic content updates are announced
    - _Requirements: Accessibility compliance_

- [ ] 44. Perform browser compatibility testing
  - [ ]* 44.1 Test on desktop browsers
    - Test on Chrome (latest 2 versions)
    - Test on Firefox (latest 2 versions)
    - Test on Safari (latest 2 versions)
    - Test on Edge (latest 2 versions)
    - Fix any browser-specific issues
    - _Requirements: Cross-browser compatibility_

  - [ ]* 44.2 Test on mobile browsers
    - Test on Chrome Mobile (Android)
    - Test on Safari Mobile (iOS)
    - Test responsive design at various screen sizes
    - Test touch interactions
    - _Requirements: Mobile compatibility_

- [ ] 45. Checkpoint - Verify all tests pass
  - Run all unit tests and ensure 80%+ code coverage
  - Run all property-based tests with 100 iterations
  - Run all integration tests
  - Run all security tests
  - Fix any failing tests
  - Document test results
  - Ensure all tests pass, ask the user if questions arise

### Phase 11: Deployment Preparation (Week 13)

- [ ] 46. Set up production environment
  - [ ] 46.1 Configure production server
    - Set up VPS (DigitalOcean/Linode) or PaaS (Heroku/Railway)
    - Install Node.js, PM2, Nginx
    - Configure firewall rules
    - Set up MongoDB Atlas production cluster
    - Configure Firebase Storage production bucket
    - _Requirements: Deployment infrastructure_

  - [ ] 46.2 Configure environment variables
    - Create production .env file with all required variables
    - Set NODE_ENV=production
    - Configure production database connection string
    - Set secure JWT secret (random 256-bit key)
    - Configure production email credentials
    - Configure production SMS credentials
    - Configure Firebase production credentials
    - _Requirements: Production configuration_

  - [ ] 46.3 Set up SSL certificate
    - Install Certbot for Let's Encrypt
    - Generate SSL certificate for domain
    - Configure Nginx with SSL
    - Set up automatic certificate renewal
    - _Requirements: HTTPS security_

  - [ ] 46.4 Configure Nginx reverse proxy
    - Create Nginx configuration file
    - Configure static file serving for /public
    - Configure API proxy to Node.js backend
    - Set up gzip compression
    - Configure security headers
    - Set up rate limiting at Nginx level
    - _Requirements: Web server configuration_

  - [ ] 46.5 Configure PM2 process manager
    - Create ecosystem.config.js for PM2
    - Configure cluster mode with 2 instances
    - Set up log rotation
    - Configure automatic restart on crashes
    - Set up PM2 startup script
    - _Requirements: Process management_


- [ ] 47. Set up monitoring and logging
  - [ ] 47.1 Configure application monitoring
    - Set up PM2 monitoring dashboard
    - Configure error tracking with Sentry (optional)
    - Set up uptime monitoring with UptimeRobot
    - Configure email alerts for downtime
    - _Requirements: Monitoring_

  - [ ] 47.2 Configure log management
    - Set up log rotation with PM2 or logrotate
    - Configure log retention (30 days for application logs, 90 days for audit logs)
    - Set up log aggregation (optional with ELK stack)
    - _Requirements: Logging_

  - [ ] 47.3 Set up database monitoring
    - Configure MongoDB Atlas monitoring dashboard
    - Set up alerts for high CPU/memory usage
    - Set up alerts for slow queries
    - Configure storage usage alerts
    - _Requirements: Database monitoring_

- [ ] 48. Set up backup and disaster recovery
  - [ ] 48.1 Configure automated backups
    - Enable MongoDB Atlas automated daily backups
    - Configure Firebase Storage weekly backups
    - Set up backup retention policy (30 days daily, 90 days weekly)
    - Test backup restoration process
    - _Requirements: Data protection_

  - [ ] 48.2 Create disaster recovery plan
    - Document recovery procedures
    - Define RTO (4 hours) and RPO (24 hours)
    - Create runbook for common failure scenarios
    - Test disaster recovery procedures
    - _Requirements: Business continuity_

- [ ] 49. Perform deployment and migration
  - [ ] 49.1 Deploy application to production
    - Clone repository to production server
    - Install dependencies with npm ci
    - Build frontend assets (if applicable)
    - Start application with PM2
    - Verify all services are running
    - _Requirements: Deployment_

  - [ ] 49.2 Migrate initial data
    - Create initial admin account
    - Import existing course data
    - Seed database with initial courses (RS-CIT, Tally, Excel, Typing, Basic Computer)
    - Verify data integrity
    - _Requirements: Data migration_

  - [ ] 49.3 Configure DNS and domain
    - Point domain to production server IP
    - Configure www redirect
    - Verify SSL certificate works
    - Test all URLs resolve correctly
    - _Requirements: Domain configuration_

- [ ] 50. Perform production testing
  - [ ] 50.1 Test all critical user flows in production
    - Test student registration and login
    - Test admin login and dashboard
    - Test file uploads and downloads
    - Test payment submission and verification
    - Test certificate generation and download
    - Test Excel import and export
    - _Requirements: Production validation_

  - [ ] 50.2 Perform load testing in production
    - Run load tests with realistic traffic patterns
    - Monitor server resources (CPU, memory, disk)
    - Monitor database performance
    - Monitor API response times
    - Optimize if necessary
    - _Requirements: Performance validation_

  - [ ] 50.3 Verify security in production
    - Test HTTPS is enforced
    - Test security headers are set
    - Test rate limiting works
    - Test authentication and authorization
    - Run security scan with OWASP ZAP (optional)
    - _Requirements: Security validation_

- [ ] 51. Create documentation
  - [ ] 51.1 Create user documentation
    - Write student user guide (registration, login, profile, notes, certificates, payments)
    - Write admin user guide (login, dashboard, student management, payment verification, certificate generation)
    - Create video tutorials (optional)
    - _Requirements: User documentation_

  - [ ] 51.2 Create technical documentation
    - Document API endpoints with request/response examples
    - Document database schema and indexes
    - Document environment variables
    - Document deployment procedures
    - Document backup and recovery procedures
    - _Requirements: Technical documentation_

  - [ ] 51.3 Create maintenance documentation
    - Document common troubleshooting steps
    - Document log locations and formats
    - Document monitoring dashboards
    - Document update procedures
    - _Requirements: Maintenance documentation_

- [ ] 52. Final checkpoint and go-live
  - Verify all features are working in production
  - Verify all tests pass
  - Verify monitoring and alerts are configured
  - Verify backups are running
  - Verify documentation is complete
  - Perform final security review
  - Get user acceptance sign-off
  - Announce platform launch
  - Monitor closely for first 48 hours

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property-based tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation follows a 13-week roadmap with clear milestones
- Security and error handling are integrated throughout, not added as afterthoughts
- The platform preserves all existing public website content and design
- All authentication uses JWT tokens with HTTP-only cookies for security
- All passwords are hashed with bcrypt before storage
- All file uploads are validated for type and size
- All admin actions are logged in audit logs
- The system supports both email and SMS notifications
- Excel import/export functionality enables bulk operations
- Property-based testing ensures correctness across a wide range of inputs

## Success Criteria

The implementation will be considered complete when:
1. All non-optional tasks are completed
2. All property-based tests pass with 100 iterations
3. Unit test coverage is at least 80%
4. All integration tests pass
5. Security tests pass without critical vulnerabilities
6. Performance tests show acceptable response times under load
7. Accessibility tests show WCAG 2.1 Level AA compliance
8. Browser compatibility tests pass on all supported browsers
9. Production deployment is successful
10. User acceptance testing is complete
11. Documentation is complete and accurate
12. Monitoring and backups are operational

