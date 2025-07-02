import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/bookmark.css'
import BottomNav from '../page/BottomNav'

const Bookmark = () => {
  const navigate = useNavigate()
  const [userId, setUserId] = useState(null)
  const [favorites, setFavorites] = useState([])

  // 진료과 출력 함수 (배열 또는 문자열 안전 처리)
  const formatDepartments = (deps) => {
    if (!deps) return '정보 없음'
    if (Array.isArray(deps)) {
      if (deps.length === 0) return '정보 없음'
      return deps.join(', ')
    }
    if (typeof deps === 'string') return deps
    return '정보 없음'
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setUserId(user.userId)
    } else {
      axios
        .get('http://localhost:3000/auth/user', { withCredentials: true })
        .then((res) => {
          if (res.data.user) {
            setUserId(res.data.user.userId)
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
          }
        })
        .catch((err) => console.error('세션 사용자 확인 실패:', err))
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    axios
      .get('http://localhost:3000/api/favorite', {
        params: { userId },
        withCredentials: true,
      })
      .then((res) => {
        // departments가 없으면 빈 배열로 초기화
        const favs = res.data.map((fav) => ({
          ...fav,
          departments: fav.departments || [],
        }))
        setFavorites(favs)
      })
      .catch((err) => console.error('즐겨찾기 불러오기 실패:', err))
  }, [userId])

  const removeFavorite = async (hospitalId) => {
    if (!userId) {
      alert('로그인이 필요합니다')
      return
    }
    try {
      await axios.delete('http://localhost:3000/api/favorite', {
        data: { userId, hospitalId },
        withCredentials: true,
      })
      setFavorites((prev) => prev.filter((f) => f.id !== hospitalId))
    } catch (err) {
      console.error('즐겨찾기 삭제 실패:', err)
    }
  }

  return (
    <>
      <div className="Bookmark_container">
        <div className="Bookmark_header">
          <button
            className="Login_back"
            onClick={() => {
              navigate('/mypage')
            }}
            aria-label="뒤로가기"
          >
            <img src="./src/images/back.png" alt="뒤로가기" />
          </button>
          <img src="./src/images/logo.png" alt="해숨로고" className="Bookmark_logo" />
        </div>
        <h2>병원 즐겨찾기</h2>

        {favorites.length === 0 ? (
          <p>즐겨찾기한 병원이 없습니다.</p>
        ) : (
          favorites.map((f) => (
            <div key={f.id} className="Bookmark_item">
              <strong>{f.name}</strong>
              <br />
              <span>{f.address}</span>
              <br />
              <span>{f.phone}</span>
              <br />
              <span>진료과: {formatDepartments(f.departments)}</span>
              <br />
              {f.website && (
                <a href={f.website} target="_blank" rel="noopener noreferrer">
                  홈페이지
                </a>
              )}
              <button className="Bookmark_remove-btn" onClick={() => removeFavorite(f.id)}>
                삭제
              </button>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </>
  )
}

export default Bookmark
