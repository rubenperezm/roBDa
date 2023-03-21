import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axiosAuth from '../utils/axiosAuth'

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);


  const loadUser = async () => {
    try {
      const res = await axiosAuth.get('/api/account/user');
                  
      if (res.status === 200) {
          return res.data.user;
      } else {
          throw new Error('No se ha podido obtener el usuario');
      }
    }catch(err) {
        throw err
    }
  };
  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      const user = await loadUser()
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
      
    } catch (err) {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (username, password) => {
    const body = JSON.stringify({
      username,
      password
    });
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
      });
      
      if (res.status === 200){
        const user = await loadUser();
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user
        });
      }else{
        throw new Error('Usuario o contraseña incorrectos');
      }

    } catch (err) {
      throw err;
    }
    
  };

  const signUp = async (email, username, password, password2) => {
    const body = JSON.stringify({
      email,
      username,
      password,
      password2
    });

    try{
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: body
      });

      const data = await res.json();

      if (res.status === 201){
        await signIn(username, password)
      }else{
        throw data.error
      }
    }catch(err){
      throw err
    }
  };

  const signOut = async () => {
    try{
      const res = await axiosAuth.post('/api/account/logout');
      dispatch({
        type: HANDLERS.SIGN_OUT
      });
    }catch(err){
      console.error(err)
    }
    
    
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
