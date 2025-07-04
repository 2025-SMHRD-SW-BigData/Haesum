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

const symptomMap = {
  '시야 흐림, 빛 번짐': 1, '눈물 많음, 눈 충혈, 가려움': 2,
  '귀 통증, 귀 먹먹함': 3, '귀에서 삐~(이명)': 4,
  '기침, 가래': 5, '숨찰 때 있음, 가슴 답답': 6,
  '손발 저림, 저릿함': 7, '허리·무릎·어깨 결림, 통증': 8,
  '자주 어지럽고 깜빡 잘 잊음': 9, '피부 가렵고 건조, 갈라짐': 10,
  '햇볕에 피부 검게 변함': 11, '속 더부룩, 소화 잘 안됨': 12,
  '변비/설사 자주': 13, '소변 자주 보고, 따갑고 잔뇨감': 14,
  '전체 보기': 0
}
const idToSymptom = Object.fromEntries(
  Object.entries(symptomMap).map(([k, v]) => [v, k])
)

const youtubeVideosByDept = {
  '안과': [
    { title: '이 4가지만 지키셔도 백내장 걱정 없습니다. (#안과전문의)', url: 'https://www.youtube.com/watch?v=92aTiVVmGIk&t=310s' },
    { title: '백내장 예방이 가능한가요? #shorts (채널: 모의다)', url: 'https://www.youtube.com/shorts/t787smppbWE' },
    { title: '눈 영양제 말고 이거 드세요. 침침한 눈 번쩍뜨이는 눈건강 베스트 음식 5가지. (채널: 교육하는 의사! 이동환TV)', url: 'https://www.youtube.com/watch?v=6delw0CaLOM' }
  ],
  '이비인후과': [
    { title: '많은 분들이 호소하는 귀 먹먹함과 이관 기능이상에 대하여 (채널: 중앙이비인후과 TV)', url: 'http://www.youtube.com/watch?v=A-wgUqtMD3k' },
    { title: '귀먹먹함의 원인인 이관 기능장애, 검사방법부터 치료까지 알아보자 (채널: 여섯시의 진료실)', url: 'http://www.youtube.com/watch?v=2Ouxs904Gcw' },
    { title: '치료되는 이명과, 이명일 때 먹지말야 할 음식 5가지!(귀울림, 귀에서 삐소리) (채널: 연세신통TV)', url: 'http://www.youtube.com/watch?v=KAR43fDkUmM' }
  ],
  '내과': [
    { title: '기침을 멎게 하는 마법의 음료 만드는 법, 약 먹기 싫으면 대신 이거 드셔보세요. (채널: 이재성 박사의 식탁보감)', url: 'http://www.youtube.com/watch?v=kUc9aXXwZNk' },
    { title: '심장이 보내는 신호, 가슴통증[건강플러스] (채널: 서울아산병원)', url: 'http://www.youtube.com/watch?v=zNAA7ds73iY' },
    { title: '숨이 답답한 증상, 호흡곤란, 가슴 답답함, 3가지 원인과 해결법(숨쉬기 답답할때/힘들어요) (채널: 연세신통TV)', url: 'http://www.youtube.com/watch?v=0ej_Fd7v-Mc' }
  ],
  '신경과': [
    { title: '목디스크의 대표적인 증상들과 치료 방법에 대해 알아보자! [강북연세 TV] (채널: 강북연세병원)', url: 'http://www.youtube.com/watch?v=NcXlvObuuwI' },
    { title: '(통합본) 말초신경병증 치료의 핵심 원리 (채널: 올라tv)', url: 'http://www.youtube.com/watch?v=8Z-fyrydD8E' },
    { title: '손과 팔이 저릴 때 사각근을 풀어줘보세요, 목디스크에도 도움이 됩니다 (강남허준 박용환tv)', url: 'https://www.youtube.com/shorts/mV9HxGifrKM' }
  ],
  '정형외과': [
    { title: '퇴행성? 운동부족? 무릎부상? 무릎 통증의 원인 총정리 & 초간단 무릎 운동법! ft.퇴행성관절염 무릎관절염', url: 'https://www.youtube.com/watch?v=ejm4Uk-GR4Q' },
    { title: '🏆240만🏆 허리 아픈 사람이 꼭 지켜야 할 3가지 #허리디스크', url: 'https://www.youtube.com/watch?v=PYNfFV4CHig' },
    { title: '관절염 초기 증상부터 극복에 효과적인 스트레칭, 운동, 그리고 관절 건강에 좋은 음식까지 모두 알려드릴게요. (채널: 정보버튼)', url: 'http://www.youtube.com/watch?v=VZ2DMy0_Jrc' }
  ],
  '재활의학과': [
    { title: '[충격] 운동이 오히려 독, 75세 재활의학과 의사가 밝힌 최악의 운동 습관 7가지 ㅣ노후건강ㅣ노후사연ㅣ시니어 운동ㅣ 관절보호운동 ㅣ오디오북 ㅣ', url: 'https://www.youtube.com/watch?v=eOX5ZED6XRU' },
    { title: '걷기 자세 하나로 허리 좋아지는 법 ㅣ허리디스크ㅣ디스크치료ㅣ서울대병원 재활의학과 정선근 교수 3부 (채널: 더건강)', url: 'http://www.youtube.com/watch?v=1kchq0asD0o' },
    { title: '약 말고, 뼈 살리는 운동법 3가지! 60대 골다공증 예방 비법 (채널: 든든시니어튜브)', url: 'http://www.youtube.com/watch?v=VWYnJ-bLadQ' }
  ],
  '피부과': [
    { title: '피부과의사가 알려주는 ‘속건조’ 잡는 스킨케어 l 피부관리 l 건조피', url: 'https://www.youtube.com/watch?v=vKaNdkPPMI4' },
    { title: '[힐팁TV] 겨울철 단골손님 ‘피부 건조증’ 발생 과정과 개선 방법', url: 'https://www.youtube.com/watch?v=witA-0-DlI4' },
    { title: '봄철 야외활동주의♨ 피부 노화를 가속하는 주범 "자외선" | 위대한 식탁 64회 | JTBC 230311 방송', url: 'https://www.youtube.com/watch?v=UR24FEmzWng' }
  ],
  '비뇨기과': [
    { title: '방광염 증상, 급성 방광염 도대체 방광염은 무엇일까?', url: 'https://www.youtube.com/watch?v=NiFdN_a4n68' },
    { title: '[무엇이든 물어보세요] 요실금 개선 운동법 | KBS 220627 방송', url: 'https://www.youtube.com/watch?v=F1W_jWRub_k' },
    { title: '무엇이든 물어보세요 - 과민성 방광 치료 운동 20171017', url: 'https://www.youtube.com/watch?v=ny10NLK1a_Y' }
  ]
}

const MainPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()

  const [page, setPage] = useState(0)
  const [filteredHospitals, setFilteredHospitals] = useState(rawHospitalList)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSymptoms, setUserSymptoms] = useState([])
  const [showAllVideos, setShowAllVideos] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user', { withCredentials: true })
      .then(res => {
        if (res.data.user && res.data.user.userId) {
          setIsLoggedIn(true)
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
    let symptoms = location.state?.selectedSymptoms || []

    if (symptoms.length === 0 && userSymptoms.length > 0) {
      symptoms = userSymptoms.map(id => idToSymptom[id]).filter(Boolean)
    }

    if (!symptoms || symptoms.length === 0 || symptoms.includes('전체 보기')) {
      setFilteredHospitals(rawHospitalList)
      return
    }

    const depts = symptoms.flatMap(symp => symptomToDept[symp] || [])
    const uniqueDepts = [...new Set(depts)]

    if (uniqueDepts.length === 0) {
      setFilteredHospitals(rawHospitalList)
      return
    }

    const filtered = rawHospitalList.filter(h => uniqueDepts.includes(h.name))
    setFilteredHospitals(filtered)
  }, [location.state?.selectedSymptoms, userSymptoms, isLoggedIn])

  const nextPage = () => page < Math.ceil(filteredHospitals.length / 4) - 1 && setPage(prev => prev + 1)
  const prevPage = () => page > 0 && setPage(prev => prev - 1)
  const goToMapWithDept = dept => navigate('/map', { state: { selectedDepts: [dept] } })
  const pageData = filteredHospitals.slice(page * 4, page * 4 + 4)

  // 영상 리스트 처리
  const videoLists = filteredHospitals.some(h => h.name === '전체 보기' || h.name === '전체보기')
    ? Object.values(youtubeVideosByDept).flat()
    : filteredHospitals.flatMap(h => youtubeVideosByDept[h.name] || [])

  const limitedVideos = videoLists.slice(0, 3)
  const displayVideos = showAllVideos ? videoLists : limitedVideos

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
              <li key={i} onClick={() => goToMapWithDept(item.name)} style={{ cursor: 'pointer', borderColor: '#e0e0e0' }}>
                <img
                  src={`./src/images/medicalDepartment/${item.icon}.png`}
                  alt={item.name}
                  onError={e => { e.target.style.display = 'none' }}
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
                {displayVideos.length === 0 && <li>영상이 없습니다.</li>}
                {displayVideos.map((video, idx) => (
                  <li key={idx}>
                    <a href={video.url} target='_blank' rel='noopener noreferrer'>
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
              {videoLists.length > 3 && (
                <button
                  type='button'
                  onClick={() => setShowAllVideos(prev => !prev)}
                  className='MainPage_toggle-button'
                >
                  {showAllVideos ? '접기 ▲' : '▼ 더보기'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="MainPage_community-button"
          >
            커뮤니티 페이지로 이동
          </button>
        </div>


      </div>
      <BottomNav />
    </>
  )
}

export default MainPage
