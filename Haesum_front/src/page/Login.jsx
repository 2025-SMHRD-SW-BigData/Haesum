import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user', { withCredentials: true })
      .then(res => {
        if (res.data.user && res.data.user.nick) {
          setNick(res.data.user.nick);
          localStorage.setItem('nick', res.data.user.nick);
          localStorage.setItem('email', res.data.user.userEmail);
          localStorage.setItem('login_type', res.data.user.loginType);

          if (res.data.user.userId || res.data.user.id) {
            sessionStorage.setItem(
              'user',
              JSON.stringify({ userId: res.data.user.userId || res.data.user.id })
            );
          }
          navigate('/start');
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
        login_type: 'phone'
      }, { withCredentials: true });

      if (res.data.success) {
        setNick(res.data.user.nick);
        localStorage.setItem('nick', res.data.user.nick);
        localStorage.setItem('email', res.data.user.userEmail);
        localStorage.setItem('login_type', res.data.user.loginType);

        if (res.data.user.userId || res.data.user.id) {
          sessionStorage.setItem('user', JSON.stringify({ userId: res.data.user.userId }));
        }
        navigate('/start');
      } else {
        alert('로그인 실패: ' + (res.data.message || ''));
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    }
  };

  const handleGuestLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/guest-login', {}, { withCredentials: true });

      if (res.data.success) {
        setNick(res.data.user.nick);
        localStorage.setItem('nick', res.data.user.nick);
        localStorage.setItem('email', res.data.user.userEmail);
        localStorage.setItem('login_type', res.data.user.loginType);

        sessionStorage.setItem('user', JSON.stringify({ userId: res.data.user.userId }));
        navigate('/start');
      } else {
        alert('비회원 로그인 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3000/auth/logout', { withCredentials: true });
      setNick('');
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 실패');
    }
  };

  return (
    <div className='Login_container'>
      {nick && <p className="welcome-message">{nick}님 환영합니다.</p>}

      <a href="#" className='Login_back' onClick={e => { e.preventDefault(); navigate('/mypage'); }}>
        <img src="./src/images/back.png" alt="뒤로가기" />
      </a>

      <img src="./src/images/logo.png" alt="해숨로고" className='Login_logo' />
      <p>간편 로그인으로 더 다양한 <br />서비스를 이용하세요.</p>

      {!nick && (
        <div className="Login_form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}

      {nick && (
        <button onClick={handleLogout} style={{ marginTop: '20px' }}>
          로그아웃
        </button>
      )}

      <div className="Login_login">
        <div className="Login_btn kakao">
          <a href="http://localhost:3000/auth/kakao">
            <img src="./src/images/kakao.png" alt="카카오" />카카오로 시작하기
          </a>
        </div>
        <div className="Login_btn naver">
          <a href="http://localhost:3000/auth/naver">
            <img src="./src/images/naver.png" alt="네이버" />네이버로 시작하기
          </a>
        </div>
        <div className="Login_btn google">
          <a href="http://localhost:3000/auth/google">
            <img src="./src/images/google.png" alt="구글" />구글로 시작하기
          </a>
        </div>
        <div className="Login_btn guest">
          <a href="#" onClick={e => { e.preventDefault(); handleGuestLogin(); }}>
            비회원으로 이용하기
          </a>
        </div>
      </div>

      <div className='Login_phone-wrap'>
        <a href="#" className='Login_phone' onClick={e => { e.preventDefault(); navigate('/join'); }}>
          회원가입
        </a>
      </div>
    </div>
  );
};

export default Login;
