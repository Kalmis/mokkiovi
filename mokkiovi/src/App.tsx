import React,  { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import { createTheme, ThemeProvider, GlobalStyles } from '@mui/material';
import { useAuth } from './auth';
import Login from './pages/login';
import FrontPage from './pages/frontPage';


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


function App() {
  const theme = createTheme()
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline/>
      <GlobalStyles
          styles={{
            body: { backgroundColor },
          }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <FrontPage />
              </RequireAuth>
            }
          />
          <Route path="login" element={<Login setBackgroundColor={setBackgroundColor}/>} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
