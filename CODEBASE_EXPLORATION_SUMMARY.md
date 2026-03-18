# SportConnect Frontend - Comprehensive Codebase Exploration

**Date**: March 18, 2026  
**Framework**: Next.js 16.0.10 with TypeScript & Tailwind CSS  
**UI Library**: Radix UI Components (shadcn/ui)

---

## 1. PROJECT STRUCTURE OVERVIEW

### Main Technology Stack
- **Next.js**: App Router (v16.0.10)
- **React**: 19.2.0
- **TypeScript**: Strict mode enabled
- **UI Framework**: Tailwind CSS with Radix UI components
- **HTTP Client**: Axios (1.13.6)
- **Form Handling**: React Hook Form (7.60.0)
- **State Management**: React Context (AuthContext)
- **Notifications**: Custom toast system + Sonner
- **Date Formatting**: date-fns (4.1.0)

### Directory Structure
```
app/                          # Next.js App Router pages
├── page.tsx                 # Homepage (Feed with layout)
├── login/                   # Login page
├── register/                # Registration page
├── clubs/                   # Clubs listing & detail pages
├── jobs/                    # Job postings
├── network/                 # Networking/connections
├── profile/                 # User profile
├── messaging/               # Direct messages
├── notifications/           # User notifications
├── search/                  # Search functionality
└── my-club/                 # User's club management

components/                   # Reusable React components
├── feed/                    # Post/Feed related
│   ├── create-post.tsx     # Post creation modal
│   ├── feed.tsx            # Main feed container
│   ├── post-card.tsx       # Individual post display
│   ├── comments.tsx        # Comment section
│   ├── left-sidebar.tsx    # Navigation sidebar
│   └── right-sidebar.tsx   # Trending/Recommended
├── clubs/                   # Club-specific components
│   ├── clubs-grid.tsx      # Club listing grid
│   ├── club-card.tsx       # Individual club card
│   ├── club-header.tsx     # Club header section
│   ├── club-content.tsx    # Club detail content
│   └── club-sidebar.tsx    # Club side panel
├── layout/                  # Layout components
│   └── header.tsx          # Top navigation header
├── ui/                      # Radix UI component wrappers
└── [other features]/        # Jobs, messaging, profile, etc.

lib/                         # Utilities & helpers
├── api/
│   ├── client.ts           # Axios instance with interceptors
│   └── endpoints.ts        # API endpoint definitions
├── types/
│   └── api.ts               # TypeScript type definitions
└── utils/
    ├── auth.ts              # JWT token management
    └── index.ts             # General utilities

contexts/                    # React Context
└── AuthContext.tsx          # Authentication state management

hooks/                       # Custom React hooks
├── use-toast.ts             # Toast notification system
└── use-mobile.ts            # Mobile detection hook
```

---

## 2. ERROR HANDLING & MESSAGE DISPLAY

### Error Display Patterns

**Locations where errors are displayed:**

