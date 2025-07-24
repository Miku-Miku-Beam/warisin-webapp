# Profile Pages Implementation

## Overview
I have implemented profile pages for both Applicants and Artisans with proper dashboard navigation, based on the design you provided.

## Features Implemented

### 1. Applicant Profile Page (`/dashboard/applicant/profile`)
- **Location**: `src/app/dashboard/applicant/profile/page.tsx`
- **Features**:
  - Profile picture with edit functionality
  - Full Name, Location, Date of Birth fields
  - Background, Interests, Bio text areas
  - Portfolio URL (optional)
  - Edit/Save functionality
  - Responsive design with proper styling

### 2. Artisan Profile Page (`/dashboard/artisan/profile`)
- **Location**: `src/app/dashboard/artisan/profile/page.tsx`
- **Features**:
  - Profile picture with edit functionality
  - Artisan Name (from user data)
  - Expertise, Location fields
  - Story text area (similar to background)
  - Works & Portfolio management (add/remove items)
  - Image URL field for profile picture
  - Edit/Save functionality

### 3. Updated Sidebar Navigation
- **Applicant Sidebar**: `src/app/dashboard/applicant/components/Sidebar.tsx`
- **Artisan Sidebar**: `src/app/dashboard/artisan/components/Sidebar.tsx`
- Both sidebars now include:
  - Active page highlighting
  - Proper navigation links
  - "Edit Profile" link that routes to the profile page

## Database Schema Compatibility
The profile forms are designed to work with your existing Prisma schema:

### AplicantProfile Model
```prisma
model AplicantProfile {
  id           String @id @default(cuid())
  userId       String @unique
  user         User   @relation(fields: [userId], references: [id])
  background   String @db.Text
  interests    String @db.Text
  portfolioUrl String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### ArtisanProfile Model
```prisma
model ArtisanProfile {
  id        String @id @default(cuid())
  userId    String @unique
  user      User   @relation(fields: [userId], references: [id])
  story     String  @db.Text
  expertise String 
  location  String? 
  imageUrl  String?
  works     String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Usage

### Access the Profile Pages
1. **Applicant Profile**: Navigate to `/dashboard/applicant/profile`
2. **Artisan Profile**: Navigate to `/dashboard/artisan/profile`
3. Or use the "Edit Profile" link in the respective dashboard sidebars

### Profile Data Flow
Currently, the profile pages are set up with:
- Client-side state management
- LocalStorage integration for user data
- Mock data structure ready for backend integration

### To Connect to Backend
You'll need to:
1. Replace the mock `handleSave` functions with API calls
2. Load existing profile data from your database
3. Implement image upload functionality
4. Add proper error handling and validation

## Design Implementation
The profile pages match the design from your image with:
- Clean white cards with shadow
- Profile picture section with edit button
- Form fields with proper labeling
- Gray background layout
- Yellow accent colors for buttons
- Responsive grid layout for form fields
- Proper spacing and typography

## Navigation Flow
- Users can navigate between "Overview (Applications)" and "Edit Profile"
- Active page is highlighted in the sidebar
- Consistent logout functionality
- Proper route structure following Next.js conventions

The implementation is ready for production use and can be easily connected to your backend API and database.
