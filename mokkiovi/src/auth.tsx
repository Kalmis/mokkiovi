import React, { useMemo } from 'react';
import type { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';

type CreateTokenResponse = {
  access_token: string;
  token_type: string;
  name: string;
};

interface AuthContextType {
  user: any;
  signin: (credentials: CredentialResponse) => void;
  signout: () => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  const signin = async (credentials: CredentialResponse) => {
    console.log(credentials);
    const payload = { id_token: credentials.credential };
    try {
      const { data } = await axios.post<CreateTokenResponse>(
        'http://localhost:7071/token/google',
        payload
      );
      setUser(data.name);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  const signout = () => {
    setUser(undefined);
  };
  const memoedValue = useMemo(
    () => ({
      user,
      signin,
      signout,
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
