import Quran from './pages/Quran';
import SurahView from './pages/SurahView';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import PrayerTimes from './pages/PrayerTimes';
import Assistant from './pages/Assistant';
import Reciters from './pages/Reciters';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Quran": Quran,
    "SurahView": SurahView,
    "Bookmarks": Bookmarks,
    "Profile": Profile,
    "PrayerTimes": PrayerTimes,
    "Assistant": Assistant,
    "Reciters": Reciters,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};