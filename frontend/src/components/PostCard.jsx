import React from 'react';

const cardStyles = {
    card: {
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0'
    },
    author: { color: '#1890ff', fontWeight: 'bold' },
    title: { margin: '10px 0', fontSize: '1.5rem' },
    content: { color: '#555', lineHeight: '1.6' }
};

const PostCard = ({ post }) => (
    <div style={cardStyles.card}>
        <span style={cardStyles.author}>@{post.author_login || 'Аноним'}</span>
        <h2 style={cardStyles.title}>{post.title}</h2>
        <p style={cardStyles.content}>{post.content}</p>
        <small style={{color: '#ccc'}}>{new Date(post.created_at).toLocaleDateString()}</small>
    </div>
);

export default PostCard;