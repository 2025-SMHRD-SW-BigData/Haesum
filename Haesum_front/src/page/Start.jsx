import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/start.css'
//asdasdasdasd
const hospitalData = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19],
];

const Start = () => {
    const [page, setPage] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const nextPage = () => {
        if (page < hospitalData.length - 1) setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    const toggleSelect = (num) => {
        setSelectedItems(prev =>
            prev.includes(num)
                ? prev.filter(item => item !== num)
                : [...prev, num]
        );
    };

    return (
        <>
            <div className='Start_container'>
                <h1>요즘 어디가 불편하신가요?</h1>
                <p>해녀님께 필요한 병원 정보를 빠르게 찾아드려요.</p>
                <div className='Start_hospital-list-container'>
                    <div className='Start_button'>
                        <img src="./src/images/left-arrow.png" alt="왼쪽화살표" onClick={prevPage} />
                        <img src="./src/images/right-arrow.png" alt="오른쪽화살표" onClick={nextPage} />
                    </div>
                    {hospitalData.map((list, index) => (
                        <ul
                            className="Start_hospital-list"
                            key={index}
                            style={{ display: index === page ? 'flex' : 'none' }}
                        >
                            {list.map(num => (
                                <li
                                    key={num}
                                    onClick={() => toggleSelect(num)}
                                    style={{
                                        backgroundColor: selectedItems.includes(num) ? '#00B0F8' : '#fff',
                                        color: selectedItems.includes(num) ? '#fff' : '#000',
                                        borderColor: selectedItems.includes(num) ? '#00B0F8' : '#e0e0e0'
                                    }}
                                >
                                    {num}
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
                <div className='Start_next'>
                    <a href="#">다음</a>
                </div>
            </div>
        </>
    )
}

export default Start
