import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/start.css'

// 프론트에 미리 증상명-아이디 매핑 필요 (서버 DB와 동일)
const symptomMap = {
    '시야 흐림, 빛 번짐': 1,
    '눈물 많음, 눈 충혈, 가려움': 2,
    '귀 통증, 귀 먹먹함': 3,
    '귀에서 삐~(이명)': 4,
    '기침, 가래': 5,
    '숨찰 때 있음, 가슴 답답': 6,
    '손발 저림, 저릿함': 7,
    '허리·무릎·어깨 결림, 통증': 8,
    '자주 어지럽고 깜빡 잘 잊음': 9,
    '피부 가렵고 건조, 갈라짐': 10,
    '햇볕에 피부 검게 변함': 11,
    '속 더부룩, 소화 잘 안됨': 12,
    '변비/설사 자주': 13,
    '소변 자주 보고, 따갑고 잔뇨감': 14,
    '전체 보기': 0,
}

const symptoms = Object.keys(symptomMap)

const Start = ({ isLoggedIn, loggedInUserId }) => {
    const [selectedItems, setSelectedItems] = useState([])
    const navigate = useNavigate()

    // 🚀 페이지 mount 시 sessionStorage에서 복원
    useEffect(() => {
        const saved = sessionStorage.getItem('selectedSymptoms')
        if (saved) {
            setSelectedItems(JSON.parse(saved))
        }
    }, [])

    // 🚀 selectedItems 변경 시 sessionStorage 저장
    useEffect(() => {
        sessionStorage.setItem('selectedSymptoms', JSON.stringify(selectedItems))
    }, [selectedItems])

    // 🚀 로그인 후 서버에서 사용자 증상 불러오기
    useEffect(() => {
        if (isLoggedIn && loggedInUserId) {
            axios.get(`/api/user/symptoms/${loggedInUserId}`)
                .then(res => {
                    if (res.data.symptoms) {
                        const names = res.data.symptoms.map(id =>
                            Object.entries(symptomMap).find(([, val]) => val === id)?.[0]
                        ).filter(Boolean)
                        setSelectedItems(names)
                    }
                })
                .catch(console.error)
        }
    }, [isLoggedIn, loggedInUserId])

    const toggleSelect = async (item) => {
        let newSelected
        if (selectedItems.includes(item)) newSelected = selectedItems.filter(i => i !== item)
        else newSelected = [...selectedItems, item]

        setSelectedItems(newSelected)

        if (isLoggedIn) {
            try {
                const symptomIds = newSelected.map(name => symptomMap[name]).filter(id => id !== undefined && id !== 0)
                await axios.post('/api/user/symptoms', {
                    userId: loggedInUserId,
                    symptomIds,
                })
                console.log('서버에 저장된 증상 ID들:', symptomIds)
            } catch (error) {
                console.error('증상 저장 실패:', error)
            }
        }
    }

    const goNext = () => {
        navigate('/map', { state: { selectedSymptoms: selectedItems } })
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
                <a onClick={goNext}>다음</a>
            </div>
        </div>
    )
}

export default Start
