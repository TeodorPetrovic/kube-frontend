# Vue.js Blog Frontend

A professional, responsive blog frontend built with Vue 3 and Vite that integrates with a NestJS backend API.

## Features

- 🎨 Clean, professional design
- 📱 Fully responsive (mobile and desktop)
- 🚀 Built with Vue 3 and Vite
- 🔗 Vue Router for navigation
- 📝 Blog posts with categories and tags
- 💬 Comment system
- 🔍 SEO-friendly
- 📄 Static pages support
- 🎯 Dynamic menu system
- 🔒 XSS protection with DOMPurify

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the API base URL:
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── api/           # API service layer
├── components/    # Reusable components
│   └── layout/   # Layout components (Header, Footer)
├── views/         # Page components
├── router/        # Vue Router configuration
├── utils/         # Utility functions (HTML sanitization)
├── App.vue        # Root component
└── main.js        # Application entry point
```

## API Integration

The application integrates with the following API endpoints:

- `/api/posts` - Blog posts
- `/api/categories` - Post categories
- `/api/tags` - Post tags
- `/api/pages` - Static pages
- `/api/menus` - Navigation menus
- `/api/comments` - Post comments

## Pages

- **Home** - Featured recent posts
- **Blog** - All published posts
- **Post Detail** - Individual post with comments
- **Category** - Posts filtered by category
- **Tag** - Posts filtered by tag
- **Static Pages** - Custom pages
- **404** - Not found page

## Security

The application uses DOMPurify to sanitize HTML content from the API before rendering to prevent XSS attacks. All user-generated content is sanitized before being displayed with `v-html`.

## Technologies

- Vue 3 (Composition API)
- Vue Router 4
- Axios for API calls
- DOMPurify for HTML sanitization
- Vite for build tooling
