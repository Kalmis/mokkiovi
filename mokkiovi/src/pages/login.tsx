import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    auth.loadTokenFromStorage();
  });

  // @ts-ignore
  const from = location.state?.from?.pathname || '/';

  if (auth.user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="Login">
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
        <label htmlFor="usernameInput">
          <input
            name="username"
            id="usernameInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          username
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
