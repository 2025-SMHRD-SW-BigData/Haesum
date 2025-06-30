import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/start.css'


const hospitalData = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19],
];

const Start = () => {

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
                <h1>요즘 어디가 불편하신가요?</h1>
                <p>해녀님께 필요한 병원 정보를 빠르게 찾아드려요.</p>
                <div className='hospital-list-container'>
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
                <div className='next'><a href="#">다음</a></div>
            </div>
        </>
    )
}

export default Start