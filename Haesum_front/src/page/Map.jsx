import { useState, useEffect, useRef } from 'react'
import '../css/map.css'
import BottomNav from '../page/BottomNav'

const departments = [
  '전체보기', '가정의학과', '결핵과', '마취통증의학과', '비뇨기과', '소아청소년과', '신경과', '신경외과',
  '안과', '영상의학과', '외과', '응급의학과', '이비인후과', '재활의학과', '정형외과',
  '직업환경의학과', '피부과', '한방', '내과', '산부인과', '성형외과', '진단검사의학과', '정신건강의학과'
]

const Map = () => {
  const [inputValue, setInputValue] = useState('')
  const [showSubjectList, setShowSubjectList] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedDept, setSelectedDept] = useState('전체보기')
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [listExpanded, setListExpanded] = useState(false)
  const [favorites, setFavorites] = useState(new Set())

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)

  const handleClickSubject = () => {
    setShowSubjectList(true)
    setIsActive(true)
  }

  const handleClose = () => {
    setShowSubjectList(false)
    setIsActive(false)
  }

  const fetchHospitals = (dept = '전체보기') => {
    const url = dept === '전체보기'
      ? 'http://localhost:3000/api/hospitals'
      : `http://localhost:3000/api/hospitals?department=${encodeURIComponent(dept)}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setHospitals(data)
        setFilteredHospitals(data)
      })
      .catch(err => console.error('병원 정보 로드 실패:', err))
  }

  const onSelectDepartment = (dept) => {
    setInputValue(dept)
    setSelectedDept(dept)
    fetchHospitals(dept)
    handleClose()
  }

  const onSearch = () => {
    const keyword = inputValue.trim()
    if (!keyword) {
      setFilteredHospitals(hospitals)
      return
    }
    const filtered = hospitals.filter(h =>
      h.name.includes(keyword) ||
      h.departments.some(d => d.includes(keyword))
    )
    setFilteredHospitals(filtered)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) newFavorites.delete(id)
      else newFavorites.add(id)
      return newFavorites
    })
  }

  useEffect(() => {
    fetchHospitals('전체보기')
  }, [])

  useEffect(() => {
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
  }, [filteredHospitals])

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
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="질병, 진료과, 병원을 검색해보세요."
            onKeyDown={e => { if (e.key === 'Enter') onSearch() }}
          />
          <button onClick={onSearch}>검색</button>
        </div>

        <div
          className={`Map_subject-name ${isHovered || isActive ? 'active' : ''}`}
          onClick={handleClickSubject}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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

        {/* 리스트 */}
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

        {/* 진료과목 선택 */}
        {showSubjectList && <div className="Map_overlay" onClick={handleClose}></div>}

        <div className={`Map_subject-name-list ${showSubjectList ? 'show' : ''}`}>
          <div className='Map_list-title'>
            <h6>진료과목명</h6>
            <img src="./src/images/close.png" alt="닫기" onClick={handleClose} />
          </div>
          <ul>
            {departments.map(dept => (
              <li key={dept}>
                <a href="#"
                  onClick={e => {
                    e.preventDefault()
                    onSelectDepartment(dept)
                  }}
                >
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
