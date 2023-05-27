import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reading from './reading/reading';
import FallBack from './fallback';
import Home from './homePage/home';
import { auth } from '../services/firebase';
import Landing from './landing/landing';
import Profile from './profile/profile';

export default function App(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    return (
      <>
        <Landing />
        <ToastContainer position="top-center" />
      </>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reading/:id" element={<Reading />} />
          <Route path="*" element={<FallBack />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>

  );
}
