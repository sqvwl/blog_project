import React, { useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext.jsx';

function CreatePostPage() {
    const { d } = useContext(AppContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const styles = {
        container: { maxWidth: '700px', margin: '40px auto' },
        card: {
            background: 'var(--card-bg)', padding: '30px', borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', color: 'var(--text-color)'
        },
        input: {
            width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px',
            border: '1px solid var(--border-color)', fontSize: '18px', fontWeight: 'bold',
            outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-color)'
        },
        textarea: {
            width: '100%', padding: '15px', minHeight: '200px', borderRadius: '10px',
            border: '1px solid var(--border-color)', fontSize: '16px', outline: 'none',
            boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-color)', resize: 'vertical'
        },
        button: {
            width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/posts/', { author_id: parseInt(localStorage.getItem('userId')), title, content });
            navigate('/');
        } catch (err) { alert("Error"); }
    };

    return (
        <div style={styles.container}>
            <form style={styles.card} onSubmit={handleSubmit}>
                <h2 style={{marginBottom: '20px'}}>{d.create}</h2>
                <input style={styles.input} placeholder={d.title} onChange={e => setTitle(e.target.value)} required />
                <textarea style={styles.textarea} placeholder={d.content} onChange={e => setContent(e.target.value)} required />
                <button style={styles.button} type="submit">{d.send}</button>
            </form>
        </div>
    );
}

export default CreatePostPage;