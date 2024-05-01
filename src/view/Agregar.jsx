import React, { useEffect, useRef, useState } from 'react';
import { CiUser } from "react-icons/ci";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar ref como storageRef
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";

const Agregar = () => {
    const date = new Date();
    const fecha = date.toISOString().split('T')[0];
    const navigate = useNavigate();

    useEffect(()=>{
        if(!localStorage.getItem('user')){
            navigate('/login');
        }
    }, [])

    const [concepto, setConcepto] = useState('');
    const [importe, setImporte] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const fileInputRef = useRef(null);
    const firebaseConfig = {
        apiKey: "AIzaSyDPa0jopCkHN3dWZTpcne_fEZsapx70ArE",
        authDomain: "gastos-64d22.firebaseapp.com",
        projectId: "gastos-64d22",
        storageBucket: "gastos-64d22.appspot.com",
        messagingSenderId: "39013284474",
        appId: "1:39013284474:web:f661ba0e5183d28072d9c3",
        measurementId: "G-DSXZQSSQ9B"
    };

    // Inicializa Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const database = getDatabase(firebaseApp);
    const storage = getStorage(firebaseApp);

    const handleTicket = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        const file = e.target.files[0];
        const storageRef1 = storageRef(storage, `images/${file.name}`);
        await uploadBytes(storageRef1, file);
        const url = await getDownloadURL(storageRef1);

        console.log(url);
        setImageUrl(url);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            fecha,
            concepto,
            importe,
            ticket: imageUrl ? imageUrl : "",
            email: JSON.parse(localStorage.getItem('user')).email
        }

        // Envía los datos a Firebase Realtime Database
        push(ref(database, 'gasto'), data)
            .then(() => {
                console.log("Datos enviados correctamente a Firebase");
                navigate("/")
            })
            .catch((error) => {
                console.error("Error al enviar datos a Firebase:", error);
            });
    }

    return (
        <>
            <section className='bg-blue-500 w-screen py-3 flex justify-end items-center'>
                <div className='rounded-full bg-white/80 w-[60px] h-[60px] mr-5 flex justify-center items-center'>
                    <CiUser size={50} color='black' />
                </div>
            </section>

            <div>
                <IoMdArrowBack size={40} className='m-5' onClick={()=>{navigate(-1)}} />
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-5 '>
                <fieldset className='my-5'>
                    <p className='text-center font-bold'>Si es necesario, puede agregar el ticket</p>
                    <div className='flex flex-col justify-center items-center'>
                        {
                            imageUrl && <img src={imageUrl} alt="Ticket" className='w-[150px] h-[150px] rounded-md object-cover' />
                        }
                        <input name="image" type="file" onChange={handleTicket} className='hidden' ref={fileInputRef} />
                        <button className="bg-blue-400 m-5 rounded-md text-white p-2" onClick={(e) => { e.preventDefault(); fileInputRef.current.click() }}>Agregar Ticket</button>
                    </div>
                </fieldset>
                <input className='border-b-[1px] border-solid border-[#000] w-[80%] p-1 text-center outline-none' type="date" value={fecha} readOnly />
                <input value={concepto} onChange={(e) => { setConcepto(e.target.value) }} className='border-b-[1px] border-solid border-[#000] w-[80%] p-1 outline-none' type="text" placeholder='Concepto' />
                <input value={importe} onChange={(e) => { setImporte(e.target.value) }} className='border-b-[1px] border-solid border-[#000] w-[80%] p-1 outline-none' type="number" placeholder='Importe' />
                <button type='submit' className='bg-blue-400 m-5 rounded-md text-white p-2'>Registrar</button>
            </form>
        </>
    )
}

export default Agregar;
