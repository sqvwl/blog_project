import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'ru');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        localStorage.setItem('lang', lang);
        localStorage.setItem('theme', theme);
        

        const root = window.document.documentElement;
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.style.setProperty('--bg-color', isDark ? '#121212' : '#f9fafb');
        root.style.setProperty('--card-bg', isDark ? '#1e1e1e' : '#ffffff');
        root.style.setProperty('--text-color', isDark ? '#f0f0f0' : '#333333');
        root.style.setProperty('--border-color', isDark ? '#333333' : '#eeeeee');
        root.style.setProperty('--input-bg', isDark ? '#2a2a2a' : '#ffffff');
    }, [lang, theme]);

    const t = {
        ru: { feed: "Лента", favs: "Избранное", create: "Создать пост", profile: "Профиль", login: "Войти", logout: "Выйти", search: "Поиск...", posts: "Посты", people: "Люди", send: "Отправить", reg: "Регистрация", title: "Заголовок", content: "Контент", save: "Сохранить", empty: "Здесь пока что ничего нет!" },
        en: { feed: "Feed", favs: "Favorites", create: "Create Post", profile: "Profile", login: "Login", logout: "Logout", search: "Search...", posts: "Posts", people: "People", send: "Send", reg: "Registration", title: "Title", content: "Content", save: "Save", empty: "There is nothing here yet!" }
    };

    return (
        <AppContext.Provider value={{ lang, setLang, theme, setTheme, d: t[lang] }}>
            {children}
        </AppContext.Provider>
    );
};