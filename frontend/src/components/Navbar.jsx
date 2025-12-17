import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext.jsx';

function Navbar() {
    const navigate = useNavigate();
    const { lang, setLang, theme, setTheme, d } = useContext(AppContext);

    const token = localStorage.getItem('token');
    const userLogin = localStorage.getItem('userLogin');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const textColor = isDark ? '#e0e0e0' : '#333';
    const navBg = isDark ? '#2d2d2d' : '#fff';

    return (
        <nav style={{ ...styles.nav, background: navBg }}>
            <div style={{ ...styles.logo, color: textColor }} onClick={() => navigate('/')}>
                🚀 MyBlog
            </div>

            <div style={styles.links}>
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    style={{ ...styles.select, color: '#007bff' }}
                >
                    <option value="ru">RU</option>
                    <option value="en">EN</option>
                </select>

                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    style={{ ...styles.select, fontSize: '18px' }}
                >
                    <option value="light">☀️</option>
                    <option value="dark">🌙</option>
                    <option value="system">💻</option>
                </select>

                <Link style={{ ...styles.link, color: textColor }} to="/">{d.feed}</Link>

                {token ? (
                    <>
                        <Link style={{ ...styles.link, color: textColor }} to="/favorites">{d.favs}</Link>
                        <Link style={{ ...styles.link, color: textColor }} to="/create">{d.create}</Link>
                        <Link style={{ ...styles.link, color: textColor }} to="/profile">{d.profile} ({userLogin})</Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>{d.logout}</button>
                    </>
                ) : (
                    <>
                        <Link style={{ ...styles.link, color: textColor }} to="/login">{d.login}</Link>
                        <Link to="/register" style={styles.regBtn}>Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 50px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px',

        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        boxSizing: 'border-box',
        transition: '0.3s'
    },
    logo: { fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' },
    links: { display: 'flex', alignItems: 'center', gap: '15px' },
    link: { textDecoration: 'none', fontWeight: '500', fontSize: '15px' },
    select: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        outline: 'none',
        fontWeight: 'bold',
        padding: '5px'
    },
    regBtn: {
        textDecoration: 'none',
        color: '#fff',
        background: '#007bff',
        padding: '8px 18px',
        borderRadius: '20px',
        fontSize: '14px'
    },
    logoutBtn: {
        background: '#ff4d4f',
        color: '#fff',
        border: 'none',
        padding: '8px 18px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: '500'
    }
};

export default Navbar;