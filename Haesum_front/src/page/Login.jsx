import { useNavigate } from 'react-router-dom'
import '../css/login.css'

const Login = () => {
    const navigate = useNavigate()

    return (
        <>
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
                        핸드폰 번호로 회원가입
                    </a>
                </div>
            </div>
        </>
    )
}

export default Login
