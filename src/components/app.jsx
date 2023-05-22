import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Routes, Route,
} from 'react-router-dom';
import Reading from './reading';
import FallBack from './fallback';
import Home from './home';
import { auth } from '../firebase';
import Landing from './landing/landing';

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
    return <Landing />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reading/:id" element={<Reading />} />
        <Route path="*" element={<FallBack />} />
      </Routes>
    </BrowserRouter>
  );
}
