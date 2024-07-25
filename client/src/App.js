import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Orders from './Pages/Orders';
import OrderPage from './Pages/OrderPage';
import Clients from './Pages/Clients';
import ClientPage from './Pages/ClientPage';
import CalendarEvents from './Pages/CalendarEvents';
import AdminPanel from './Pages/AdminPanel';
import PrivateRoute  from './AuthComponents/PrivateRoute';
import LoginRoute  from './AuthComponents/LoginRoute';
import AdminRoute  from './AuthComponents/AdminRoute';
import Sidebar from './Components/Sidebar';
import Run from './Pages/RunTest';
import { AuthLoginInfo }  from './AuthComponents/AuthLogin';
import TestCase from './Pages/TestCase';
import Progress from './Pages/Progress';
import Instances from './Pages/Instances';
import Business from './Pages/Business';
import Customers from './Pages/Customers';
import Env from './Pages/Env';

function App() {
    const ctx = useContext(AuthLoginInfo);
    console.log(ctx)
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
              <Route path='/job' element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  } />
                <Route path='/job/:orderId' element={
                    <PrivateRoute>
                      <OrderPage />
                    </PrivateRoute>
                  } />
                <Route path='/customerdetails' element={
                    <PrivateRoute>
                      <Clients />
                    </PrivateRoute>
                  } />
                <Route path='/clients/:clientId' element={
                    <PrivateRoute>
                      <ClientPage />
                    </PrivateRoute>
                  } />
                <Route path='/customers' element={
                    <PrivateRoute>
                      <Customers />
                    </PrivateRoute>
                  } />
                <Route path='/adminPannel' element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
              <Route path='/login' element={
                  <LoginRoute>
                    <Login />
                  </LoginRoute>
                } />
                <Route path='/run' element={
                  <PrivateRoute>
                    <Run/>
                  </PrivateRoute>
                }/>
                <Route path='/testcase' element={
                  <PrivateRoute>
                    <TestCase/>
                  </PrivateRoute>
                }/>
                
                <Route path='/progress' element={
                  <PrivateRoute>
                    <Progress/>
                  </PrivateRoute>
                }/>
              
              <Route path='/instances' element={
                  <PrivateRoute>
                    <Instances/>
                  </PrivateRoute>
                }/>

              <Route path='/business' element={
                  <PrivateRoute>
                    <Business/>
                  </PrivateRoute>
                }/>


            <Route path='/customers' element={
                  <PrivateRoute>
                    <Customers/>
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
