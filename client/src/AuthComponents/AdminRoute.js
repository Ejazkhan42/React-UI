import React, { useContext, useEffect } from 'react';
import { AuthLoginInfo } from './AuthLogin';
import { Navigate } from 'react-router-dom';
import './Styles/loadingPage.css';

function AdminRoute({ children }) {
  const user = useContext(AuthLoginInfo);
  console.log(user)
  if(user === undefined) {
    return (
      <div className="loading-page-wrapper">
        <div className="loading-page">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }
  return user?.Role_Id === 1 ? children : <Navigate to='/' /> ;

}
export default AdminRoute
