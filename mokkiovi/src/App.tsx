import React, { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';

import logo from './logo.svg';
import './App.css';

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function Login() {
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

function DefaultApp() {
  const auth = useAuth();
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Hello {auth.user.name}
        <code>src/App.tsx</code> and save to reload! ;
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <DefaultApp />
              </RequireAuth>
            }
          />
          <Route path="login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
