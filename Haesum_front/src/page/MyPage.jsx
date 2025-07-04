import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/mypage.css';
import BottomNav from '../page/BottomNav';

const MyPage = () => {
  const [nick, setNick] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isChecklistHover, setIsChecklistHover] = useState(false);
  const [isSaveHover, setIsSaveHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/user', { withCredentials: true });
        if (res.data.user) {
          setNick(res.data.user.nick);
          setUserId(res.data.user.userId || res.data.user.USER_ID);
          localStorage.setItem('nick', res.data.user.nick);
        } else {
          setNick(null);
          setUserId(null);
          localStorage.removeItem('nick');
        }
      } catch {
        setNick(null);
        setUserId(null);
        localStorage.removeItem('nick');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout', { withCredentials: true });
      localStorage.removeItem('nick');
      sessionStorage.removeItem('user');
      setNick(null);
      setUserId(null);
      navigate('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 실패');
    }
  };

  return (
    <>
      <div className='MyPage_container'>
        <div className='MyPage_header'>
          <img src="./src/images/logo.png" alt="해숨로고" className='MyPage_logo' />
        </div>
        <h2>마이페이지</h2>

        {nick ? (
          <div className='MyPage_login'>
            <p>{nick}님 환영합니다.</p>
            {userId === '999' ? (
              <button onClick={handleLogout} className='Logout_btn'>
                로그인 하고 이용하기
              </button>
            ) : (
              <button onClick={handleLogout} className='Logout_btn'>
                로그아웃
              </button>
            )}
          </div>
        ) : (
          <div className='MyPage_login'>
            <p>로그인 해주세요.</p>
            <div>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                로그인
              </a>
            </div>
          </div>
        )}

        <div className='MyPage_save-container'>
          <div className='MyPage_checklist'>
            <a
              href="#"
              onMouseEnter={() => setIsChecklistHover(true)}
              onMouseLeave={() => setIsChecklistHover(false)}
              onClick={e => {
                e.preventDefault();
                navigate('/start');
              }}
            >
              <img
                src={isChecklistHover ? './src/images/choice-2.png' : './src/images/choice.png'}
                alt="증상 선택"
              />
              <h6>증상 선택하러 가기</h6>
            </a>
          </div>

          <div className='MyPage_save'>
            <a
              href="#"
              onMouseEnter={() => setIsSaveHover(true)}
              onMouseLeave={() => setIsSaveHover(false)}
              onClick={e => {
                e.preventDefault();
                navigate('/Bookmark');
              }}
            >
              <img
                src={isSaveHover ? './src/images/save-2.png' : './src/images/save.png'}
                alt="저장"
              />
              <h6>병원 즐겨찾기</h6>
            </a>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
};

export default MyPage;
