import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/login.css'



const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
        login_type: 'phone'  // 필수 추가
      })
      if (res.data.success) {
        localStorage.setItem('nick', res.data.user.nick)
        alert('로그인 성공')
        navigate('/mypage')
      } else {
        alert('로그인 실패: ' + (res.data.message || ''))
      }
    } catch (err) {
      console.error(err)
      alert('서버 오류')
    }
  }

  return (
    <div className='Login_container'>
      <a
        href="#"
        className='Login_back'
        onClick={e => {
          e.preventDefault()
          navigate('/mypage')
        }}
      >
        <img src="./src/images/back.png" alt="뒤로가기" />
      </a>

      <img src="./src/images/logo.png" alt="해숨로고" className='Login_logo' />
      <p>간편 로그인으로 더 다양한 <br />서비스를 이용하세요.</p>

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

      <div className="Login_login">
        <div className="Login_btn kakao">
          <a href="#"><img src="./src/images/kakao.png" alt="카카오" />카카오로 시작하기</a>
        </div>
        <div className="Login_btn naver">
          <a href="#"><img src="./src/images/naver.png" alt="네이버" />네이버로 시작하기</a>
        </div>
        <div className="Login_btn google">
          <a href="#"><img src="./src/images/google.png" alt="구글" />구글로 시작하기</a>
        </div>
      </div>

      <div className='Login_phone-wrap'>
        <a
          href="#"
          className='Login_phone'
          onClick={e => {
            e.preventDefault()
            navigate('/join')
          }}
        >
          회원가입
        </a>
      </div>
    </div>
  )
  axios.post('http://localhost:3000/api/login', { email, password, login_type: 'phone' })


}

export default Login
