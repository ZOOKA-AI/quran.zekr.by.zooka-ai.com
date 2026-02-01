/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Assistant from './pages/Assistant';
import Athkar from './pages/Athkar';
import Bookmarks from './pages/Bookmarks';
import Calligraphy from './pages/Calligraphy';
import Community from './pages/Community';
import Library from './pages/Library';
import Messages from './pages/Messages';
import NotificationSettings from './pages/NotificationSettings';
import Orphans from './pages/Orphans';
import PrayerTimes from './pages/PrayerTimes';
import Profile from './pages/Profile';
import Quran from './pages/Quran';
import QuranRadio from './pages/QuranRadio';
import Ramadan from './pages/Ramadan';
import Reciters from './pages/Reciters';
import Rewards from './pages/Rewards';
import SurahView from './pages/SurahView';
import Tawasheeh from './pages/Tawasheeh';
import Tilawa from './pages/Tilawa';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Assistant": Assistant,
    "Athkar": Athkar,
    "Bookmarks": Bookmarks,
    "Calligraphy": Calligraphy,
    "Community": Community,
    "Library": Library,
    "Messages": Messages,
    "NotificationSettings": NotificationSettings,
    "Orphans": Orphans,
    "PrayerTimes": PrayerTimes,
    "Profile": Profile,
    "Quran": Quran,
    "QuranRadio": QuranRadio,
    "Ramadan": Ramadan,
    "Reciters": Reciters,
    "Rewards": Rewards,
    "SurahView": SurahView,
    "Tawasheeh": Tawasheeh,
    "Tilawa": Tilawa,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};