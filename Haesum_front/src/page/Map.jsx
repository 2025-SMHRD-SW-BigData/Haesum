import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/map.css'
import BottomNav from '../page/BottomNav'

const Map = () => {
    // 검색기능
    const [inputValue, setInputValue] = useState('');

    // 진료과목 보기 기능
    const [showSubjectList, setShowSubjectList] = useState(false);

    // 진료과 버튼 hover 기능
    const [isHovered, setIsHovered] = useState(false);

    // 진료과 버튼 click 기능
    const [isActive, setIsActive] = useState(false);

    const handleClickSubject = () => {
        setShowSubjectList(true);
        setIsActive(true);
    };

    const handleClose = () => {
        setShowSubjectList(false);
        setIsActive(false); // hover 스타일 해제
    };
    return (
        <div>
            <div className='container'>
                {/* 로고 */}
                <div className='header'>
                    <img src="./src/images/logo.png" alt="해숨로고" className='logo' />
                </div>
                {/* 검색 */}
                <div className="search-bar">
                    <img src="./src/images/main-search.png" alt="검색" className="search-icon" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="질병, 진료과, 병원을 검색해보세요."
                    />
                </div>
                {/* 진료과목명 */}
                <div className={`subject-name ${isHovered || isActive ? 'active' : ''}`}
                    onClick={handleClickSubject}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    진료과 <img
                        src={(isHovered || isActive)
                            ? "./src/images/under direction-2.png"
                            : "./src/images/under direction.png"} alt="화살표" className={showSubjectList ? 'rotated' : ''} />
                </div>
                {/* 지도 */}
                <div className='map'>
                    {/* 지도api 넣기 */}
                </div>
                {showSubjectList && (
                    <div className="overlay" onClick={handleClose}></div>
                )}
                {/* 진료과목 리스트 */}
                <div className={`subject-name-list ${showSubjectList ? 'show' : ''}`}>
                    <div className='list-title'>
                        <h6>진료과목명</h6>
                        <img src="./src/images/close.png" alt="닫기" className='close' onClick={handleClose} />
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