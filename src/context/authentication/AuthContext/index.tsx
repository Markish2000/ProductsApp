import {createContext, useEffect, useReducer} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  LoginData,
  LoginResponse,
  RegisterData,
  Usuario,
} from '../../../interfaces/appInterfaces';

import {AuthState, authReducer} from '../authReducer';

import instance from '../../../api/cafeApi';

type AuthContextProps = {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  removeError: () => void;
  signUp: (registerData: RegisterData) => void;
  signIn: (LoginData: LoginData) => void;
  logOut: () => void;
};

const authInitialState: AuthState = {
  status: 'checking',
  errorMessage: '',
  token: null,
  user: null,
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return dispatch({type: 'notAuthenticated'});
    const resp = await instance.get('/auth');
    await AsyncStorage.setItem('token', resp.data.token);
    if (resp.status !== 200) {
      return dispatch({type: 'notAuthenticated'});
    }

    dispatch({
      type: 'signUp',
      payload: {
        token: resp.data.token,
        user: resp.data.usuario,
      },
    });
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await instance.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Información incorrecta',
      });
    }
  };

  const signUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const {data} = await instance.post<LoginResponse>('/usuarios', {
        correo,
        password,
        nombre,
      });
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario,
        },
      });
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Revise la información',
      });
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  const removeError = () => {
    dispatch({type: 'removeError'});
  };

  return (
    <AuthContext.Provider
      value={{...state, removeError, signUp, signIn, logOut}}>
      {children}
    </AuthContext.Provider>
  );
};
