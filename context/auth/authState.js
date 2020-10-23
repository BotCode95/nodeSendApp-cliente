import React, { useReducer} from 'react';
import authContext from './authContext';
import authReducer from './authReducer';
import {REGISTRO_EXITOSO,
     REGISTRO_ERROR, 
     LIMPIAR_ALERTA, 
     LOGIN_ERROR, 
     LOGIN_EXITOSO,
     USUARIO_AUTENTICADO,
     CERRAR_SESION
} from '../../types';

import clienteAxios from '../../config/axios';
import tokenAuth from '../../config/tokenAuth'
const AuthState = ({children}) => {

    //state inicial
    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('get_token') : '',
        autenticado: null,
        usuario: null,
        mensaje: null
    }

    //definicion del reducer
    const [state, dispatch] = useReducer(authReducer, initialState);

    //registrar nuevos usuarios
    const registrarUsuario = async datos => {
        try {
            const respuesta = await clienteAxios.post('/api/usuarios', datos);
            dispatch({
                type: REGISTRO_EXITOSO,
                payload: respuesta.data.msg //respuesta que tengo en el backend 
            })
            
        } catch (error) {
            // console.log(error.response.data.msg);
            dispatch({
                type: REGISTRO_ERROR,
                payload: error.response.data.msg //respuesta que tengo en el backend 
            })
        }
        //limpiar alerta
        setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA
            })
        },3000);
    }


    //autenticar usuario
    const iniciarSesion = async datos => {
        try {
            const respuesta = await clienteAxios.post('/api/auth', datos);
            // console.log(respuesta)
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data.token
            })
        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }

         //limpiar alerta
         setTimeout(() => {
            dispatch({
                type: LIMPIAR_ALERTA
            })
        },3000);
    }

    //retornar el usuario autenticado en base a jwt
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('get_token');
        if(token){
            tokenAuth(token)
        }

        try {
            const respuesta = await clienteAxios.get('/api/auth');
            dispatch({
                type: USUARIO_AUTENTICADO,
                payload: respuesta.data.usuario
            })
        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }
    }

    //cerrar sesion
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        })
    }


    
    return ( 
        <authContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                registrarUsuario,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >
            {children}
        </authContext.Provider>
     );
}
 
export default AuthState;
