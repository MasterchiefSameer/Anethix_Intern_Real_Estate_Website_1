# Product Requirements Document (PRD): Real Estate Website

## 1. Project Overview
A modern and responsive web application for a real estate company. It allows customers to explore properties, view details, submit enquiries, and schedule site visits. It includes a comprehensive admin panel for managing listings, categories, visits, and customer enquiries.

## 2. Objectives
- Build a responsive full-stack web application (MERN stack or similar).
- Design an intuitive property browsing experience.
- Implement secure authentication and CRUD operations.
- Ensure high functionality and clean UI/UX design.

## 3. Functional Requirements

### 3.1 Customer Side (Frontend)
- **Home Page**: Featured properties, search bar, and company highlights.
- **About Company**: Information about the real estate firm.
- **Property Listings**: Display available properties with sorting/pagination.
- **Property Details**: Deep dive into individual property details (images, amenities, price, description).
- **Search & Filters**: Search by location, price range, property type, etc.
- **Schedule Site Visit**: Form for users to request a visit to a property.
- **Contact Page**: General contact form for enquiries.
- **Customer Login & Registration**: User authentication for saving preferences and managing visits.

### 3.2 Admin Side (Backend/Dashboard)
- **Dashboard**: Overview of metrics (total properties, enquiries, site visits).
- **Manage Property Listings**: Add, edit, delete property entries.
- **Manage Property Categories**: Create and modify categories (e.g., Commercial, Residential).
- **Manage Site Visit Requests**: Approve, reject, or reschedule user visit requests.
- **View Customer Enquiries**: Review and respond to general contact messages.

## 4. Optional Enhancements (Bonus)
- Property comparison tool.
- Interactive location map for properties.
- Mortgage / EMI calculator.
- Email notifications (via Sonner for UI alerts).
- Save favourite properties (wishlist).
- Dark Mode toggle.
- Analytics dashboard for admins.

## 5. Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, shadcn UI.
- **Backend**: Node.js & Express.
- **Database**: MongoDB (or MySQL).
- **Authentication**: Local storage with bcrypt (Frontend mockup phase), JWT (Backend phase).
- **Version Control**: Git & GitHub.
