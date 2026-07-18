# CLAUDE.md

## Project Overview
- This workspace contains the SHALOM project.
- Keep changes focused, documented, and easy to review.

## Working Guidelines
- Prefer small, well-scoped edits.
- Preserve existing conventions unless a change clearly improves them.
- Verify changes when possible before considering them complete.

## Notes
- Add environment-specific values to .env and keep secrets out of version control.
# Shalon Training School Website 
Version :1.0
Framework:Next.js 15 (App Router)
Database:MongoDB Atlas 
Authentication: NextAuth/Auth.js  Take security serious
Styling: Tailwind CSS + shadcn/ui 
Email:Resend 
Hosting:Vercel 
Storage: Cloudianary 

# Project Goal
Build a modern,responsive website with an admin dashboard that allowns the owner to manage courses ,
applicatins ,website content , and contact messages .
No student login in version 1.

# Public Website 
## Home 
Sections 
-Navbar 
-Hero Section 
-Why Choose Us 
-Popular Courses 
-Statistics 
-Testimonials
-Gallery
-CTA
-Footer 
Buttons 
-Apply Now 
-View Courses
-Contact Us 

## About 
Sections 
- Company Story 
-Mission
-Vision
-Accreditation 
- Facilities 
-Gallery

## Courses 
Dispay all courses.
Categories 
-Engineering 
-Artisan Skills 
- Minig & Construction
-Computer Courses 
-Management Courses 
-Trade Test Preparation 

Each card 
-Image 
-Name
-Duration
-Price currency in Rand
-Apply Button 

Filters 
-Category 
-Search 

## Application Page 
Application Form 
Fields 
-Full Name 
-ID Number of South Africa 
-Date of Birth 
- Gender 
- Phone 
-Email 
-Address 
-Course 
-Campus 
-Highest Qualification 
-Upload ID 
-Upload Matric Certificate 

Submit 
After successfull submission 
-Save application 
- send Confirmation email 
- Notify Owner

## Contact 
- Contact Form 
- WhatsApp Button 
- Google Map 
-Rustenburg Campus 

# Authentication 
Owner Login 
Pages 
/login 
Features
-Email
-Password 
-Forgot Password 
-Remember Me 

Protected Routers 

/dashboard/*

Only authenticated owner can access dashboard .

# Dashboard 
Sidebar 
-Dashboard 
-Application 
-Courses 
- Website Content 
- Messages 
- Settings 
-Logout 

## Dashboard Overview 
cards 
- Total Applications
- New Applications 
-Total Couses 
-Total Visitors

Charts 
-application per Month 
-Applications by Course 
Tables 
Recent Applications 
Recent Messages 
# Applications 

Features 
-view 
-Search 
-Filter 
-Delete 
-update Status 

Status 
-pending 
-Contacted 
-Registered 
-Rejected 

Export CSV 
 
 # Courses 
 Crud 
 Owner can 
 -Add 
 -Edit 
 -Delete 
 Fields 
 -Title 
 -Description
 -Duration
 -Price
 -Image 

 # website Content
 Manage 
 -Hero
 -Homepage text 
 -Testimonials 
 -Gallery 
 -Contact Details 
 -Social Links 

 # Message 
 View 
 -contact Messages 
 Actions 
 -Reply
 -Delete 
 -Mark as Read

 # Setting 
 -School Name 
 -Email 
 -Phone Numbers 
 -address 
 -Logo 
 -Password 
  
  # Database Collections 
  admin 
  name 
  email 
  password 
  role 
  createdAt 

  applications 
  name 
  idNumber
  phone 
  email
  course
  campus 
  status 
  documents
  createdAt 

  courses 
  title 
  category 
  price
  duration 
  description 
  image 
  createdAt 

  messages 
  name 
  email 
  phone 
  subject 
  message 
  read 
  createdAt 

  website 
  hero 
  about 
  gallery 
  contact 
  socialLinks 
  # Email Notifications 
  When application submitted 
  send email to 

  Owner 
  subject 
  new student application 
  Applicant 
  Subject 
  Application Received 
  When status Changes 
  Applicant receives 
  -Contacted 
  -Registered 
  -Rejected

  # UI Theme 
  Primary 
  ```
  #0B1F45
  ```
  secondary 
  ````
  #16A34A
  ```
  Background 
  ```
  #F8FAFC
  ```
  Font 
  -Inter 
  Icons 
  -Lucide React 
  ---
  # Folder Structure 
  app 
  -page.txs
  -about
  -courses
  -apply 
  -contact
  -login
  -dashboard 

  components 
  -ui
  -navbar
  -footer
  -hero
  -charts
  -forms

  lib
  -mongodb.tsx
  -auth.ts
  -rensend.ts 

  actions 
  public 
  types 
  hooks 
  utils 

  # Future Version 
  -Student Login
  -Student Dashboard 
  -Online Payments 
  -Attendance Tracking
  -Results Portal
  - Part time students  
  full Time students  
  - Lucter Upload assessment and  the students  downloads them on they dashboard 
  -Sms & WhatsApp Notification 
  -Staff Roles & Permission
  -Analytics Dashboard 

# MVP Deliverables (R5500 package)
-Responsive Website 
-Owner Login 
-Admin Dashboard 
-Course Management 
-Online Application Form 
-Contact form 
-Email Nofications 
-Mobile Friendly 
-Seo Ready 
-Secure Authentication 
-Mongo db atlas 
-Vercel Deployment
- Add Image 

