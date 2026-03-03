# Kirubel Mulat - Portfolio Website

A modern, responsive portfolio website showcasing my journey as a Software Engineering student at Bournemouth University and my projects in web development, Discord bots, and client work.


## 🚀 Features

- **Modern Design**: Clean, professional layout with gradient styling and dark theme
- **Responsive Layout**: Optimized for all devices from mobile to desktop
- **Interactive Elements**: Custom cursor glow effects and smooth animations
- **Project Showcases**: Detailed sections for personal and university projects
- **Dynamic Modals**: Interactive project details with routing integration
- **Performance Optimized**: Built with Next.js 15 and Turbopack for fast loading

##  Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linting**: [ESLint](https://eslint.org/) with Next.js config
- **Build Tool**: [Turbopack](https://turbo.build/pack) for fast development
- **Deployment**: [Vercel](https://vercel.com/) (production ready)

##  Sections

### About
Personal introduction highlighting my background as a 2nd year Software Development student, passion for web development, and experience with client projects.

### Education
- **Bournemouth University** (2023 - Current) - Software Engineering BSc
- **Coopers School** (2021 - 2023) - A-Levels in Computer Science & Photography

### Personal Projects
- **[Hawkshot](/)** - Discord bot for League of Legends and VALORANT game tracking
- **[Honkai.me](https://honkai.me)** - Comprehensive Honkai Impact 3rd community website
- **[D.London](https://d-london.com)** - Client website for Ethiopian fashion brand

### University Projects
- **[Trikommerce](https://github.com/sentrisentri/Trikommerce-Project)** - Python e-commerce application
- **[Contacts Management](https://github.com/sentrisentri/contacts)** - Python contact management system

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sentrisentri/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

##  Project Structure

```
portfolio/
├── src/
│   └── app/
│       ├── globals.css          # Global styles
│       ├── layout.tsx           # Root layout component
│       ├── page.tsx             # Main portfolio page
│       ├── hawkshot/
│       │   └── page.tsx         # Hawkshot bot details
│       ├── privacy-policy/
│       │   └── page.tsx         # Privacy policy
│       └── terms-of-service/
│           └── page.tsx         # Terms of service
├── public/                      # Static assets
├── .gitignore                   # Git ignore rules
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

##  Design Features

### Interactive Elements
- **Custom Cursor**: Glow effect that adapts to hoverable elements
- **Smooth Transitions**: CSS animations for enhanced user experience
- **Dynamic Modals**: Project details with URL routing integration
- **Responsive Navigation**: Sticky sidebar navigation on larger screens

### Accessibility
- Semantic HTML structure
- ARIA labels and screen reader support
- Keyboard navigation friendly
- High contrast text for readability

## 🔧 Customization

### Adding New Projects
1. Update the projects section in `src/app/page.tsx`
2. Add project assets to the `public/` directory
3. Update navigation if creating dedicated pages

### Styling
- Modify `src/app/globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Custom CSS animations defined in globals.css

### Content Updates
- Personal information in the hero section
- Project descriptions and links
- Social media links in the sidebar

##  Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected for Next.js)
3. Deploy with automatic HTTPS and global CDN

### Manual Deployment
```bash
npm run build
npm run start
```

##  Contact

- **Email**: [kirubel.mulat@gmail.com](mailto:kirubel.mulat@gmail.com)
- **GitHub**: [@sentrisentri](https://github.com/sentrisentri)
- **Twitter/X**: [@sentrisentri](https://x.com/sentrisentri)

##  License

This project is open source and available under the [MIT License](LICENSE).

##  Acknowledgments

- Design inspiration from modern portfolio websites
- Built with the amazing Next.js and Tailwind CSS communities
- Icons and assets from various open source projects

---

