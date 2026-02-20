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
import AdminPanel from './pages/AdminPanel';
import AdvancedSettings from './pages/AdvancedSettings';
import Assistant from './pages/Assistant';
import Athkar from './pages/Athkar';
import Bookmarks from './pages/Bookmarks';
import Calligraphy from './pages/Calligraphy';
import Channels from './pages/Channels';
import Community from './pages/Community';
import DeleteAccount from './pages/DeleteAccount';
import Ibtihaalat from './pages/Ibtihaalat';
import Library from './pages/Library';
import Messages from './pages/Messages';
import Muathin from './pages/Muathin';
import NotificationSettings from './pages/NotificationSettings';
import PrayerTimes from './pages/PrayerTimes';
import Profile from './pages/Profile';
import Quran from './pages/Quran';
import QuranRadio from './pages/QuranRadio';
import Ramadan from './pages/Ramadan';
import Reciters from './pages/Reciters';
import Rewards from './pages/Rewards';
import ShareLibrary from './pages/ShareLibrary';
import StaticPageView from './pages/StaticPageView';
import SurahView from './pages/SurahView';
import Tawasheeh from './pages/Tawasheeh';
import TestingDashboard from './pages/TestingDashboard';
import Tilawa from './pages/Tilawa';
import ZekrDashboard from './pages/ZekrDashboard';
import OfflineDownloads from './pages/OfflineDownloads';
import MyPlaylists from './pages/MyPlaylists';
import PlaylistEditor from './pages/PlaylistEditor';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminPanel": AdminPanel,
    "AdvancedSettings": AdvancedSettings,
    "Assistant": Assistant,
    "Athkar": Athkar,
    "Bookmarks": Bookmarks,
    "Calligraphy": Calligraphy,
    "Channels": Channels,
    "Community": Community,
    "DeleteAccount": DeleteAccount,
    "Ibtihaalat": Ibtihaalat,
    "Library": Library,
    "Messages": Messages,
    "Muathin": Muathin,
    "NotificationSettings": NotificationSettings,
    "PrayerTimes": PrayerTimes,
    "Profile": Profile,
    "Quran": Quran,
    "QuranRadio": QuranRadio,
    "Ramadan": Ramadan,
    "Reciters": Reciters,
    "Rewards": Rewards,
    "ShareLibrary": ShareLibrary,
    "StaticPageView": StaticPageView,
    "SurahView": SurahView,
    "Tawasheeh": Tawasheeh,
    "TestingDashboard": TestingDashboard,
    "Tilawa": Tilawa,
    "ZekrDashboard": ZekrDashboard,
    "OfflineDownloads": OfflineDownloads,
    "MyPlaylists": MyPlaylists,
    "PlaylistEditor": PlaylistEditor,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};