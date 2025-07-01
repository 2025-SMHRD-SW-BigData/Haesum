import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/bookmark.css'
import BottomNav from '../page/BottomNav'

const Bookmark = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className='Bookmark_container'>
                <div className='Bookmark_header'>
                    <a
                        href="#"
                        className='Login_back'
                        onClick={e => {
                            e.preventDefault()
                            navigate('/mypage')
                        }}
                    >
                        <img src="./src/images/back.png" alt="뒤로가기" />
                    </a>
                    <img src="./src/images/logo.png" alt="해숨로고" className='Bookmark_logo' />
                </div>
                <h2>병원 즐겨찾기</h2>
            </div>
            <BottomNav />
        </>
    )
}

export default Bookmark