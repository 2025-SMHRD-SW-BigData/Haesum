import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/join.css'

const Join = () => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <div className='Join_container'>
                <h2>회원가입</h2>
                <div className='Join_input-group'>
                    <label>핸드폰 번호</label>
                    <input
                        type='text'
                        placeholder='핸드폰 번호 입력'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className='Join_input-group'>
                    <label>비밀번호</label>
                    <input
                        type='password'
                        placeholder='비밀번호 입력'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='Join_submit-btn'>회원가입</button>
            </div>
        </>
    )
}

export default Join
