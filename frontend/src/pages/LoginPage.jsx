import React, { useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { AppContext } from '../AppContext.jsx';

function LoginPage() {
    const { d } = useContext(AppContext);
    const [form, setForm] = useState({ login: '', password: '' });

    const styles = {
        wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' },
        card: {
            background: 'var(--card-bg)', padding: '40px', borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px',
            border: '1px solid var(--border-color)', color: 'var(--text-color)'
        },
        input: {
            width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px',
            border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', boxSizing: 'border-box'
        },
        button: {
            width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px'
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/token', { email: "t@t.com", login: form.login, password: form.password });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('userLogin', form.login);
            localStorage.setItem('userId', res.data.user_id);
            window.location.href = '/';
        } catch (err) { alert("Error"); }
    };

    return (
        <div style={styles.wrapper}>
            <form style={styles.card} onSubmit={handleLogin}>
                <h2 style={{textAlign: 'center'}}>{d.login}</h2>
                <input style={styles.input} placeholder="Login" onChange={e => setForm({...form, login: e.target.value})} />
                <input style={styles.input} type="password" placeholder="Pass" onChange={e => setForm({...form, password: e.target.value})} />
                <button style={styles.button}>{d.login}</button>
            </form>
        </div>
    );
}

export default LoginPage;