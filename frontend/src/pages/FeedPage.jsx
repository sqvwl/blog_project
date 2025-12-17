import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { AppContext } from '../AppContext.jsx';

function FeedPage() {
    const { d } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('posts');
    const [newComment, setNewComment] = useState({});

    const currentUserId = localStorage.getItem('userId');

    const styles = {
        container: { maxWidth: '800px', margin: '0 auto', padding: '20px' },
        searchContainer: { display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' },
        search: { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-color)' },
        toggleBtn: { padding: '10px 15px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer', background: 'var(--card-bg)', color: '#007bff', fontWeight: '500' },
        activeToggle: { background: '#007bff', color: '#fff' },
        card: { background: 'var(--card-bg)', borderRadius: '15px', padding: '25px', marginBottom: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #444' },
        author: { color: '#007bff', fontWeight: 'bold', fontSize: '15px', marginBottom: '10px', display: 'block' },
        postTitle: { fontSize: '22px', color: 'var(--text-color)', margin: '10px 0' },
        postContent: { color: 'var(--text-color)', opacity: 0.8, lineHeight: '1.6', fontSize: '16px' },
        actions: { display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '15px' },
        likeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-color)' },
        deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ff4d4f', marginLeft: '10px' },
        favBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', marginLeft: 'auto' },
        commentSection: { marginTop: '20px', paddingTop: '15px' },
        commentBubble: { display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' },
        avatar: { width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0, color: '#333' },
        bubbleContent: { background: 'rgba(150, 150, 150, 0.1)', padding: '10px 15px', borderRadius: '18px', fontSize: '14px', maxWidth: '85%', color: 'var(--text-color)' },
        commentUser: { fontWeight: 'bold', display: 'block', marginBottom: '2px' },
        inputWrapper: { display: 'flex', gap: '10px', marginTop: '20px' },
        commentInput: { flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #444', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-color)' },
        sendBtn: { background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }
    };

    useEffect(() => {
        loadData();
    }, [search, searchType]);

    const loadData = async () => {
        try {
            if (searchType === 'posts') {
                const res = await api.get('/posts/');
                const filtered = res.data.filter(p =>
                    p.title.toLowerCase().includes(search.toLowerCase()) ||
                    p.content.toLowerCase().includes(search.toLowerCase())
                );
                setPosts(filtered);
                setUsers([]);
            } else {
                const res = await api.get(`/users/search/?q=${search}`);
                setUsers(res.data);
                setPosts([]);
            }
        } catch (e) { console.log(e); }
    };

    const handleLike = async (postId) => {
        if (!currentUserId) return;
        try {
            await api.post(`/posts/${postId}/like?user_id=${currentUserId}`);
            loadData();
        } catch (e) { console.log(e); }
    };

    const handleFavorite = async (postId) => {
        if (!currentUserId) {
            alert("Войдите, чтобы сохранять посты!");
            return;
        }
        try {
            const res = await api.post(`/posts/${postId}/favorite?user_id=${currentUserId}`);

            if (res.data.status === "added") {
                alert("Добавлено в избранное! 🔖");
            } else {
                alert("Удалено из избранного");
            }
        } catch (e) {
            console.error(e);
            alert("Ошибка при сохранении");
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("?")) return;
        try {
            await api.delete(`/posts/${postId}?user_id=${currentUserId}`);
            loadData();
        } catch (e) { console.log(e); }
    };

    const handleAddComment = async (postId) => {
        if (!currentUserId || !newComment[postId]?.trim()) return;
        try {
            await api.post('/comments/', {
                post_id: postId,
                user_id: parseInt(currentUserId),
                text: newComment[postId]
            });
            setNewComment({ ...newComment, [postId]: '' });
            loadData();
        } catch (e) { console.log(e); }
    };

    const getAvatarColor = (login) => {
        const colors = ['#BBDEFB', '#C8E6C9', '#FFECB3', '#F8BBD0', '#D1C4E9'];
        return colors[login.length % colors.length];
    };

    return (
        <div style={styles.container}>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder={d.search}
                    style={styles.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    style={{...styles.toggleBtn, ...(searchType === 'users' ? styles.activeToggle : {})}}
                    onClick={() => setSearchType(searchType === 'posts' ? 'users' : 'posts')}
                >
                    {searchType === 'posts' ? d.posts : d.people}
                </button>
            </div>

            {searchType === 'users' ? (
                <div>
                    {users.map(user => (
                        <div key={user.id} style={styles.card}>
                            <span style={styles.author}>@{user.login}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {posts.map(post => (
                        <div key={post.id} style={styles.card}>
                            <div style={styles.author}>@{post.author_login}</div>
                            <h3 style={styles.postTitle}>{post.title}</h3>
                            <p style={styles.postContent}>{post.content}</p>

                            <div style={styles.actions}>
                                <button style={styles.likeBtn} onClick={() => handleLike(post.id)}>
                                    ❤️ {post.likes_count || 0}
                                </button>
                                <span style={styles.likeBtn}>💬 {post.comments?.length || 0}</span>

                                {parseInt(currentUserId) === post.author_id && (
                                    <button style={styles.deleteBtn} onClick={() => handleDelete(post.id)}>🗑️</button>
                                )}

                                <button
                                    style={styles.favBtn}
                                    onClick={() => handleFavorite(post.id)}
                                >
                                    🔖
                                </button>
                            </div>

                            <div style={styles.commentSection}>
                                {post.comments?.map(c => (
                                    <div key={c.id} style={styles.commentBubble}>
                                        <div style={{...styles.avatar, background: getAvatarColor(c.user_login)}}>
                                            {c.user_login[0].toUpperCase()}
                                        </div>
                                        <div style={styles.bubbleContent}>
                                            <span style={styles.commentUser}>{c.user_login}</span>
                                            <span>{c.text}</span>
                                        </div>
                                    </div>
                                ))}

                                <div style={styles.inputWrapper}>
                                    <input
                                        style={styles.commentInput}
                                        value={newComment[post.id] || ''}
                                        onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                    />
                                    <button style={styles.sendBtn} onClick={() => handleAddComment(post.id)}>
                                        {d.send}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FeedPage;