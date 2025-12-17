import React, { useState, useContext } from 'react';
import api from '../api/axios.jsx';
import { AppContext } from '../AppContext.jsx';

function ProfilePage() {
    const { d } = useContext(AppContext);
    const [login, setLogin] = useState(localStorage.getItem('userLogin') || '');
    const [isEditing, setIsEditing] = useState(false);
    const userId = localStorage.getItem('userId');

    const styles = {
        container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
        card: {
            background: 'var(--card-bg)', padding: '40px', borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px',
            border: '1px solid var(--border-color)', color: 'var(--text-color)'
        },
        avatar: {
            width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#007bff',
            color: 'white', fontSize: '32px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px auto', fontWeight: 'bold'
        },
        loginText: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
        input: {
            width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)',
            marginBottom: '15px', textAlign: 'center', background: 'var(--input-bg)', color: 'var(--text-color)'
        },
        btnEdit: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #007bff', background: 'none', color: '#007bff', cursor: 'pointer' },
        btnSave: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#28a745', color: 'white', cursor: 'pointer' }
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/users/${userId}`, { login });
            localStorage.setItem('userLogin', response.data.login);
            setIsEditing(false);
            alert("OK!");
        } catch (err) { alert("Error"); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.avatar}>{login[0]?.toUpperCase()}</div>
                {isEditing ? (
                    <>
                        <input style={styles.input} value={login} onChange={e => setLogin(e.target.value)} />
                        <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                            <button style={styles.btnSave} onClick={handleUpdate}>{d.save}</button>
                            <button style={{...styles.btnEdit, color: '#888', borderColor: '#888'}} onClick={() => setIsEditing(false)}>X</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={styles.loginText}>{login}</div>
                        <p style={{opacity: 0.6, marginBottom: '20px'}}>Пользователь MyBlog</p>
                        <button style={styles.btnEdit} onClick={() => setIsEditing(true)}>{d.profile}</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;