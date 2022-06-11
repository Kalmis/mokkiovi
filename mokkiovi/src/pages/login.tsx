import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

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
      <GoogleOAuthProvider clientId="264927455960-l6oe17fmcga9hbck8u5vmjkdr3rpt97i.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            await auth.signin(credentialResponse);
            navigate(from, { replace: true });
          }}
          onError={() => {}}
          useOneTap
        />
      </GoogleOAuthProvider>
    </div>
  );
}
