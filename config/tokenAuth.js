import clienteAxios from './axios';

const tokenAuth = token => {
    if(token) {
        //enviar el token al header
        clienteAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }else {
        delete clienteAxios.defaults.headers.common['Authorization'];
    }
}

export default tokenAuth;