1. **Alert Component Pattern**
   - File: Throughout application (clubs page, login, feed, etc.)
   - Component: `Alert` + `AlertDescription` from `@/components/ui/alert`
   - Icon: `AlertCircle` (lucide-react)
   - Variants: `"destructive"` for errors
   - Example: [app/login/page.tsx](app/login/page.tsx#L73) - Login error display

2. **API Error Handling - Client Layer** ([lib/api/client.ts](lib/api/client.ts))
   - **Response Interceptor** extracts error messages with priority:
     1. `error.response.data.message` (backend error message)
     2. First validation error from `error.response.data.errors` object
     3. Default: `error.message` or "An error occurred"
   
   - **Normalized Error Object** returned:
     ```typescript
     interface ApiError {
       message: string;
       status: number;
       errors?: Record<string, string>;
     }
     ```

3. **Timeout Handling**
   - **Timeout Setting**: `API_TIMEOUT = 30000ms` (30 seconds)
   - **Configuration**: [lib/api/client.ts](lib/api/client.ts#L10)
   - Axios timeout error will be caught in response interceptor

4. **Connection Error Handling**
   - **Status 401 (Unauthorized)**: Clears tokens, redirects to login
   - **Other errors**: Normalized message returned to component errors state
   - **No auto-retry** implemented for failed requests (TODO in client.ts)

### Error Display in Components

**Feed Component** ([components/feed/feed.tsx](components/feed/feed.tsx#L23))
```tsx
const [error, setError] = useState("");
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

**Post Creation** ([components/feed/create-post.tsx](components/feed/create-post.tsx#L111))
- Form validation: "Le contenu ne peut pas être vide"
- Media validation: "Veuillez fournir une URL pour le média"
- API errors: Network/timeout errors displayed in modal dialog

**Login/Register Pages** ([app/login/page.tsx](app/login/page.tsx#L19-L43))
- Error clears when user starts typing
- Direct API error message display

### Toast Notification System
- **File**: [hooks/use-toast.ts](hooks/use-toast.ts)
- **Library**: Sonner (1.7.4)
- **Limit**: Single toast at a time (TOAST_LIMIT = 1)
- **Auto-dismiss**: None (TOAST_REMOVE_DELAY = 1000000ms = ~11 days)

---

## 3. HARDCODED DATA & CITY/CLUB LOCATIONS

### Hardcoded Club Data
**File**: [components/clubs/clubs-grid.tsx](components/clubs/clubs-grid.tsx#L32)

**Hardcoded clubs array includes:**
1. **Paris Saint-Germain** - Paris, France
2. **Olympique de Marseille** - Marseille, France ⭐ (Appears in multiple places)
3. **INF Clairefontaine** - Clairefontaine, France
4. **Fédération Française de Football** - Paris, France
5. **AS Monaco** - Monaco
6. **Paris Basketball** - Paris, France
7. **Académie Jean-Marc Guillou** - Abidjan, Côte d'Ivoire
8. **Decathlon Sport** - Villeneuve-d'Ascq, France

### Hardcoded "Marseille" References

| File | Location | Content |
|------|----------|---------|
| [components/clubs/clubs-grid.tsx](components/clubs/clubs-grid.tsx#L61) | Line 61 | `location: "Marseille"` in OM club object |
| [components/clubs/club-sidebar.tsx](components/clubs/club-sidebar.tsx#L82) | Line 82 | `"3 Boulevard Michelet, 13008 Marseille"` |
| [components/clubs/club-header.tsx](components/clubs/club-header.tsx#L74) | Line 74 | `Olympique de Marseille` title |
| [components/clubs/club-header.tsx](components/clubs/club-header.tsx#L81) | Line 81 | `Marseille, France` location display |
| [components/clubs/club-content.tsx](components/clubs/club-content.tsx#L103) | Line 103 | French description of OM |
| [components/search/search-results.tsx](components/search/search-results.tsx#L102-L104) | Lines 102-104 | Hardcoded search result data |

### City Data Usage Pattern
- Cities are part of the `Club` interface: `city?: string;`
- Type definition: [lib/types/api.ts](lib/types/api.ts#L134)
- Displayed in: Club cards, club headers, detail pages
- Backend integration: City comes from API response

---

## 4. POST/PUBLICATION CREATION FLOW & POTENTIAL FAILURES

### Post Creation Component
**File**: [components/feed/create-post.tsx](components/feed/create-post.tsx)

#### Component Structure
```tsx
interface CreatePostProps {
  onPostCreated: (post: any) => void;
  currentUser: User;
}

State Variables:
- content: string                          // Post text content
- postType: "TEXT" | "IMAGE" | "VIDEO"... // Post category
- mediaUrl: string                         // URL for image/video
- isSubmitting: boolean                    // Loading state
- error: string                            // Error messages
```

#### Post Types Available
1. **TEXT** - Text-only posts
2. **IMAGE** - Posts with image URL
3. **VIDEO** - Posts with video URL
4. **PERFORMANCE** - Performance/achievement posts
5. **JOB** - Job postings (type defined but not UI exposed)

#### Validation Rules (Before Publishing)
1. **Content must not be empty**
   ```tsx
   if (!content.trim()) {
     setError("Le contenu ne peut pas être vide");
     return;
   }
   ```

2. **Media URL required for IMAGE/VIDEO types**
   ```tsx
   if ((postType === "IMAGE" || postType === "VIDEO") && !mediaUrl.trim()) {
     setError("Veuillez fournir une URL pour le média");
     return;
   }
   ```

#### Request Payload
```typescript
interface CreatePostRequest {
  content: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "JOB" | "PERFORMANCE";
  mediaUrl?: string;
  clubId?: string;  // Optional club association
}
```

#### API Endpoint
- **URL**: `POST /api/posts`
- **API Call**: `api.post.create(postData)` → [lib/api/endpoints.ts](lib/api/endpoints.ts#L92)
- **Error Handling**: Catches error, displays `err.message || "Échec de la publication"`

#### Why Publications Might Fail

1. **Empty Content** (Frontend validation prevents submission)
   - Error: "Le contenu ne peut pas être vide"

2. **Missing Media URL** (Frontend validation)
   - Error: "Veuillez fournir une URL pour le média"

3. **Invalid Media URL** (User responsibility)
   - Images with invalid URLs show placeholder: `https://via.placeholder.com/400x200?text=Image+non+disponible`
   - Videos with invalid URLs show fallback player: "Votre navigateur ne supporte pas..." 
   - No frontend validation of URL format

4. **API Failures - Network Issues**
   - Timeout (30s default)
   - Server returns error (400+)
   - Backend validation failure (email verification, etc.)
   - Caught in `catch (err)` block

5. **Authentication Issues**
   - 401 token expiration
   - Missing Authorization header

6. **Backend Processing**
   - Database constraints (max content length, etc.)
   - Media type validation
   - Rate limiting (if implemented)

#### Post Creation Flow (Step-by-Step)

```
1. User clicks "Créer un post" or post type button
   ↓
2. Dialog modal opens
   ↓
3. User enters content + selects post type
   ↓
4. For IMAGE/VIDEO: User provides media URL
   ↓ (Preview shown via <img> or placeholder)
5. User clicks "Publier" button
   ↓
6. Frontend validation:
   - Check content not empty
   - Check mediaUrl if IMAGE/VIDEO type
   ↓
7. POST /api/posts with CreatePostRequest
   ↓
8. Loading state: isSubmitting = true
   ↓
9. Success: 
   - Reset form
   - Close dialog
   - Call onPostCreated(response.data)
   - Feed component prepends new post: setPosts([newPost, ...posts])
   ↓
10. Error:
    - Display error message in Alert
    - Keep form open for retry
    - User re-attempts
```

#### Post Form Reset
```tsx
const resetForm = () => {
  setContent("");
  setPostType("TEXT");
  setMediaUrl("");
  setError("");
};
```

---

## 5. IMAGE UPLOAD/URL INPUT COMPONENTS

### Current Image Handling Approach

**Philosophy**: URL-based, not file upload

### Input Components

1. **Media URL Text Input** ([components/feed/create-post.tsx](components/feed/create-post.tsx#L165-L186))
   ```tsx
   <input
     type="url"
     placeholder={`URL de ${postType === "IMAGE" ? "l'image" : "la vidéo"}`}
     value={mediaUrl}
     onChange={(e) => setMediaUrl(e.target.value)}
     disabled={isSubmitting}
     className="w-full px-3 py-2 border border-border rounded-md"
   />
   ```
   - Plain HTML input (not custom component)
   - Accepts any URL string
   - No format validation
   - Placeholder changes based on media type

2. **Image Preview** ([components/feed/create-post.tsx](components/feed/create-post.tsx#L188-L220))
   ```tsx
   {mediaUrl && (
     <div className="relative">
       {postType === "IMAGE" ? (
         <img
           src={mediaUrl}
           alt="Preview"
           className="w-full h-48 object-cover rounded-md"
           onError={(e) => {
             e.currentTarget.src = 
               "https://via.placeholder.com/400x200?text=Image+non+disponible";
           }}
         />
       ) : (
         // Video placeholder for non-image types
         <div className="w-full h-48 bg-secondary rounded-md flex items-center justify-center">
           <Video className="h-12 w-12 text-muted-foreground" />
         </div>
       )}
       {/* Remove button */}
       <Button
         variant="secondary"
         size="icon"
         className="absolute top-2 right-2"
         onClick={() => setMediaUrl("")}
       >
         <X className="h-4 w-4" />
       </Button>
     </div>
   )}
   ```

   - **Image Preview**: 
     - Actual image loaded from URL
     - Error handler shows placeholder
     - Size: 48 height, full width, cover fit

   - **Video Preview**: 
     - Shows gray box with video icon (no actual video preview)
     - No video validation

3. **Post Card Media Display** ([components/feed/post-card.tsx](components/feed/post-card.tsx#L126-L145))
   ```tsx
   {post.mediaUrl && (
     <div className="rounded-lg overflow-hidden">
       {post.type === "IMAGE" && (
         <img
           src={post.mediaUrl}
           alt="Post media"
           className="w-full h-auto object-cover"
           onError={(e) => {
             e.currentTarget.src = 
               "https://via.placeholder.com/600x400?text=Image+non+disponible";
           }}
         />
       )}
       {post.type === "VIDEO" && (
         <video
           src={post.mediaUrl}
           controls
           className="w-full h-auto"
         >
           Votre navigateur ne supporte pas la lecture de vidéos.
         </video>
       )}
     </div>
   )}
   ```

### Issues with URL-Based Image Handling

1. **No CORS Protection**: Direct image URLs must be accessible from browser
2. **No File Size Limits**: User can paste huge file URLs
3. **No Format Validation**: Any string accepted as URL
4. **Error Handling**: Only fallback image on load failure
5. **Security**: Potential for loading unsafe content
6. **Next.js Image Optimization Disabled**
   - [next.config.mjs](next.config.mjs#L4-L6):
     ```javascript
     images: {
       unoptimized: true,
     }
     ```
   - Using `<img>` tags directly instead of Next.js `<Image>`

### No File Upload Component
- No file input (`<input type="file">`)
- No drag-and-drop functionality
- No multipart/form-data handling
- Pure string URL approach

---

## 6. RESPONSIVE DESIGN & TAILWIND BREAKPOINTS

### Breakpoint Usage Analysis

**Tailwind CSS Breakpoints Used:**
- `sm:` (640px) - Small devices
- `md:` (768px) - Medium tablets
- `lg:` (1024px) - Large tablets/small laptops
- `xl:` (1280px) - Large laptops

### Main Layout Pattern (Homepage)
**File**: [app/page.tsx](app/page.tsx)

```tsx
<div className="min-h-screen bg-background">
  <Header />
  <main className="max-w-7xl mx-auto px-4 py-6">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <LeftSidebar />
      </div>
      
      {/* Main Feed */}
      <Feed />
      
      {/* Right Sidebar - Hidden on mobile and tablet */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>
    </div>
  </main>
</div>
```

**Responsive Behavior:**
- **Mobile (< 1024px)**: Single column - Feed only
- **Tablet (1024px-1279px)**: Two columns - Feed + LeftSidebar
- **Desktop (≥ 1280px)**: Three columns - LeftSidebar + Feed + RightSidebar

### Key Responsive Components

| Component | Location | Breakpoints | Behavior |
|-----------|----------|-------------|----------|
| Clubs Grid | [components/clubs/clubs-grid.tsx](components/clubs/clubs-grid.tsx#L150) | `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` | 1 col mobile, 2 col tablet, 3 col desktop |
| Club Detail Page | [app/clubs/[id]/page-new.tsx](app/clubs/[id]/page-new.tsx#L138) | `flex-col md:flex-row` + `lg:col-span-2` | Stacked mobile, side-by-side desktop |
| Jobs Filters | [app/jobs/page.tsx](app/jobs/page.tsx#L100) | `flex-col sm:flex-row` | Column mobile, row on sm+ |
| Network Layout | [app/network/page.tsx](app/network/page.tsx#L12-L16) | `grid-cols-1 lg:grid-cols-4` | Full-width mobile, 4-col grid desktop |
| Create Post Quick Actions | [components/feed/create-post.tsx](components/feed/create-post.tsx#L248) | `hidden sm:inline` | Text labels hidden on mobile |
| Register Form | [app/register/page.tsx](app/register/page.tsx#L195) | `grid-cols-1 md:grid-cols-2` | 1 col mobile, 2 col tablet+ |

### Header Responsive Pattern
**File**: [components/layout/header.tsx](components/layout/header.tsx)

```tsx
// Logo visibility
<span className="hidden xl:block font-semibold">SportConnect</span>

// Search bar responsiveness
<div className={`relative flex-1 transition-all 
  ${searchFocused ? "lg:flex-none lg:w-80" : ""}`}>
  <Input type="search" placeholder="Rechercher..." />
</div>

// Mobile menu for navigation
{mobileMenuOpen && (
  // Mobile navigation menu
)}
```

### Tailwind CSS Custom Configuration

**Spacing**: Uses CSS custom properties
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` [app/globals.css](app/globals.css#L108-L111)

### Responsive Design Issues/Patterns Found

1. **Mobile Menu**: Header has mobile menu toggle (Menu/X icons)
2. **Hidden Elements**:
   - Left sidebar: `hidden lg:block` (max-width: 1023px = hidden)
   - Right sidebar: `hidden xl:block` (max-width: 1279px = hidden)
3. **Flexible Components**: Dialog modals max-width: `sm:max-w-[600px]`
4. **Text Hiding**:
   - Icon-only buttons on mobile: `<span className="hidden sm:inline">`

---

## 7. ERROR HANDLING PATTERNS SUMMARY

### Pattern Types Used

1. **State-Based Errors** (Most common)
   ```tsx
   const [error, setError] = useState("");
   // In try-catch:
   setError(err.message || "Generic message");
   // In JSX:
   {error && <Alert variant="destructive">{error}</Alert>}
   ```

2. **API Client Error Normalization** ([lib/api/client.ts](lib/api/client.ts))
   - Interceptor standardizes all API errors
   - Returns `ApiError` object with `message`, `status`, `errors`

3. **Optimistic Updates with Rollback**
   ```tsx
   // Like/unlike posts
   setPosts([updates]);           // Update UI immediately
   await api.post.like(...);      // Call API
   // If error: loadPosts() resets to correct state
   ```

4. **User Confirmation Dialogs**
   ```tsx
   if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
     return;
   }
   ```

5. **Loading States**
   ```tsx
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   {isLoading && <Loader2 className="animate-spin" />}
   ```

---

## 8. MAIN PAGE/COMPONENT FILES - QUICK REFERENCE

### Pages (App Routes)

| Page | File | Purpose | Key Features |
|------|------|---------|--------------|
| Home/Feed | [app/page.tsx](app/page.tsx) | Main dashboard | Three-column layout, responsive |
| Login | [app/login/page.tsx](app/login/page.tsx) | Authentication | Error display, loading state |
| Register | [app/register/page.tsx](app/register/page.tsx) | User signup | Multi-step form, role selection |
| Clubs | [app/clubs/page.tsx](app/clubs/page.tsx) | Club listing | Dynamic data from API, error handling |
| Club Detail | [app/clubs/[id]/page-new.tsx](app/clubs/[id]/page-new.tsx) | Club profile | Dynamic routing, tabs |
| Jobs | [app/jobs/page.tsx](app/jobs/page.tsx) | Job postings | Grid/list view, filters |
| Network | [app/network/page.tsx](app/network/page.tsx) | Connections | 4-column layout, suggestions |
| Profile | [app/profile/page.tsx](app/profile/page.tsx) | User profile | Personal data, statistics |
| Messaging | [app/messaging/page.tsx](app/messaging/page.tsx) | Direct messages | Conversation list |
| Notifications | [app/notifications/page.tsx](app/notifications/page.tsx) | Alerts | Notification history |
| Search | [app/search/page.tsx](app/search/page.tsx) | Global search | Search results view |

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **Feed** | [components/feed/feed.tsx](components/feed/feed.tsx) | Main feed container, post loading |
| **Create Post** | [components/feed/create-post.tsx](components/feed/create-post.tsx) | Post creation modal, validation |
| **Post Card** | [components/feed/post-card.tsx](components/feed/post-card.tsx) | Individual post rendering |
| **Comments** | [components/feed/comments.tsx](components/feed/comments.tsx) | Comment section |
| **Header** | [components/layout/header.tsx](components/layout/header.tsx) | Top navigation, responsive menu |
| **Sidebars** | [components/feed/left-sidebar.tsx](components/feed/left-sidebar.tsx), [right-sidebar.tsx](components/feed/right-sidebar.tsx) | Navigation & recommendations |
| **Clubs Grid** | [components/clubs/clubs-grid.tsx](components/clubs/clubs-grid.tsx) | Club listing (hardcoded data) |
| **Club Card** | [components/clubs/club-card.tsx](components/clubs/club-card.tsx) | Individual club display |

---

## 9. KEY FINDINGS & RECOMMENDATIONS

### Critical Issues Found

1. **Hardcoded Club Data in Frontend**
   - File: [components/clubs/clubs-grid.tsx](components/clubs/clubs-grid.tsx#L32)
   - Issue: 8 clubs hardcoded when API should provide these
   - Recommendation: Remove hardcoded array, fetch from `GET /api/clubs`

2. **Image Handling Limitations**
   - No file upload capability
   - URL-based only (relies on external URLs)
   - No validation of image URLs
   - Recommendation: Add file upload with backend storage OR validate URLs

3. **Limited Error Context**
   - Generic error messages don't distinguish between network/server errors
   - No request retry logic
   - Recommendation: Add error categorization (timeout vs 400 vs 500)

4. **No Token Refresh**
   - TODO comment in [lib/api/client.ts](lib/api/client.ts#L76-L77)
   - 401 errors just redirect to login
   - Recommendation: Implement refresh token rotation

### Strengths Found

1. ✅ Consistent error handling pattern across components
2. ✅ Good responsive design with Tailwind (mobile-first)
3. ✅ Proper TypeScript types for all API interactions
4. ✅ Centralized API client with interceptors
5. ✅ Context-based authentication management
6. ✅ Optimistic UI updates with rollback capability

### Potential Publication Failure Scenarios

```
User attempts to create post with image:
├─ Frontend: Empty content → Validation error ✓
├─ Frontend: Empty image URL → Validation error ✓
├─ Frontend: Invalid image URL → Shows placeholder in preview
│  └─ Publishing still works (backend might reject)
├─ Network timeout (30s) → "Échec de la publication"
├─ 401 Unauthorized → Token expired → Redirects to login
├─ 400 Bad Request → Backend validation → Error displayed
├─ 500 Server Error → "Échec de la publication"
└─ CORS Error → Network error → "Échec de la publication"
```

---

## 10. ENVIRONMENT CONFIGURATION

**File**: [.env.local](../../.env.local)
```env
NEXT_PUBLIC_API_URL=https://galsenfoot-backend.onrender.com
```

**Client Configuration** ([lib/api/client.ts](lib/api/client.ts#L6-L7))
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  "https://galsenfoot-backend.onrender.com";
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"
);
```

---

## APPENDIX: API TYPES

### User Types
- `User` - Basic user info (id, email, username, firstName, lastName, role)
- `UserProfile` - Extended profile (bio, location, profilePicture, skills, etc.)
- `UserRole` - "PLAYER" | "AGENT" | "COACH" | "CLUB_ADMIN" | "SCOUT" | "FAN"

### Post Types
- `Post` - Full post object with metadata
- `CreatePostRequest` - What's sent to create endpoint
- `Post.type` - "TEXT" | "IMAGE" | "VIDEO" | "JOB" | "PERFORMANCE"

### Comment Types
- `Comment` - Individual comment on a post

### Club Types
- `Club` - Full club object with 30+ properties
- `Club.type` - "club" | "academy" | "federation" | "sponsor"

---

**Generated**: 2026-03-18  
**Framework**: Next.js App Router with TypeScript  
**Build Status**: ✅ Successfully builds (npm run build passed)
