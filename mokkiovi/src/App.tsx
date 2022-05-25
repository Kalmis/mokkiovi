import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import mokkioviAuthProvider from './auth';

import logo from './logo.svg';
import './App.css';

interface AuthContextType {
  user: any;
  signin: (credentials: CredentialResponse, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const signin = (credentials: CredentialResponse, callback: VoidFunction) =>
    mokkioviAuthProvider.signin(() => {
      setUser(credentials);
      callback();
    });

  const signout = (callback: VoidFunction) =>
    mokkioviAuthProvider.signout(() => {
      setUser(null);
      callback();
    });

  const value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return React.useContext(AuthContext);
}

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

  const from = location.state?.from?.pathname || '/';

  return (
    <div className="Login">
      <GoogleOAuthProvider clientId="264927455960-l6oe17fmcga9hbck8u5vmjkdr3rpt97i.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            auth.signin(credentialResponse, () => {
              // Send them back to the page they tried to visit when they were
              // redirected to the login page. Use { replace: true } so we don't create
              // another entry in the history stack for the login page.  This means that
              // when they get to the protected page and click the back button, they
              // won't end up back on the login page, which is also really nice for the
              // user experience.
              navigate(from, { replace: true });
            });
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
      </GoogleOAuthProvider>
    </div>
  );
}

function DefaultApp() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit
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
