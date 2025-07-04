// App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Join from './page/Join';
import Login from './page/Login';
import MainPage from './page/MainPage';
import Map from './page/Map';
import MyPage from './page/MyPage';
import Start from './page/Start';
import Bookmark from './page/Bookmark';
import Community from './page/Community';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mypage" element={<MyPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/start" element={<Start isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Bookmark" element={<Bookmark isLoggedIn={isLoggedIn} />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </div>
  );
};

export default App;
