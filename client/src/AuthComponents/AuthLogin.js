import React, { createContext, useEffect, useState} from 'react';
import axios from 'axios';

export const AuthLoginInfo = createContext({});
export function AuthLogin(props) {
  const [user, setUser] = useState();
  useEffect(() => {

  
    axios.get("http://localhost:5000/user", { withCredentials: true}).then(res => {
      console.log(res)
      // const data = JSON.parse(res.data)
      // console.log(data)
      setUser(res.data)
      
    }).catch(error => {
      console.error('Login error:', error);
    });
  }, []);
  return (
    <AuthLoginInfo.Provider value={user}>{props.children}</AuthLoginInfo.Provider>
  )
}
