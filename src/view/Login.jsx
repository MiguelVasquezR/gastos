import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const firebaseConfig = {
        apiKey: "AIzaSyDPa0jopCkHN3dWZTpcne_fEZsapx70ArE",
        authDomain: "gastos-64d22.firebaseapp.com",
        projectId: "gastos-64d22",
        storageBucket: "gastos-64d22.appspot.com",
        messagingSenderId: "39013284474",
        appId: "1:39013284474:web:f661ba0e5183d28072d9c3",
        measurementId: "G-DSXZQSSQ9B"
      };
    const app = initializeApp(firebaseConfig);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            email,
            password
        }

        console.log(data);
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                if(user){
                    localStorage.setItem('user', JSON.stringify(user));
                    navigate('/')
                }
            })
            .catch((error) => {
                // Maneja el error si el inicio de sesión falla
                const errorCode = error.code;
                const errorMessage = error.message;
            });

    }

    return (
        <div className='bg-blue-500 w-screen h-screen flex justify-center items-center'>
            <form onSubmit={handleSubmit} className='bg-white w-[80%] h-[400px] flex flex-col justify-center items-center gap-5 rounded-md shadow-md'>
                <h2>Iniciar sesión</h2>
                <div className="w-[90%]">
                    <label>Usuario:</label>
                    <input
                        className='w-[90%] border-b-[1px] border-solid border-[#000] p-1'
                        placeholder='Usuario'
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='w-[90%]'>
                    <label>Contraseña:</label>
                    <input
                        className='w-[90%] border-b-[1px] border-solid border-[#000] p-1'
                        placeholder='Contraseña'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='bg-blue-500 text-white p-3 rounded-sm' type="submit">Iniciar sesión</button>
                {error && <div>{error}</div>}
            </form>
        </div>
    );
};

export default Login;
