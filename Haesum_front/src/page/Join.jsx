import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/join.css'

const Join = () => {
    // 핸드폰, 비번 입력
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <div className='container'>
                <h2>회원가입</h2>
                <div className='input-group'>
                    <label>핸드폰 번호</label>
                    <input
                        type='text'
                        placeholder='핸드폰 번호 입력'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className='input-group'>
                    <label>비밀번호</label>
                    <input
                        type='password'
                        placeholder='비밀번호 입력'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='submit-btn'>회원가입</button>
            </div>
        </>
    )
}

export default Join