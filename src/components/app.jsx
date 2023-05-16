import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Welcome from './welcome';
import About from './about';
import Test from './test';
import FallBack from './fallback';

export default function App(props) {
  return (
    <BrowserRouter>
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="*" element={<FallBack />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
