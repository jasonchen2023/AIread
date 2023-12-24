import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PdfSummaryPage, ReadingWrapper } from './pdfSummary/pdfSummaryPage';
import FallBack from './fallback';
import Home from './homePage/home';
import { auth } from '../services/firebase';
import Landing from './landing/landing';
import Profile from './profile/profile';
// import TextSummaryPage from './textSummary/textSummaryPage';

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/demo/:id" element={<ReadingWrapper />} />
          </Routes>
        </BrowserRouter>
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
          <Route path="/reading/:id" element={<ReadingWrapper />} />
          {/* <Route path="/textsummary" element={<TextSummaryPage />} /> */}
          <Route path="*" element={<FallBack />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>

  );
}
