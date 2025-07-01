import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/start.css'

const Start = () => {
    const [selectedItems, setSelectedItems] = useState([])

    const symptoms = [
        '시야 흐림, 빛 번짐',
        '눈물 많음, 눈 충혈, 가려움',
        '귀 통증, 귀 먹먹함',
        '귀에서 삐~(이명)',
        '기침, 가래',
        '숨찰 때 있음, 가슴 답답',
        '손발 저림, 저릿함',
        '허리·무릎·어깨 결림, 통증',
        '자주 어지럽고 깜빡 잘 잊음',
        '피부 가렵고 건조, 갈라짐',
        '햇볕에 피부 검게 변함',
        '속 더부룩, 소화 잘 안됨',
        '변비/설사 자주',
        '소변 자주 보고, 따갑고 잔뇨감',
        '전체 보기'
    ]

    const toggleSelect = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item))
        } else {
            setSelectedItems([...selectedItems, item])
        }
    }

    return (
        <div className='Start_container'>
            <h1>요즘 어디가 불편하신가요?</h1>
            <p>해녀님께 필요한 병원 정보를 빠르게 찾아드려요.</p>
            <div className='Start_hospital-list-container'>
                <ul className='Start_hospital-list'>
                    {symptoms.map((item, index) => (
                        <li
                            key={index}
                            className={selectedItems.includes(item) ? 'active' : ''}
                            onClick={() => toggleSelect(item)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='Start_next'>
                <a href="#">다음</a>
            </div>
        </div>
    )
}

export default Start
