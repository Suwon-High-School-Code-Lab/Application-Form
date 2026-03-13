# Application Form System - Setup Guide

A full-featured application form system with admin panel, authentication, dynamic form builder, and results viewing built with Next.js 16, Supabase, and shadcn/ui.

## Features

- 🔐 **Authentication System** - Email/password login and signup with Supabase Auth
- 📝 **Dynamic Form Builder** - Admin panel to create and manage form questions
- 🎨 **Theme Support** - Light/dark mode with next-themes
- 📊 **Results Dashboard** - View submissions (user view + admin view)
- 💾 **Draft Saving** - Save application progress and continue later
- 🔒 **Row Level Security** - Secure data access with Supabase RLS policies
- 📱 **Responsive Design** - Mobile-first design with TailwindCSS

## Tech Stack

- **Frontend**: Next.js 16.1.6 (App Router) + React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui components
- **Backend**: Supabase (Auth + Database + RLS)
- **Markdown**: react-markdown for rich question content
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create tables, RLS policies, and triggers

This will create:
- `profiles` table - User profiles with admin flag
- `form_questions` table - Dynamic form questions
- `form_submissions` table - User submissions
- Row Level Security policies
- Automatic profile creation trigger

### 4. Create an Admin User

After running the schema, you need to manually set a user as admin:

1. Sign up through the application at `/signup`
2. In Supabase dashboard, go to Authentication > Users
3. Copy your user ID
4. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id-here';
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   └── forms/page.tsx          # Form builder page
│   ├── apply/page.tsx              # Public application form
│   ├── results/page.tsx            # Results viewing page
│   ├── api/auth/signout/route.ts   # Logout API route
│   ├── layout.tsx                  # Root layout with theme provider
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx           # Login form component
│   │   └── SignupForm.tsx          # Signup form component
│   ├── admin/
│   │   ├── QuestionEditor.tsx      # Question create/edit dialog
│   │   └── QuestionList.tsx        # Question list display
│   ├── form/
│   │   └── DynamicFormField.tsx    # Dynamic form field renderer
│   ├── ThemeProvider.tsx           # Theme provider wrapper
│   └── ThemeToggle.tsx             # Theme toggle button
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   └── middleware.ts           # Auth middleware
│   ├── hooks/
│   │   └── useAuth.ts              # Auth hook
│   └── types/
│       └── database.types.ts       # TypeScript types
└── middleware.ts                   # Next.js middleware
```

## Usage Guide

### For Admins

1. **Login** at `/login` with your admin account
2. **Access Admin Panel** at `/admin/forms`
3. **Create Questions**:
   - Click "Add Question"
   - Enter title and optional markdown content
   - Choose answer type (short text, long text, multiple choice, checkbox, file upload)
   - Add options for multiple choice/checkbox questions
   - Set as required or optional
4. **Edit/Delete Questions** using the action buttons
5. **View All Submissions** at `/results`

### For Applicants

1. **Sign Up** at `/signup` to create an account
2. **Fill Out Application** at `/apply`
3. **Save Draft** to continue later (requires login)
4. **Submit Application** when complete
5. **View Your Submission** at `/results`

## Database Schema

### profiles
- `id` (uuid) - Links to auth.users
- `email` (text)
- `is_admin` (boolean)
- `created_at` (timestamp)

### form_questions
- `id` (uuid)
- `order` (integer) - Display order
- `title` (text) - Question title
- `content` (text) - Optional markdown content
- `answer_type` (enum) - Type of answer field
- `options` (jsonb) - Options for multiple choice/checkbox
- `required` (boolean)
- `created_at`, `updated_at` (timestamp)

### form_submissions
- `id` (uuid)
- `user_id` (uuid) - Links to auth.users
- `answers` (jsonb) - All answers as key-value pairs
- `submitted_at` (timestamp)
- `status` (enum) - 'draft' or 'submitted'

## Security Features

- **Row Level Security (RLS)** - All tables protected with RLS policies
- **Server-side Auth Checks** - Admin routes verify permissions server-side
- **Secure Cookies** - Auth tokens stored in HTTP-only cookies
- **Protected Routes** - Middleware redirects unauthenticated users

## Answer Types

1. **Short Text** - Single line text input
2. **Long Text** - Multi-line textarea
3. **Multiple Choice** - Radio buttons (single selection)
4. **Checkbox** - Multiple selections allowed
5. **File Upload** - File input field

## Customization

### Styling
- Edit `src/app/globals.css` to customize theme colors
- Modify shadcn/ui components in `src/components/ui/`

### Adding Features
- Add new answer types in `database.types.ts` and update `DynamicFormField.tsx`
- Extend RLS policies in Supabase for additional security rules
- Add email notifications using Supabase Edge Functions

## Troubleshooting

### "Failed to fetch" errors
- Check that `.env.local` has correct Supabase credentials
- Verify Supabase project is active

### "Permission denied" errors
- Ensure RLS policies are created correctly
- Check that admin user has `is_admin = true` in profiles table

### Theme not switching
- Clear browser cache and cookies
- Check that ThemeProvider is in root layout

## Build for Production

```bash
npm run build
npm start
```

## License

MIT