import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import FeedPage from './pages/FeedPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import { AppProvider } from './AppContext';

function App() {
    return (
        <AppProvider>
            <Router>
                <div style={{ background: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh', transition: '0.3s' }}>
                    <Navbar />
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '50px 20px 20px 20px' }}>
                        <Routes>
                            <Route path="/" element={<FeedPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/create" element={<CreatePostPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;