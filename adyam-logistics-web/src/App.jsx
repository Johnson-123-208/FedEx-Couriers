import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import TrackingInterface from './components/TrackingInterface';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Partners />
      <TrackingInterface />
    </div>
  );
}

export default App;
