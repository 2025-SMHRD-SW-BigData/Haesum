import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/mainpage.css'
import BottomNav from '../page/BottomNav'

const hospitalData = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19],
];

const MainPage = () => {
    // 화살표 버튼 클릭 시 화면 전환
    const [page, setPage] = useState(0);

    const nextPage = () => {
        if (page < hospitalData.length - 1) setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    // 진료과목 클릭 시 색상 전환
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelect = (num) => {
        setSelectedItems(prev =>
            prev.includes(num)
                ? prev.filter(item => item !== num)
                : [...prev, num]
        );
    };

    return (
        <>
            <div className='container'>
                <div className='header'>
                    <img src="./src/images/logo.png" alt="해숨로고" className='logo' />
                </div>
                {/* 선택한 진료과목 보기 */}
                <div className='hospital-list-container'>
                    <h4>나에게 맞는 진료과목 보기<img src="./src/images/hospital.png" alt="병원아이콘" /></h4>
                    <div className='button'>
                        <img src="./src/images/left-arrow.png" alt="왼쪽화살표" className='left-button' onClick={prevPage} />
                        <img src="./src/images/right-arrow.png" alt="오른쪽화살표" className='right-button' onClick={nextPage} />
                    </div>
                    {hospitalData.map((list, index) => (
                        <ul
                            className="hospital-list"
                            key={index}
                            style={{ display: index === page ? 'flex' : 'none' }}
                        >
                            {list.map(num => (
                                <li
                                    key={num}
                                    onClick={() => toggleSelect(num)}
                                    style={{
                                        backgroundColor: selectedItems.includes(num) ? '#00B0F8' : '#fff',  // 배경색
                                        color: selectedItems.includes(num) ? '#fff' : '#000',  // 글자색
                                        borderColor: selectedItems.includes(num) ? '#00B0F8' : '#e0e0e0' // border색
                                    }}
                                >
                                    {num}
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
                {/* 건강정보 영상 보기 */}
                <div className='youtube'>
                    <h4>요즘 뜨는 건강정보 영상 보기<img src="./src/images/youtube.png" alt="유튜브아이콘" /></h4>
                    <div className='youtube-listbox'>
                        <div>
                            <ul>
                                <li><a href="#">해녀들이 걸리는 잠수병? 숨병? 그게 대체 뭔데?</a></li>
                                <li><a href="#">폭삭 속았수다 숨병 해녀잠수병 "What's Haenyeo..."</a></li>
                                <li><a href="#">#잠수병#영화바다호랑이#염혜란숨병#잠수...</a></li>
                            </ul>
                            <div className='more'>
                                <a href="#">
                                    인기 영상 전체 보러가기 ▶
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />

        </>
    )
}

export default MainPage