# Asset Management

A lightweight, browser-based application to track software license information for IT organizations. Built with Vite + React for optimal GitHub Pages hosting.

## 🚀 Features

- 📊 **License Dashboard** - Overview of all licenses with expiry status
- 🔍 **Search & Filter** - Find licenses by product, vendor, department, or category
- ⚠️ **Expiry Alerts** - Visual indicators for licenses nearing expiration
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Built with shadcn/ui components
- ⚡ **Fast Performance** - Optimized with Vite

## 🛠️ Tech Stack

- **Vite** - Fast build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### GitHub Pages Deployment

1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Push to main branch** - automatic deployment via GitHub Actions

## 📁 Project Structure

```
asset-management-vite/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── lib/utils.ts      # Utility functions
│   ├── App.tsx          # Main application
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── .github/workflows/    # GitHub Actions
├── public/              # Static assets
└── dist/                # Build output
```

## 🎯 Demo Data

The application includes sample license data:

- **Microsoft Office 365** - Expires 2024-12-31
- **Adobe Creative Suite** - Expires 2024-08-15 (Expired)
- **Slack Pro** - Expires 2024-06-30 (Expiring Soon)
- **JetBrains IntelliJ IDEA** - Expires 2025-03-15

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_APP_TITLE=Asset Management
VITE_APP_DESCRIPTION=Asset Management Systems
```

### GitHub Pages Base Path

Update `vite.config.ts` for your repository:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- Customize component styles in `src/components/ui/`

### Data
- Replace demo data in `App.tsx` with your license information
- Add API integration for dynamic data loading
- Implement authentication for secure access

## 🚀 Deployment

### GitHub Pages (Recommended)
- Automatic deployment via GitHub Actions
- No additional configuration required
- Free hosting with custom domain support

### Other Platforms
- **Netlify**: Connect repository for automatic deployments
- **Vercel**: Import project for serverless deployment
- **Firebase Hosting**: Use Firebase CLI for deployment

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Optimized for mobile browsers

## 🔒 Security

- No server-side code required
- Static site generation
- Client-side only functionality
- License keys obfuscated by default

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆚 Migration from Next.js

This version is optimized for GitHub Pages hosting:

### ✅ Advantages
- **Faster builds** - Vite is significantly faster
- **Smaller bundles** - Better tree shaking
- **GitHub Pages ready** - No server-side features
- **Simpler deployment** - Static files only

### 🔄 Migration Notes
- Removed server-side features (API routes, SSR)
- Simplified authentication (demo mode only)
- Optimized for static hosting
- Maintained all UI functionality

---

**Built with ❤️ using Vite + React**
