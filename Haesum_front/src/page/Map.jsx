import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/map.css'
import BottomNav from '../page/BottomNav'

const Map = () => {
    const [inputValue, setInputValue] = useState('')
    const [showSubjectList, setShowSubjectList] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const handleClickSubject = () => {
        setShowSubjectList(true)
        setIsActive(true)
    }

    const handleClose = () => {
        setShowSubjectList(false)
        setIsActive(false)
    }

    return (
        <div>
            <div className='Map_container'>
                <div className='Map_header'>
                    <img src="./src/images/logo.png" alt="해숨로고" className='Map_logo' />
                </div>

                <div className="Map_search-bar">
                    <img src="./src/images/main-search.png" alt="검색" className="Map_search-icon" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="질병, 진료과, 병원을 검색해보세요."
                    />
                </div>

                <div className={`Map_subject-name ${isHovered || isActive ? 'active' : ''}`}
                    onClick={handleClickSubject}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    진료과 <img
                        src={(isHovered || isActive)
                            ? "./src/images/under direction-2.png"
                            : "./src/images/under direction.png"}
                        alt="화살표"
                        className={showSubjectList ? 'rotated' : ''}
                    />
                </div>

                <div className='Map_map'></div>

                {showSubjectList && (
                    <div className="Map_overlay" onClick={handleClose}></div>
                )}

                <div className={`Map_subject-name-list ${showSubjectList ? 'show' : ''}`}>
                    <div className='Map_list-title'>
                        <h6>진료과목명</h6>
                        <img src="./src/images/close.png" alt="닫기" onClick={handleClose} />
                    </div>
                    <ul>
                        <li><a href="#">전체보기</a></li>
                        <li><a href="#">가정의학과</a></li>
                        <li><a href="#">결핵과</a></li>
                        <li><a href="#">마취통증의학과</a></li>
                        <li><a href="#">비뇨기과</a></li>
                        <li><a href="#">소아청소년과</a></li>
                        <li><a href="#">신경과</a></li>
                        <li><a href="#">신경외과</a></li>
                        <li><a href="#">안과</a></li>
                        <li><a href="#">영상의학과</a></li>
                        <li><a href="#">외과</a></li>
                        <li><a href="#">응급의학과</a></li>
                        <li><a href="#">이비인후과</a></li>
                        <li><a href="#">재활의학과</a></li>
                        <li><a href="#">정형외과</a></li>
                        <li><a href="#">직업환경의학과</a></li>
                        <li><a href="#">피부과</a></li>
                        <li><a href="#">한방</a></li>
                        <li><a href="#">내과</a></li>
                    </ul>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}

export default Map
