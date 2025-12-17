import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { AppContext } from '../AppContext.jsx';

function FavoritesPage() {
    const { d } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (currentUserId) {
            api.get(`/users/${currentUserId}/favorites`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setPosts(res.data);
                    }
                })
                .catch(err => console.error("Ошибка загрузки избранного:", err));
        }
    }, [currentUserId]);

    const styles = {
        container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
        title: { color: 'var(--text-color)', marginBottom: '25px', fontSize: '28px' },
        emptyText: { color: 'var(--text-color)', opacity: 0.6, textAlign: 'center', marginTop: '50px', fontSize: '18px' },
        card: {
            background: 'var(--card-bg)',
            padding: '25px',
            borderRadius: '15px',
            marginBottom: '25px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            color: 'var(--text-color)'
        },
        author: { color: '#007bff', fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', display: 'block' },
        postTitle: { fontSize: '22px', margin: '10px 0' },
        postContent: { opacity: 0.8, lineHeight: '1.6', fontSize: '16px' },
        date: { opacity: 0.4, fontSize: '12px', marginTop: '15px', display: 'block' }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🔖 {d.favs}</h2>

            {posts.length === 0 ? (
                <p style={styles.emptyText}>{d.empty}</p>
            ) : (
                <div>
                    {posts.map(post => (
                        <div key={post.id} style={styles.card}>
                            <span style={styles.author}>@{post.author_login}</span>
                            <h3 style={styles.postTitle}>{post.title}</h3>
                            <p style={styles.postContent}>{post.content}</p>
                            <span style={styles.date}>
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;