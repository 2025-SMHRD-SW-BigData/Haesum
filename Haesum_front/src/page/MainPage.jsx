import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom'
import axios from 'axios'
import '../css/mainpage.css'
import BottomNav from '../page/BottomNav'

const rawHospitalList = [
  { name: '이비인후과', icon: 'ear' },
  { name: '정형외과', icon: 'born' },
  { name: '내과', icon: 'stomach' },
  { name: '가정의학과', icon: 'healthcare' },
  { name: '피부과', icon: 'skin' },
  { name: '안과', icon: 'eye' },
  { name: '외과', icon: 'operation' },
  { name: '정신건강의학과', icon: 'mentality' },
  { name: '비뇨기과', icon: 'bladder' },
  { name: '재활의학과', icon: 'rehabilitation' },
  { name: '산부인과', icon: 'obstetrics' },
  { name: '한방', icon: 'oriental' },
  { name: '마취통증의학과', icon: 'syringe' },
  { name: '영상의학과', icon: 'mri' },
  { name: '결핵과', icon: 'lung' },
  { name: '응급의학과', icon: 'emergency' },
  { name: '신경과', icon: 'brain_1' },
  { name: '신경외과', icon: 'brain_2' },
  { name: '직업환경의학과', icon: 'stethoscope' },
  { name: '진단검사의학과', icon: 'experiment' },
  { name: '성형외과', icon: 'surgery' },
  { name: '소아청소년과', icon: 'baby' }
]

const symptomToDept = {
  '시야 흐림, 빛 번짐': ['안과'],
  '눈물 많음, 눈 충혈, 가려움': ['안과', '피부과'],
  '귀 통증, 귀 먹먹함': ['이비인후과'],
  '귀에서 삐~(이명)': ['이비인후과'],
  '기침, 가래': ['내과'],
  '숨찰 때 있음, 가슴 답답': ['내과'],
  '손발 저림, 저릿함': ['신경과'],
  '허리·무릎·어깨 결림, 통증': ['정형외과', '재활의학과'],
  '자주 어지럽고 깜빡 잘 잊음': ['신경과', '정신건강의학과'],
  '피부 가렵고 건조, 갈라짐': ['피부과'],
  '햇볕에 피부 검게 변함': ['피부과'],
  '속 더부룩, 소화 잘 안됨': ['내과'],
  '변비/설사 자주': ['내과'],
  '소변 자주 보고, 따갑고 잔뇨감': ['비뇨기과'],
  '전체 보기': []
}

const MainPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()

  const [page, setPage] = useState(0)
  const [filteredHospitals, setFilteredHospitals] = useState(rawHospitalList)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSymptoms, setUserSymptoms] = useState([])

  // 로그인 여부 확인 및 증상 정보 가져오기
  useEffect(() => {
    axios.get('http://localhost:3000/auth/user', { withCredentials: true })
      .then(res => {
        if (res.data.user && res.data.user.userId) {
          setIsLoggedIn(true)
          // 로그인 시 서버에서 증상 정보 받아오기
          axios.get('http://localhost:3000/api/user/symptoms', { withCredentials: true })
            .then(res2 => {
              setUserSymptoms(res2.data.symptoms || [])
            })
            .catch(() => setUserSymptoms([]))
        } else {
          setIsLoggedIn(false)
          setUserSymptoms([])
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
        setUserSymptoms([])
      })
  }, [])

  useEffect(() => {
    setPage(0)
  }, [navigationType, location.pathname])

  useEffect(() => {
    // 증상 선택 정보 우선순위: location.state > 로그인 사용자 증상 > 전체보기
    let symptoms = location.state?.selectedSymptoms || []

    if (!isLoggedIn) {
      // 비로그인 시 전체 증상(전체보기 포함)
      setFilteredHospitals(rawHospitalList)
      return
    }

    if (symptoms.length === 0 && userSymptoms.length > 0) {
      // 로그인 상태지만 location에 증상 없으면 DB에서 불러온 userSymptoms 사용
      symptoms = userSymptoms.map(id => {
        // symptomToDept 키 중 id와 매칭되는 증상명 찾기
        // symptomToDept는 증상명 => 진료과이므로 반대로 매핑 필요
        // 우선 간단히 symptomToDept 내에서 id와 같은 인덱스를 찾는 로직을 직접 구현해야 함
        // 증상 id는 숫자, symptomToDept key는 문자열이므로 아래와 같이 id에 대응하는 증상명을 찾는 맵 필요
        return Object.keys(symptomToDept).find(key => {
          // 임의로 id와 증상명 매핑을 원한다면 사전에 id-증상명 객체 필요
          // id 1 -> '시야 흐림, 빛 번짐' 등 정확히 매핑해서 쓰길 권장
          // 여기서는 id를 기준으로 정확한 증상명을 가져오려면 id-증상명 맵이 필요
          return false // 임시 false - 필요시 id-증상명 매핑 객체로 대체
        }) || null
      }).filter(Boolean)
    }

    if (!symptoms || symptoms.length === 0) {
      setFilteredHospitals(rawHospitalList)
      return
    }

    // location 또는 userSymptoms로 증상이 있으면 진료과 필터링
    const depts = symptoms.flatMap(symp => symptomToDept[symp] || [])
    const uniqueDepts = [...new Set(depts)]

    if (uniqueDepts.length === 0) {
      setFilteredHospitals(rawHospitalList)
      return
    }

    const filtered = rawHospitalList.filter(h => uniqueDepts.includes(h.name))
    setFilteredHospitals(filtered)
  }, [location.state?.selectedSymptoms, userSymptoms, isLoggedIn])

  const nextPage = () =>
    page < Math.ceil(filteredHospitals.length / 4) - 1 && setPage(prev => prev + 1)
  const prevPage = () => page > 0 && setPage(prev => prev - 1)

  const goToMapWithDept = dept => {
    navigate('/map', { state: { selectedDepts: [dept] } })
  }

  const pageData = filteredHospitals.slice(page * 4, page * 4 + 4)

  return (
    <>
      <div className='MainPage_container'>
        <div className='MainPage_header'>
          <img src='./src/images/logo.png' alt='해숨로고' className='MainPage_logo' />
        </div>

        <div className='MainPage_hospital-list-container'>
          <h4>
            나에게 맞는 진료과목 보기
            <img src='./src/images/hospital.png' alt='병원아이콘' />
          </h4>

          <div className='MainPage_button'>
            <img src='./src/images/left-arrow.png' alt='왼쪽화살표' onClick={prevPage} />
            <img src='./src/images/right-arrow.png' alt='오른쪽화살표' onClick={nextPage} />
          </div>

          <ul className='MainPage_hospital-list' style={{ display: 'flex' }}>
            {pageData.map((item, i) => (
              <li
                key={i}
                onClick={() => goToMapWithDept(item.name)}
                style={{ cursor: 'pointer', borderColor: '#e0e0e0' }}
              >
                <img
                  src={`./src/images/medicalDepartment/${item.icon}.png`}
                  alt={item.name}
                  onError={e => {
                    console.warn(`이미지 로딩 실패: ${item.icon}`)
                    e.target.style.display = 'none'
                  }}
                />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className='MainPage_youtube'>
          <h4>
            요즘 뜨는 건강정보 영상 보기
            <img src='./src/images/youtube.png' alt='유튜브아이콘' />
          </h4>
          <div className='MainPage_youtube-listbox'>
            <div>
              <ul>
                <li>
                  <a href='#'>해녀들이 걸리는 잠수병? 숨병? 그게 대체 뭔데?</a>
                </li>
                <li>
                  <a href='#'>폭삭 속았수다 숨병 해녀잠수병 "What's Haenyeo..."</a>
                </li>
                <li>
                  <a href='#'>#잠수병#영화바다호랑이#염혜란숨병#잠수...</a>
                </li>
              </ul>
              <div className='MainPage_more'>
                <a href='#'>인기 영상 전체 보러가기 ▶</a>
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
