import { useNavigate } from 'react-router-dom'
import '../css/login.css'

const Login = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className='container'>
                <a
                    href="#"
                    className='back'
                    onClick={e => {
                        e.preventDefault()
                        navigate('/mypage')
                    }}
                >
                    <img src="./src/images/back.png" alt="뒤로가기" />
                </a>

                <img src="./src/images/logo.png" alt="해숨로고" className='logo' />
                <p>간편 로그인으로 더 다양한 <br />서비스를 이용하세요.</p>

                <div className="login">
                    <div className="btn kakao">
                        <a href="#"><img src="./src/images/kakao.png" alt="카카오" />카카오로 시작하기</a>
                    </div>
                    <div className="btn naver">
                        <a href="#"><img src="./src/images/naver.png" alt="네이버" />네이버로 시작하기</a>
                    </div>
                    <div className="btn google">
                        <a href="#"><img src="./src/images/google.png" alt="구글" />구글로 시작하기</a>
                    </div>
                </div>

                <div className='phone-wrap'>
                    <a
                        href="#"
                        className='phone'
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
