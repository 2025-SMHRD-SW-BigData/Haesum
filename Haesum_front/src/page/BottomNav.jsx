import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../css/bottomnav.css'

const BottomNav = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <div className='BottomNav_nav'>
            <a 
                className='BottomNav_home'
                onClick={() => navigate('/mainpage')}
            >
                <img src="./src/images/home.png" alt="홈" />
            </a>
            <ul>
                <li onClick={() => navigate('/map')}>
                    <a>
                        <img
                            src={
                                currentPath === '/map'
                                    ? './src/images/map-2.png'
                                    : './src/images/map.png'
                            }
                            alt="지도"
                        /><br />지도검색
                    </a>
                </li>
                <li onClick={() => navigate('/mypage')}>
                    <a>
                        <img
                            src={
                                currentPath === '/mypage'
                                    ? './src/images/user-2.png'
                                    : './src/images/user.png'
                            }
                            alt="마이페이지"
                        /><br />마이페이지
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default BottomNav
