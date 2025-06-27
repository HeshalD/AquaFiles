import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';


function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Login/>}/>
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
