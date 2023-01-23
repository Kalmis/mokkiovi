import React, { useMemo } from 'react';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

type User = {
  sub: string;
  given_name: string;
  family_name: string;
  picture_url: string | undefined;
  role: string;
}

type CreateTokenResponse = {
  access_token: string;
  token_type: string;
  given_name: string;
};

interface AuthContextType {
  user: User;
  signin: (credentials: CredentialResponse) => void;
  siginTest: (username: string) => void;
  signout: () => void;
  loadTokenFromStorage: () => string | null;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const signin = async (credentials: CredentialResponse) => {
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const payload = { id_token: credentials.credential };
    const { data } = await axios.post<CreateTokenResponse>(
      `${backendUrl}/token/google`,
      payload
    );
    localStorage.setItem('token', data.access_token);
    setUser(jwt_decode(data.access_token));
  };

  /**
   * Method for logging in with only username in test environment
   * To be used in PR Preview environments where google sign in
   * cannot be used due to ever changing redirect URL
   * @param username The username which is configured on backend for test use
   */
  const siginTest = async (username: string) => {
    const backendUrl =
      process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
    const payload = { username };
    const { data } = await axios.post<CreateTokenResponse>(
      `${backendUrl}/token/test`,
      payload
    );
    localStorage.setItem('token', data.access_token);
    setUser(jwt_decode(data.access_token));
  };

  const signout = () => {
    localStorage.clear();
    setUser(undefined);
  };

  const loadTokenFromStorage = () => {
    const storageToken = localStorage.getItem('token');
    if (storageToken) {
      setUser(jwt_decode(storageToken));
      return storageToken;
    }
    return null;
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signin,
      siginTest,
      signout,
      loadTokenFromStorage,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
