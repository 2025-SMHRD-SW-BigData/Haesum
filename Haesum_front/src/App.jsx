import React, { useEffect, useState, useRef } from 'react';

function KakaoMap({ hospitals }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=4b4eedc43fe1ddf48cd873806db837a5&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        markersRef.current = [];

        const bounds = new window.kakao.maps.LatLngBounds();

        hospitals.forEach(h => {
          if (h.lat && h.lng) {
            const position = new window.kakao.maps.LatLng(h.lat, h.lng);
            const marker = new window.kakao.maps.Marker({ position, map });
            markersRef.current.push(marker);
            bounds.extend(position);

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;">${h.name}</div>`,
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindow.open(map, marker);
            });
          }
        });

        if (!bounds.isEmpty()) {
          map.setBounds(bounds);
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [hospitals]);

  return <div ref={mapRef} style={{ width: '100%', height: '350px', marginBottom: '2rem' }} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedDept, setSelectedDept] = useState('전체');

  const parseUser = (user) => {
    if (!user) return null;
    switch (user.provider) {
      case 'google':
        return {
          id: user.id,
          displayName: user.displayName,
          emails: user.emails,
          photos: user.photos,
        };
      case 'kakao':
        return {
          id: user.id,
          displayName: user.displayName || user.username || user._json?.properties?.nickname,
          emails: user._json?.kakao_account?.email ? [{ value: user._json.kakao_account.email }] : [],
          photos: user._json?.properties?.thumbnail_image
            ? [{ value: user._json.properties.thumbnail_image }]
            : [],
        };
      case 'naver':
        return {
          id: user.id,
          displayName: user.displayName || user._json?.nickname,
          emails: user.emails || (user._json?.email ? [{ value: user._json.email }] : []),
          photos: user.photos || (user._json?.profile_image ? [{ value: user._json.profile_image }] : []),
        };
      default:
        return user;
    }
  };

  const handleLogin = (provider) => {
    window.location.href = `http://localhost:3000/auth/${provider}`;
  };

  const handleLogout = () => {
    fetch('http://localhost:3000/auth/logout', { method: 'GET', credentials: 'include' })
      .then((res) => {
        if (res.ok) setUser(null);
        else alert('로그아웃 실패');
      })
      .catch(() => alert('서버 연결 실패'));
  };

  useEffect(() => {
    fetch('http://localhost:3000/auth/user', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => setUser(parseUser(data)))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/hospitals')
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(err => console.error('병원 정보 로드 실패:', err));
  }, []);

  // 필터링된 병원
  const filteredHospitals = selectedDept === '전체'
    ? hospitals
    : hospitals.filter(h => h.departments.includes(selectedDept));

  // 전체 진료과목 목록 추출
  const allDepartments = Array.from(
    new Set(hospitals.flatMap(h => h.departments))
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {user ? (
        <div>
          <p>닉네임: {user.displayName}</p>
          <p>이메일: {user.emails?.[0]?.value || '이메일 정보 없음'}</p>
          <p>id: {user.id || '아이디 정보 없음'}</p>
          <img
            src={user.photos?.[0]?.value || ''}
            alt="프로필"
            style={{ borderRadius: '50%', width: 80 }}
          />
          <button onClick={handleLogout} style={{ marginTop: '1rem', padding: '6px 12px' }}>
            로그아웃
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={() => handleLogin('google')}
            style={{ padding: '10px 20px', fontSize: '16px', marginRight: 10 }}
          >
            구글 로그인
          </button>
          <button
            onClick={() => handleLogin('kakao')}
            style={{ padding: '10px 20px', fontSize: '16px', marginRight: 10 }}
          >
            카카오 로그인
          </button>
          <button
            onClick={() => handleLogin('naver')}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            네이버 로그인
          </button>
        </>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>진료과 선택: </label>
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
          <option value="전체">전체</option>
          {allDepartments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <KakaoMap hospitals={filteredHospitals} />

      <h3>🏥 병원 목록</h3>
      <ul>
        {filteredHospitals.map((h) => (
          <li key={h.id} style={{ marginBottom: '1rem' }}>
            <strong>{h.name}</strong>
            <br />
            주소: {h.address}
            <br />
            전화번호: {h.phone}
            <br />
            진료과목: {h.departments.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
