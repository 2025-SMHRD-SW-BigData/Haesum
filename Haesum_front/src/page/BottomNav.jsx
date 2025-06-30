import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/bottomnav.css'

const BottomNav = () => {
    const [active, setActive] = useState('')
    const navigate = useNavigate()

    return (
        <div className='nav'>
            <a 
                className='home'
                onClick={() => {
                    setActive('')
                    navigate('/')  // 수정: /main -> /
                }}
            >
                <img src="./src/images/home.png" alt="홈" />
            </a>
            <ul>
                <li>
                    <a onClick={() => {
                        setActive('map')
                        navigate('/map')
                    }}>
                        <img src={
                            active === 'map'
                                ? './src/images/map-2.png'
                                : './src/images/map.png'
                        } alt="지도" /><br />지도검색
                    </a>
                </li>
                <li>
                    <a onClick={() => {
                        setActive('user')
                        navigate('/mypage')
                    }}>
                        <img src={
                            active === 'user'
                                ? './src/images/user-2.png'
                                : './src/images/user.png'
                        } alt="마이페이지" /><br />마이페이지
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default BottomNav
