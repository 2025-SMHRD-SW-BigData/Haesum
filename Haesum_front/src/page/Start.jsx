// 클라이언트: src/page/Start.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/start.css'

axios.defaults.withCredentials = true

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

const idToSymptom = Object.fromEntries(
  Object.entries(symptomMap).map(([k, v]) => [v, k])
)
const symptoms = Object.keys(symptomMap)

const Start = ({ isLoggedIn, setIsLoggedIn }) => {
  const [selectedItems, setSelectedItems] = useState([])
  const [userId, setUserId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setUserId(user.userId)
      setIsLoggedIn(true)
    } else {
      axios
        .get('http://localhost:3000/auth/user', { withCredentials: true })
        .then(res => {
          if (res.data.user && res.data.user.userId) {
            setUserId(res.data.user.userId)
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
            setIsLoggedIn(true)
          } else {
            setUserId(null)
            setIsLoggedIn(false)
          }
        })
        .catch(() => {
          setUserId(null)
          setIsLoggedIn(false)
        })
    }
  }, [setIsLoggedIn])

  useEffect(() => {
    if (!userId) {
      setSelectedItems([])
      return
    }
    axios
      .get('http://localhost:3000/api/user/symptoms', { withCredentials: true })
      .then(res => {
        console.log('📌 GET /symptoms 응답:', res.data)
        const ids = res.data.symptoms || []
        const names = ids.map(id => idToSymptom[id]).filter(Boolean)
        setSelectedItems(names)
      })
      .catch(err => {
        console.log('🔥 GET /symptoms 실패:', err)
        setSelectedItems([])
      })
  }, [userId])

  const saveSymptomsToServer = async symptomIds => {
    console.log('📌 POST /symptoms 요청:', symptomIds)
    await axios.post(
      'http://localhost:3000/api/user/symptoms',
      { symptomIds },
      { withCredentials: true }
    )
  }

  const toggleSelect = item => {
    if (item === '전체 보기') {
      setSelectedItems(['전체 보기'])
    } else {
      setSelectedItems(prev =>
        prev.includes(item)
          ? prev.filter(i => i !== item)
          : [...prev.filter(i => i !== '전체 보기'), item]
      )
    }
  }

  const handleNext = async () => {
    if (!userId) {
      alert('로그인 후 이용 가능합니다.')
      return
    }
    const symptomIds = selectedItems
      .map(name => symptomMap[name])
      .filter(id => id !== undefined && id !== 0)
    try {
      await saveSymptomsToServer(symptomIds)
      navigate('/map', { state: { selectedSymptoms: selectedItems } })
    } catch {
      alert('증상 저장 실패. 다시 시도해 주세요.')
    }
  }

  return (
    <div className="Start_container">
      <h1>요즘 어디가 불편하신가요?</h1>
      <p>해녀님께 필요한 병원 정보를 빠르게 찾아드려요.</p>
      <div className="Start_hospital-list-container">
        <ul className="Start_hospital-list">
          {symptoms.map((item, idx) => (
            <li
              key={idx}
              className={selectedItems.includes(item) ? 'active' : ''}
              onClick={() => toggleSelect(item)}
              role="button"
              tabIndex={0}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') toggleSelect(item)
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="Start_next">
        <a href="#" onClick={e => { e.preventDefault(); handleNext() }}>
          다음
        </a>
      </div>
    </div>
  )
}

export default Start
