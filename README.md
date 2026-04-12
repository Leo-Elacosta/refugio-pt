# 🏡 Refúgio.pt

A modern property booking system (Airbnb-style) built with **Next.js** and **Supabase**. This project allows users to list their own spaces and book stays at properties owned by others, featuring a robust system to prevent double-booking and a complete management Dashboard.

## ✨ Key Features

* **User Authentication**: Secure login and registration managed by Supabase Auth.
* **Listing and Filters**: Explore available properties with fast and responsive navigation.
* **Advanced Booking System**: 
  * Automatic total price calculation based on the selected dates.
  * Visual blocking of already booked dates on the calendar.
  * Client and server-side validation to prevent overlapping reservations (Double-Booking).
* **Management Dashboard (User Area)**:
  * **My Bookings**: View and cancel planned trips.
  * **My Listings**: Manage and delete properties registered by the user.
* **Data Security (RLS)**: The database is protected by *Row Level Security* (RLS), ensuring that only owners can delete their properties or cancel their specific bookings.

## 🛠️ Tech Stack

* **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React, TypeScript.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/).
* **Icons**: [Lucide React](https://lucide.dev/).
* **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS).
Example:
![regutiopt_example](https://github.com/user-attachments/assets/f6ed5c95-7b7d-4e53-9297-38159e16bdcf)

