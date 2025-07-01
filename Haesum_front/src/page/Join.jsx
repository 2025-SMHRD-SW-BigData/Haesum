import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../css/join.css'

const Join = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [email, setEmail] = useState('')
    const [nick, setNick] = useState('')
    const [age, setAge] = useState('')

    const navigate = useNavigate()

    const handleJoin = async () => {
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다')
            return
        }

        try {
            const res = await axios.post('http://localhost:3000/api/join', {
                phone,
                password,
                email,
                nick,
                age,
                login_type: 'phone'
            })
            if (res.data.success) {
                alert('회원가입 성공')
                navigate('/login')
            } else {
                alert('회원가입 실패')
            }
        } catch (err) {
            console.error(err)
            alert('서버 오류')
        }
    }

    return (
        <div className='Join_container'>
            <h2>회원가입</h2>

            <div className='Join_input-group'>
                <label>핸드폰 번호</label>
                <input type='tel' placeholder='핸드폰 번호 입력'
                    value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className='Join_input-group'>
                <label>비밀번호</label>
                <input type='password' placeholder='비밀번호 입력'
                    value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className='Join_input-group'>
                <label>비밀번호 확인</label>
                <input type='password' placeholder='비밀번호 확인'
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <div className='Join_input-group'>
                <label>이메일</label>
                <input type='email' placeholder='이메일 입력'
                    value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className='Join_input-group'>
                <label>닉네임</label>
                <input type='text' placeholder='닉네임 입력'
                    value={nick} onChange={(e) => setNick(e.target.value)} />
            </div>

            <div className='Join_input-group'>
                <label>나이</label>
                <input type='number' placeholder='나이 입력'
                    value={age} onChange={(e) => setAge(e.target.value)} />
            </div>

            <button className='Join_submit-btn' onClick={handleJoin}>
                회원가입
            </button>
        </div>
    )
}

export default Join
