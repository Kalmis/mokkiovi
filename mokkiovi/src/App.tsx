import React,  { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import { createTheme, ThemeProvider, GlobalStyles, Container } from '@mui/material';
import { useAuth } from './auth';
import  MainAppBar  from './components/appBar';
import LoginPage from './pages/loginPage';
import FrontPage from './pages/frontPage';
import FeedPage from './pages/feedPage';
import SettingsPage from './pages/settingsPage';
import HowToPage from './pages/howToPage';


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

function ProtectedPageWithMenu({ children }: { children: JSX.Element }) {

  return (
    <RequireAuth>
      <Container>
        <MainAppBar/>
        {children}
      </Container>
    </RequireAuth>
  )
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
              <ProtectedPageWithMenu>
                <FrontPage />
              </ProtectedPageWithMenu>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedPageWithMenu>
                <FeedPage />
              </ProtectedPageWithMenu>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedPageWithMenu>
                <SettingsPage />
              </ProtectedPageWithMenu>
            }
          />
          <Route
            path="/how-to"
            element={
              <ProtectedPageWithMenu>
                <HowToPage />
              </ProtectedPageWithMenu>
            }
          />
          <Route path="login" element={<LoginPage setBackgroundColor={setBackgroundColor}/>} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
