import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Join from './page/Join'
import Login from './page/Login'
import MainPage from './page/MainPage'
import Map from './page/Map'
import MyPage from './page/MyPage'
import Start from './page/Start'

const App = () => {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/join' element={<Join />} />
        <Route path='/login' element={<Login />} />
        <Route path='/map' element={<Map />} />
        <Route path='/mypage' element={<MyPage />} />
        <Route path='/start' element={<Start />} />
      </Routes>
    </div>
  )
}

export default App
