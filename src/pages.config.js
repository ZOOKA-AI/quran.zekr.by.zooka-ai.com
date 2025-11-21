import Quran from './pages/Quran';
import SurahView from './pages/SurahView';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Quran": Quran,
    "SurahView": SurahView,
    "Bookmarks": Bookmarks,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Quran",
    Pages: PAGES,
    Layout: __Layout,
};