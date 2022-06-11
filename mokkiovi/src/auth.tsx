import React, { useMemo } from 'react';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

type CreateTokenResponse = {
  access_token: string;
  token_type: string;
  name: string;
};

interface AuthContextType {
  user: any;
  signin: (credentials: CredentialResponse) => void;
  signout: () => void;
  loadTokenFromStorage: () => string | null;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const signin = async (credentials: CredentialResponse) => {
    const payload = { id_token: credentials.credential };
    try {
      const { data } = await axios.post<CreateTokenResponse>(
        'http://localhost:7071/token/google',
        payload
      );
      localStorage.setItem('token', data.access_token);
      setUser(jwt_decode(data.access_token));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
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
