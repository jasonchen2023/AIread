import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route, Outlet,
} from 'react-router-dom';
import axios from 'axios';
import Nav from './nav';
import Login from './login';
import Reading from './reading';
import FallBack from './fallback';
import * as Constants from '../utils/constants';
import Home from './homePage/home';
import { auth } from '../firebase';
import Landing from './landing/landing';

export default function App(props) {
  const makeApiCall = async () => {
    const results = await axios.get(Constants.BASE_URL);
    console.log(results.data);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => {
      unsub();
    };
  }, []);

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reading/:id" element={<Reading />} />
            <Route path="*" element={<FallBack />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
}
