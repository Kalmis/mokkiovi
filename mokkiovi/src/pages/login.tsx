import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import './login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Button  from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';

import { useAuth } from '../auth';

export default function Login(props: {setBackgroundColor: Dispatch<SetStateAction<string>>}) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [username, setUsername] = useState('');
  const { setBackgroundColor } = props;

  useEffect(() => {
    auth.loadTokenFromStorage();
    // Well, this is one way to do it get rid of the global style background color, but it feels just... Wrong.
    setBackgroundColor('transparent')
  });

  // @ts-ignore
  const from = location.state?.from?.pathname || '/';

  if (auth.user) {
    return <Navigate to={from} replace />;
  }

  return (
    // Override the global theme background
    <Container className="Login">
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
      >
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            await auth.signin(credentialResponse);
            navigate(from, { replace: true });
          }}
          onError={() => {}}
          useOneTap
        />
      </GoogleOAuthProvider>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await auth.siginTest(username);
          navigate(from, { replace: true });
        }}
      >
        <TextField required id='username' label='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <Button variant="contained" type="submit" endIcon={<LoginIcon/>}>Log in</Button>
      </form>
    </Container>
  );
}
