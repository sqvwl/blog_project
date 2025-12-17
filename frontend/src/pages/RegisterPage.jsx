import React, { useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext.jsx';

function RegisterPage() {
    const { d } = useContext(AppContext);
    const [form, setForm] = useState({email: '', login: '', password: ''});
    const navigate = useNavigate();

    const styles = {
        wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' },
        card: {
            background: 'var(--card-bg)', padding: '40px', borderRadius: '15px',
            width: '100%', maxWidth: '380px', border: '1px solid var(--border-color)', color: 'var(--text-color)'
        },
        input: {
            width: '100%', padding: '12px', margin: '10px 0', borderRadius: '10px',
            border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-color)', boxSizing: 'border-box'
        },
        button: {
            width: '100%', padding: '14px', backgroundColor: '#28a745', color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold'
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/', form);
            navigate('/login');
        } catch (err) { alert("Error"); }
    };

    return (
        <div style={styles.wrapper}>
            <form style={styles.card} onSubmit={handleRegister}>
                <h2 style={{textAlign: 'center'}}>{d.reg}</h2>
                <input style={styles.input} type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
                <input style={styles.input} placeholder="Login" onChange={e => setForm({...form, login: e.target.value})} />
                <input style={styles.input} type="password" placeholder="Pass" onChange={e => setForm({...form, password: e.target.value})} />
                <button style={styles.button}>{d.reg}</button>
            </form>
        </div>
    );
}

export default RegisterPage;