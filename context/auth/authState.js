import React, { useReducer} from 'react';
import authContext from './authContext';
import authReducer from './authReducer';
import {REGISTRO_EXITOSO, REGISTRO_ERROR, LIMPIAR_ALERTA} from '../../types';

import clienteAxios from '../../config/axios';
const AuthState = ({children}) => {

    //state inicial
    const initialState = {
        token: '',
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

    //Usuario autenticado
    const usuarioAutenticado = nombre => {
        dispatch({
            type: USUARIO_AUTENTICADO,
            payload: nombre
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
                usuarioAutenticado,
            }}
        >
            {children}
        </authContext.Provider>
     );
}
 
export default AuthState;
