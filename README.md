# تطبيق القرآن الكريم - Quran Zekr App

> 🕌 تطبيق القرآن الكريم مجاني بالكامل لوجه الله تعالى - صدقة جارية

## 📖 Overview

A comprehensive Islamic Quran application built with React and Base44 SDK. This app provides a complete Quranic experience including reading, listening to recitations, prayer times, bookmarks, and AI-powered assistance.

## ✨ Features

### 📚 Quran Reading
- Read the complete Holy Quran with beautiful Arabic typography
- Browse all 114 Surahs with detailed information
- Search verses across the entire Quran
- Verse-by-verse navigation
- Multiple Tafsir (interpretation) options for comparison
- Sabab Al-Nuzool (reasons for revelation)
- Related verses discovery

### 🎧 Audio Recitation
- Listen to Quranic recitations from renowned Qaris
- Multiple reciters available:
  - خالد الجليل (Khalid Al-Jaleel)
  - إسلام صبحي (Islam Sobhi)
  - محمد محمود الطبلاوي (Al-Tablawi)
  - محمود خليل الحصري (Al-Husary)
  - محمد صديق المنشاوي (Al-Minshawi)
  - عبد الباسط عبد الصمد (Abdul Basit)
  - عبد الرحمن السديس (Al-Sudais)
  - مشاري راشد العفاسي (Mishary Alafasy)
- Continuous playback and verse synchronization
- Custom range selection for recitation

### 🔖 Bookmarks & Notes
- Save favorite verses for quick access
- Add personal notes and reflections
- Organize bookmarks by category
- Quick navigation to saved verses

### 🕌 Prayer Times
- Accurate prayer times based on location
- Multiple calculation methods
- Prayer notifications and reminders

### 🎨 Islamic Calligraphy
- View beautiful Islamic calligraphy artwork
- High-quality designs and verses

### 🤖 AI Assistant
- Intelligent Quranic knowledge assistant
- Ask questions about verses, interpretations, and Islamic knowledge
- Get contextual answers based on authentic sources

### 📲 Notifications & Reminders
- Daily Quran reading reminders
- Ayah of the day notifications
- Customizable notification settings
- Documentation for notification integration

### 👤 User Profile
- Personalized reading progress tracking
- Custom preferences and settings
- Reading statistics and achievements

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Base44 account for backend integration

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ZOOKA-AI/quran.zekr.by.zooka-ai.com.git
cd quran.zekr.by.zooka-ai.com
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with your Base44 credentials:
```env
VITE_BASE44_API_KEY=your_api_key_here
VITE_BASE44_APP_ID=your_app_id_here
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix linting issues
- `npm run typecheck` - Check TypeScript types

### Project Structure

```
src/
├── api/                    # API integration layer
│   ├── base44Client.js    # Base44 SDK client configuration
│   ├── entities.js        # Data entities and models
│   └── integrations.js    # Third-party integrations
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── quran/            # Quran-specific components
│   └── notifications/    # Notification components
├── pages/                # Application pages/routes
│   ├── Quran.jsx         # Main Quran browser
│   ├── SurahView.jsx     # Individual Surah view
│   ├── RecitationPlayer.jsx  # Audio player
│   ├── Bookmarks.jsx     # Saved bookmarks
│   ├── PrayerTimes.jsx   # Prayer times
│   ├── Assistant.jsx     # AI assistant
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── AuthContext.jsx   # Authentication context
│   ├── query-client.js   # React Query setup
│   └── utils.js          # Helper functions
├── utils/                # Additional utilities
├── App.jsx               # Main application component
├── Layout.jsx            # App layout wrapper
└── pages.config.js       # Page routing configuration
```

### Technology Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 6.1
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM 6
- **Authentication**: Base44 SDK
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner + React Hot Toast

## 🔌 API Integration

This app uses the Base44 SDK for backend integration. The SDK provides:

- User authentication and authorization
- Data persistence and synchronization
- Cloud storage for bookmarks and preferences
- Analytics and usage tracking
- Push notification infrastructure

### Base44 Configuration

The app is configured via `vite.config.js` with the Base44 Vite plugin:

```javascript
import { defineConfig } from 'vite'
import base44 from '@base44/vite-plugin'

export default defineConfig({
  plugins: [
    base44({
      // Your Base44 configuration
    })
  ]
})
```

## 🎨 Customization

### Themes

The app supports light and dark themes using `next-themes`. Theme switching is available through the UI settings.

### Adding New Pages

1. Create your page component in `src/pages/`
2. Import it in `src/pages.config.js`
3. Add it to the PAGES object
4. The page will automatically be added to the routing

Example:
```javascript
import NewPage from './pages/NewPage';

export const PAGES = {
  // ... existing pages
  "NewPage": NewPage,
}
```

## 📱 PWA Support

The app includes Progressive Web App (PWA) capabilities:
- Installable on mobile and desktop
- Offline functionality
- App manifest configuration
- Service worker support

## 🤝 Contributing

Contributions are welcome! This is a sadaqah jariyah (ongoing charity) project.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created as a free Islamic resource for the Muslim community worldwide.

## 🤲 Du'a (Prayer)

May Allah accept this as a sadaqah jariyah and benefit Muslims around the world. Please share this app with others to spread the reward.

> "Whoever guides someone to goodness will have a reward like one who did it." - Prophet Muhammad ﷺ

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: ZOOKA-AI Team

## 🌟 Acknowledgments

- Quran text and translations from authentic sources
- Audio recitations from EveryAyah.com
- Islamic calligraphy from various artists
- Built with Base44 platform
- UI components from shadcn/ui and Radix UI

---

**اللَّهُمَّ انْفَعْنَا بِمَا عَلَّمْتَنَا**

*O Allah, benefit us with what You have taught us*
