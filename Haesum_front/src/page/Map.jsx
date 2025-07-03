import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import '../css/map.css'
import BottomNav from '../page/BottomNav'

const departments = [
  '전체보기', '가정의학과', '결핵과', '마취통증의학과', '비뇨기과', '소아청소년과',
  '신경과', '신경외과', '안과', '영상의학과', '외과', '응급의학과',
  '이비인후과', '재활의학과', '정형외과', '직업환경의학과', '피부과',
  '한방', '내과', '산부인과', '성형외과', '진단검사의학과', '정신건강의학과'
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
  '전체 보기': ['전체보기']
}

const Map = () => {
  const location = useLocation()
  const selectedSymptoms = location.state?.selectedSymptoms || []
  const selectedDeptsFromMain = location.state?.selectedDepts || []

  const getInitialSelectedDepts = () => {
    if (selectedSymptoms.length > 0) {
      const deptsFromSymptoms = selectedSymptoms.flatMap(symptom => symptomToDept[symptom] || [])
      const uniqueDepts = [...new Set(deptsFromSymptoms)]
      return uniqueDepts.includes('전체보기') ? [] : uniqueDepts
    }
    if (selectedDeptsFromMain.length > 0) {
      return selectedDeptsFromMain
    }
    return []
  }

  const [selectedDepts, setSelectedDepts] = useState(getInitialSelectedDepts)

  const [inputValue, setInputValue] = useState(() => {
    const initial = getInitialSelectedDepts()
    return initial.length === 0 ? '' : initial.join(', ')
  })

  const [showSubjectList, setShowSubjectList] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [listExpanded, setListExpanded] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [userId, setUserId] = useState(null)

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setUserId(user.userId)
    } else {
      axios.get('http://localhost:3000/auth/user', { withCredentials: true })
        .then(res => {
          if (res.data.user) {
            setUserId(res.data.user.userId)
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
          } else {
            setUserId('')
          }
        })
        .catch(() => setUserId(''))
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    axios.get('http://localhost:3000/api/favorite/favorite', { withCredentials: true })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const favSet = new Set(res.data.map(fav => fav.id))
          setFavorites(favSet)
        }
      })
      .catch(err => console.error('즐겨찾기 불러오기 실패:', err))
  }, [userId])

  const handleClickSubject = () => {
    setShowSubjectList(true)
    setIsActive(true)
  }

  const handleClose = () => {
    setShowSubjectList(false)
    setIsActive(false)
  }

  const fetchHospitals = (dept = '전체보기') => {
    let url = 'http://localhost:3000/api/hospital'
    if (dept !== '전체보기' && dept !== '') {
      url += `?department=${encodeURIComponent(dept)}`
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setHospitals(data)
        setFilteredHospitals(data)
      })
      .catch(err => console.error('병원 정보 로드 실패:', err))
  }

  const toggleDept = (dept) => {
    if (dept === '전체보기') {
      setSelectedDepts([])
      handleClose()
      return
    }
    setSelectedDepts(prev =>
      prev.includes(dept)
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    )
  }

  useEffect(() => {
    if (selectedDepts.length === 0) {
      setFilteredHospitals(hospitals)
    } else {
      const filtered = hospitals.filter(h =>
        h.departments.some(d => selectedDepts.includes(d))
      )
      setFilteredHospitals(filtered)
    }
  }, [selectedDepts, hospitals])

  useEffect(() => {
    fetchHospitals('전체보기')
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    if (window.kakao && window.kakao.maps) {
      if (!mapInstance.current) {
        const container = mapRef.current
        const options = {
          center: new window.kakao.maps.LatLng(33.4996213, 126.5311884),
          level: 3,
        }
        mapInstance.current = new window.kakao.maps.Map(container, options)
      }
      updateMarkers()
    } else {
      const script = document.createElement('script')
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=4b4eedc43fe1ddf48cd873806db837a5&autoload=false"
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = mapRef.current
          const options = {
            center: new window.kakao.maps.LatLng(33.4996213, 126.5311884),
            level: 3,
          }
          mapInstance.current = new window.kakao.maps.Map(container, options)
          updateMarkers()
        })
      }
      document.head.appendChild(script)
    }

    return () => {
      markersRef.current.forEach(m => m.setMap(null))
      markersRef.current = []
      if (infoWindowRef.current) {
        infoWindowRef.current.close()
        infoWindowRef.current = null
      }
    }
  }, [filteredHospitals, location.pathname])

  const updateMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    if (!mapInstance.current) return

    const bounds = new window.kakao.maps.LatLngBounds()

    filteredHospitals.forEach(h => {
      if (!h.lat || !h.lng) return
      const position = new window.kakao.maps.LatLng(h.lat, h.lng)
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance.current
      })
      markersRef.current.push(marker)
      bounds.extend(position)

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">${h.name}</div>`
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (infoWindowRef.current) infoWindowRef.current.close()
        infowindow.open(mapInstance.current, marker)
        infoWindowRef.current = infowindow
      })
    })

    if (!bounds.isEmpty()) {
      mapInstance.current.setBounds(bounds)
    }
  }

  const onSearch = () => {
    const keyword = inputValue.trim()
    if (!keyword) {
      setFilteredHospitals(hospitals)
      return
    }
    const keywords = keyword.split(',').map(k => k.trim()).filter(k => k !== '')
    const filtered = hospitals.filter(h =>
      keywords.some(k =>
        h.name.includes(k) ||
        h.departments.some(d => d.includes(k))
      )
    )
    setFilteredHospitals(filtered)
  }

  const toggleFavorite = async (hospitalId) => {
    if (!userId) {
      alert('로그인 해주세요')
      return
    }

    try {
      if (favorites.has(hospitalId)) {
        await axios.delete('http://localhost:3000/api/favorite/favorite', {
          data: { hospitalId },
          withCredentials: true,
        })
      } else {
        await axios.post('http://localhost:3000/api/favorite/favorite', {
          hospitalId,
        }, { withCredentials: true })
      }

      setFavorites(prev => {
        const newSet = new Set(prev)
        if (newSet.has(hospitalId)) newSet.delete(hospitalId)
        else newSet.add(hospitalId)
        return newSet
      })

    } catch (err) {
      console.error('즐겨찾기 토글 실패:', err)
    }
  }

  // selectedDepts 바뀔 때마다 inputValue도 동기화
  useEffect(() => {
    if (selectedDepts.length === 0) {
      setInputValue('')
    } else {
      setInputValue(selectedDepts.join(', '))
    }
  }, [selectedDepts])

  if (userId === null) return <div>로딩 중...</div>

  return (
    <div>
      <div className='Map_container'>
        <div className='Map_header'>
          <img src="./src/images/logo.png" alt="해숨로고" className='Map_logo' />
        </div>

        <div className='Map_search-bar'>
          <img src="./src/images/main-search.png" alt="검색" className="Map_search-icon" />
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="질병, 진료과, 병원을 검색해보세요."
            onKeyDown={e => { if (e.key === 'Enter') onSearch() }}
          />
          <button onClick={onSearch}>검색</button>
        </div>

        <div className={`Map_subject-name ${isHovered || isActive ? 'active' : ''}`}
          onClick={handleClickSubject}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          진료과
          <img
            src={(isHovered || isActive)
              ? "./src/images/under direction-2.png"
              : "./src/images/under direction.png"}
            alt="화살표"
            className={showSubjectList ? 'rotated' : ''}
          />
        </div>

        <div className='Map_map' ref={mapRef}></div>

        <div className={`Map_hospital-list ${listExpanded ? 'expanded' : 'collapsed'}`}>
          {filteredHospitals.length === 0 ? (
            <p className='Map_no-result'>검색 결과가 없습니다.</p>
          ) : (
            filteredHospitals.map(h => (
              <div key={h.id} className='Map_hospital-item'>
                <div style={{ position: 'relative' }}>
                  <strong>{h.name}</strong>
                  <span
                    className={`Map_favorite-star ${favorites.has(h.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(h.id)}
                    title={favorites.has(h.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  >
                    ★
                  </span>
                </div>
                <br />
                <span>{h.address}</span><br />
                <span>전화: {h.phone}</span><br />
                <span>진료과: {h.departments.join(', ')}</span><br />
                {h.website && (
                  <a href={h.website} target="_blank" rel="noopener noreferrer">
                    홈페이지
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        <div className={`Map_toggle-button ${listExpanded ? 'expanded' : 'collapsed'}`}>
          <button onClick={() => setListExpanded(prev => !prev)}>
            {listExpanded ? '▼ 접기' : '▲ 더보기'}
          </button>
        </div>

        {showSubjectList && <div className="Map_overlay" onClick={handleClose}></div>}

        <div className={`Map_subject-name-list ${showSubjectList ? 'show' : ''}`}>
          <div className='Map_list-title'>
            <h6>진료과목명</h6>
            <img src="./src/images/close.png" alt="닫기" onClick={handleClose} />
          </div>
          <ul>
            {departments.map(dept => (
              <li key={dept}>
                <a
                  href="#"
                  className={selectedDepts.includes(dept) || (dept === '전체보기' && selectedDepts.length === 0) ? 'selected' : ''}
                  onClick={e => {
                    e.preventDefault()
                    toggleDept(dept)
                  }}>
                  {dept}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default Map
