import '../styles/globals.css'
import React from 'react';
import AuthState from '../context/auth/authState';

function MyApp({ Component, pageProps }) {
  return (
    <AuthState>
      <Component {...pageProps} />
    </AuthState>

  )
}

export default MyApp
