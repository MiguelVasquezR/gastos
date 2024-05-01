import React, { useState, useEffect } from 'react';
import { CiUser } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const Home = () => {
    const [gastos, setGastos] = useState([]);
    const navigate = useNavigate();
    const [verTicket, setVerTicket] = useState(false);
    const [gasto, setGasto] = useState(null);


    useEffect(() => {

        if (!localStorage.getItem('user')) {
            navigate('/login');
        }
        const fetchData = async () => {
            try {
                // Inicializa Firebase con tu configuración
                const firebaseConfig = {
                    apiKey: "AIzaSyDPa0jopCkHN3dWZTpcne_fEZsapx70ArE",
                    authDomain: "gastos-64d22.firebaseapp.com",
                    projectId: "gastos-64d22",
                    storageBucket: "gastos-64d22.appspot.com",
                    messagingSenderId: "39013284474",
                    appId: "1:39013284474:web:f661ba0e5183d28072d9c3",
                    measurementId: "G-DSXZQSSQ9B"
                };
                const firebaseApp = initializeApp(firebaseConfig);
                const database = getDatabase(firebaseApp);

                // Obtiene una referencia a la colección "gasto"
                const gastosRef = ref(database, 'gasto');

                // Escucha cambios en los datos de la base de datos
                onValue(gastosRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        // Convierte los datos en un array y actualiza el estado
                        const gastosArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
                        setGastos(gastosArray);
                    } else {
                        setGastos([]);
                    }
                });
            } catch (error) {
                console.error("Error al obtener datos de Firebase:", error);
            }
        };

        // Llama a la función para obtener los datos cuando el componente se monta
        fetchData();
    }, []);

    return (
        <div>
            <section className='bg-blue-500 w-screen py-3 flex justify-end items-center'>
                <div className='rounded-full bg-white/80 w-[60px] h-[60px] mr-5 flex justify-center items-center'>
                    <CiUser size={50} color='black' />
                </div>
            </section>

            <div className='flex justify-end items-center w-screen'>
                <button onClick={() => { navigate("/gastos") }} className='bg-blue-400 m-5 rounded-md text-white p-2'>Agregar Concepto</button>
            </div>

            {
                verTicket &&
                <div className='flex flex-col justify-center items-center mx-auto my-5'>
                    <p className='font-bold my-2'>Ticket de Venta</p>
                    <img src={gasto?.ticket} className='w-[150px] h-[150px]' alt='No hay Ticket' />
                </div>
            }

            <section className='w-[90%] mx-auto'>
                <h2 className='font-bold text-[20px]'>Tus gastos son</h2>
                <table className='w-full mt-5'>
                    <thead className='w-[100%]'>
                        <tr className='flex gap-5'>
                            <th className='w-[33%]'>Fecha</th>
                            <th className='w-[33%]'>Concepto</th>
                            <th className='w-[33%]'>Pago</th>
                        </tr>
                    </thead>
                    <tbody className='w-[100]'>
                        {gastos
                            .filter(gasto => gasto.email === JSON.parse(localStorage.getItem('user')).email)
                            .map(gasto => (
                                <tr onClick={() => { setGasto(gasto); setVerTicket(true) }} key={gasto.id} className='flex gap-5'>
                                    <td className='w-[33%] text-center'>{gasto.fecha}</td>
                                    <td className='w-[33%] text-center'>{gasto.concepto}</td>
                                    <td className='w-[33%] text-center'>{gasto.importe}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    )
}

export default Home;
