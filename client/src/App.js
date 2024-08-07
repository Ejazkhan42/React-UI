import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Orders from './Pages/Orders';
import AdminPanel from './Pages/AdminPanel';
import PrivateRoute  from './AuthComponents/PrivateRoute';
import LoginRoute  from './AuthComponents/LoginRoute';
import AdminRoute  from './AuthComponents/AdminRoute';
import Sidebar from './Components/Sidebar';
import { AuthLoginInfo }  from './AuthComponents/AuthLogin';
import TestCase from './Pages/TestCase';
import Progress from './Pages/Progress';
import Instances from './Pages/Instances';
import Business from './Pages/Business';
import Customers from './Pages/Customers';
import Env from './Pages/Env';
import "./app.css";

function App() {
    const ctx = useContext(AuthLoginInfo);
    return (
      <BrowserRouter>
        <Sidebar>
          </Sidebar>
            <Routes>
              <Route path='/' exact element={
                  <PrivateRoute>
                    <Homepage />
                  </PrivateRoute>
                } />
              <Route path='/Modules' element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  } />

                <Route path='/customers' element={
                    <PrivateRoute>
                      <Customers />
                    </PrivateRoute>
                  } />
                <Route path='/AdminPanel' element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
              <Route path='/login' element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                } />
                <Route path='/Jobs' element={
                  <PrivateRoute>
                    <TestCase/>
                  </PrivateRoute>
                }/>
                
                <Route path='/Progress' element={
                  <PrivateRoute>
                    <Progress/>
                  </PrivateRoute>
                }/>
              
              <Route path='/instances' element={
                  <PrivateRoute>
                    <Instances/>
                  </PrivateRoute>
                }/>

              <Route path='/business/:path' element={
                  <PrivateRoute>
                    <Business/>
                  </PrivateRoute>
                }/>
                <Route path='/business/components/:path' element={
                  <PrivateRoute>
                    <Business/>
                  </PrivateRoute>
                }/>
            <Route path='/env' element={
                  <PrivateRoute>
                    <Env/>
                  </PrivateRoute>
                }/>
            </Routes>
      </BrowserRouter>
    );
}

export default App;
