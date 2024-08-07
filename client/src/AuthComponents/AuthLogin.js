import React, { createContext, useEffect, useState} from 'react';
import axios from 'axios';
const APPI_URL=process.env.REACT_APP_APPI_URL

export const AuthLoginInfo = createContext({});
export function AuthLogin(props) {
  const [user, setUser] = useState();
  useEffect(() => {
    axios.get(`${APPI_URL}/user`, { withCredentials: true}).then(res => {
      setUser(res.data)
    }).catch(error => {
      console.error('Login error:', error);
    });
  }, []);
  return (
    <AuthLoginInfo.Provider value={user}>{props.children}</AuthLoginInfo.Provider>
  )
}
