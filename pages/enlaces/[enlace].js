import React, {useState, useContext} from 'react';
import Layout from '../../components/Layout';
import Alerta from '../../components/Alerta';
import clienteAxios from '../../config/axios'
import appContext from '../../context/app/appContext';

export async function getServerSideProps({params}) {
    const {enlace} = params; 

    const resultado = await clienteAxios.get(`/api/enlaces/${enlace}`);

    return {
        props: {
            enlace: resultado.data
        }
    }
}

export async function getServerSidePaths() {
    //obtengo todos los enlaces de la bd
    const enlaces = await clienteAxios.get('/api/enlaces');
    
    return {
        //path -> [urls]
        paths: enlaces.data.enlaces.map(enlace => ({
            params: {enlace : enlace.url}
        })),
        fallback: false
    }
}

export default ({enlace}) => {

    //context de la app
    const AppContext= useContext(appContext);
    const {mostrarAlerta, mensaje_archivo} = AppContext;

    const [tienePassword, setTienePassword] = useState(enlace.password);
    const [password, setPassword] = useState('');
    const [archivoEnlace, setArchivoEnlace] = useState(enlace.archivo);

    const verificarPassword = async e => {
        e.preventDefault();

        const data = {
            password
        }

        try {
            const resultado =  await clienteAxios.post(`/api/enlaces/${enlace.enlace}`, data);
            setTienePassword(resultado.data.password)
             //Aquí obtenemos el archivo a descargar
            setArchivoEnlace(resultado.data.archivo);
        } catch (error) {
            mostrarAlerta(error.response.data.msg);
        }
        
    }
  
    return (
        <Layout>
            {/* Comprobar si tiene password */}
            {
                tienePassword ? (
                        <>
                            <p className="text-center">Ingrese la contraseña para descargar el enlace</p>
                            {mensaje_archivo && <Alerta/>}
                            <div className="flex justify-center mt-5">
                                <div className="w-full max-w-lg">
                                        <form
                                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                                            onSubmit={e => verificarPassword(e)}
                                        >
                                        <div className="mb-4">
                                        <label 
                                            className="block text-black text-sm font-bold mb-2"
                                            htmlFor="password"
                                        >Contraseña</label>
                                        <input
                                            type="password"
                                            className="shadow appereance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus: shadow-outline"
                                            id="password"
                                            placeholder="Contraseña Enlace"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                        </div>
                                        <input
                                            type="submit"
                                            className="bg-red-500 hover:bg-gray-900 w-full p-2 text-white font-bold uppercase"
                                            value="Validar Contraseña"
                                        />
                                        </form>
                                </div>
                            </div>
                        </>
                ) : (
                    <>
                        <h1 className="text-4xl text-center text-gray-700">Descarga tu archivo:</h1>
                        <div className=" flex items-center justify-center mt-10">
                            <a href={`${process.env.backendURL}/api/archivos/${archivoEnlace}`} 
                            className="bg-red-500 text-center px-10 py-3 rounded uppercase font-bold text-white cursor-pointer"
                            >Aquí</a>
                        </div>
                    </>
                )
            }
           
        </Layout>
    )
}