// Bookmark.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/bookmark.css';
import BottomNav from '../page/BottomNav';

const Bookmark = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // 진료과 포맷 함수
  const formatDepartments = (deps) => {
    if (!deps) return '정보 없음';
    if (Array.isArray(deps)) {
      if (deps.length === 0) return '정보 없음';
      return deps.join(', ');
    }
    if (typeof deps === 'string') return deps;
    return '정보 없음';
  };

  // 로그인 및 사용자 정보 확인
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요');
      navigate('/');
      return;
    }
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.userId);
    } else {
      axios
        .get('http://localhost:3000/auth/user', { withCredentials: true })
        .then((res) => {
          if (res.data.user) {
            setUserId(res.data.user.userId);
            sessionStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch((err) => console.error('세션 사용자 확인 실패:', err));
    }
  }, [isLoggedIn, navigate]);

  // 즐겨찾기 데이터 로드
  useEffect(() => {
    if (!userId) return;
    axios
      .get('http://localhost:3000/api/favorite/favorite', {
        params: { userId },
        withCredentials: true,
      })
      .then((res) => {
        const favs = res.data.map((fav) => ({
          ...fav,
          departments: fav.departments || [],
          id: fav.id || fav.HOSPITAL_ID,
        }));
        setFavorites(favs);
      })
      .catch((err) => console.error('즐겨찾기 불러오기 실패:', err));
  }, [userId]);

  // 즐겨찾기 삭제 함수
  const removeFavorite = async (hospitalId) => {
    if (!userId) {
      alert('로그인 해주세요');
      return;
    }
    try {
      await axios.delete('http://localhost:3000/api/favorite/favorite', {
        data: { userId, hospitalId },
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((f) => f.id !== hospitalId));
    } catch (err) {
      console.error('즐겨찾기 삭제 실패:', err);
    }
  };

  // 제주시청 출발지 고정, 병원 도착지로 차량 길찾기 (출발지/도착지 명칭 포함)
  const openDirection = (lat, lng, name) => {
    if (!lat || !lng) {
      alert('위치 정보가 없습니다.');
      return;
    }

    // 제주시청 좌표 (위도, 경도)
    const fromLat = 33.499622;
    const fromLng = 126.531188;
    const fromName = '제주시청';

    // 병원 좌표 및 이름
    const toLat = lat;
    const toLng = lng;
    const toName = name;

    // 카카오맵 길찾기 URL - 출발지와 도착지 명칭과 좌표를 명확히 지정
    const url = `https://map.kakao.com/link/from/${encodeURIComponent(fromName)},${fromLat},${fromLng}/to/${encodeURIComponent(toName)},${toLat},${toLng}`;

    window.open(url, '_blank');
  };

  return (
    <>
      <div className="Bookmark_container">
        <div className="Bookmark_header">
          <a
            href="#"
            className="Login_back"
            onClick={(e) => {
              e.preventDefault();
              navigate('/mypage');
            }}
          >
            <img src="./src/images/back.png" alt="뒤로가기" />
          </a>
          <img src="./src/images/logo.png" alt="해숨로고" className="Bookmark_logo" />
        </div>
        <h2>병원 즐겨찾기</h2>

        {favorites.length === 0 ? (
          <p>즐겨찾기한 병원이 없습니다.</p>
        ) : (
          favorites.map((f) => (
            <div
              key={f.id}
              className="Bookmark_item"
              style={{ position: 'relative', paddingBottom: '30px' }}
            >
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

              <button
                className="Bookmark_direction-btn"
                onClick={() => openDirection(f.lat, f.lng, f.name)}
              >
                길찾기
              </button>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </>
  );
};

export default Bookmark;
