import React, { useMemo } from 'react';
import type { CredentialResponse } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { TestLogin, GoogleToken } from './openapi';
import MokkioviService from './openapi/Mokkiovi';

type User = {
  sub: string;
  given_name: string;
  family_name: string;
  picture_url: string | undefined;
  role: string;
}

interface AuthContextType {
  user: User | undefined;
  token: string;
  signin: (credentials: CredentialResponse) => void;
  siginTest: (username: string) => void;
  signout: () => void;
  loadTokenFromStorage: () => string | null;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [token, setToken] = React.useState<string>('')

  const signin = async (credentials: CredentialResponse) => {
    // FIXME
    const idToken = credentials.credential || ''
    const payload: GoogleToken = { id_token: idToken };
    const data = await MokkioviService.default.loginForAccessTokenWithGoogleTokenGooglePost(payload)
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token)
    setUser(jwt_decode(data.access_token));
  };

  /**
   * Method for logging in with only username in test environment
   * To be used in PR Preview environments where google sign in
   * cannot be used due to ever changing redirect URL
   * @param username The username which is configured on backend for test use
   */
  const siginTest = async (username: string) => {
    const payload: TestLogin = { username };
    const data = await MokkioviService.default.loginForAccessTokenWithTestUserTokenTestPost(payload)
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token)
    setUser(jwt_decode(data.access_token));
  };

  const signout = () => {
    localStorage.clear();
    setToken('')
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
      token,
      signin,
      siginTest,
      signout,
      loadTokenFromStorage,
    }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
