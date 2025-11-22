import Quran from './pages/Quran';
import SurahView from './pages/SurahView';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import PrayerTimes from './pages/PrayerTimes';
import Assistant from './pages/Assistant';
import Reciters from './pages/Reciters';
import Calligraphy from './pages/Calligraphy';
import Notifications from './pages/Notifications';
import NotificationDocs from './pages/NotificationDocs';
import NotificationSettings from './pages/NotificationSettings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Quran": Quran,
    "SurahView": SurahView,
    "Bookmarks": Bookmarks,
    "Profile": Profile,
    "PrayerTimes": PrayerTimes,
    "Assistant": Assistant,
    "Reciters": Reciters,
    "Calligraphy": Calligraphy,
    "Notifications": Notifications,
    "NotificationDocs": NotificationDocs,
    "NotificationSettings": NotificationSettings,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};