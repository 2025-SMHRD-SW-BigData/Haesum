import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/mypage.css'
import BottomNav from '../page/BottomNav'

const MyPage = () => {
    const [isChecklistHover, setIsChecklistHover] = useState(false)
    const [isSaveHover, setIsSaveHover] = useState(false)
    const navigate = useNavigate()

    return (
        <>
            <div className='MyPage_container'>
                <div className='MyPage_header'>
                    <img src="./src/images/logo.png" alt="해숨로고" className='MyPage_logo' />
                </div>
                <h2>마이페이지</h2>

                <div className='MyPage_login'>
                    <p>로그인 해주세요.</p>
                    <div>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                navigate('/login')
                            }}
                        >
                            로그인
                        </a>
                    </div>
                </div>

                <div className='MyPage_save-container'>
                    <div className='MyPage_checklist'>
                        <a
                            href="#"
                            onMouseEnter={() => setIsChecklistHover(true)}
                            onMouseLeave={() => setIsChecklistHover(false)}
                            onClick={e => {
                                e.preventDefault()
                                navigate('/start')
                            }}
                        >
                            <img
                                src={
                                    isChecklistHover
                                        ? './src/images/choice-2.png'
                                        : './src/images/choice.png'
                                }
                                alt="증상 선택"
                            />
                            <h6>증상 선택하러 가기</h6>
                        </a>
                    </div>

                    <div className='MyPage_save'>
                        <a
                            href="#"
                            onMouseEnter={() => setIsSaveHover(true)}
                            onMouseLeave={() => setIsSaveHover(false)}
                        >
                            <img
                                src={
                                    isSaveHover
                                        ? './src/images/save-2.png'
                                        : './src/images/save.png'
                                }
                                alt="저장"
                            />
                            <h6>병원 즐겨찾기</h6>
                        </a>
                    </div>
                </div>
            </div>

            <BottomNav />
        </>
    )
}

export default MyPage
