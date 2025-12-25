import React from 'react';
import { auth } from '../configs/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Admin = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <p>Welcome to the admin panel.</p>
            <div>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Admin;