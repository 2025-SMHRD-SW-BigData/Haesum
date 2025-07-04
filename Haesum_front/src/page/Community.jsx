import { useNavigate } from 'react-router-dom'
import '../css/community.css'
import BottomNav from '../page/BottomNav'

const Community = () => {
  const navigate = useNavigate()

  const posts = [
    {
      id: 1,
      name: '(재)한국의학연구소제주의원',
      address: '제주특별자치도 서귀포시 솔오름로 61 (동홍동)',
      phone: '064-729-6500',
      departments: ['가정의학과', '내과', '영상의학과', '직업환경의학과'],
      rating: 4,
      keywords: ['친절', '빠름']
    },
    {
      id: 2,
      name: '911매일의원',
      address: '제주특별자치도 제주시 아연로 603 (아라일동)',
      phone: '064-724-0911',
      departments: ['결핵과', '내과', '소아청소년과'],
      rating: 3,
      keywords: ['대기길음', '가격저렴']
    },
    {
      id: 3,
      name: '대정의원',
      address: '제주특별자치도 서귀포시 대정읍 하모상가로 46 . 4층',
      phone: '064-792-7588',
      departments: ['내과'],
      rating: 5,
      keywords: ['추천', '깨끗']
    },
    {
      id: 4,
      name: '대추나무한의원',
      address: '제주 제주시 노형11길 25 2층',
      phone: '064-733-8275',
      departments: ['한방'],
      rating: 4,
      keywords: ['친절']
    },
    {
      id: 5,
      name: '대한내과의원',
      address: '제주특별자치도 제주시 노형8길 3. 3.4층(노형동. 우학빌딩)',
      phone: '064-746-9661',
      departments: ['가정의학과', '내과', '소아청소년과', '신경과', '정신건강의학과', '피부과'],
      rating: 2,
      keywords: ['대기김', '설명부족']
    }
  ]

  return (
    <>
      <div className="Community_container">
        <div className="Community_header">
          <a href="#" className="Login_back" onClick={e => { e.preventDefault(); navigate('/mypage'); }}>
            <img src="./src/images/back.png" alt="뒤로가기" />
          </a>
          <img src="./src/images/logo.png" alt="해숨로고" className="Community_logo" />
        </div>

        <h2>병원 후기</h2>

        {posts.length === 0 ? (
          <p className="Community_empty-msg">등록된 후기가 없습니다.</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="Community_post" style={{ position: 'relative', paddingBottom: '30px' }}>
              <strong>{post.name}</strong>
              <br />
              <span>{post.address}</span>
              <br />
              <span>{post.phone}</span>
              <br />
              <span>진료과: {post.departments.join(', ')}</span>
              <br />
              <span>{' '.repeat(1)}{ '⭐'.repeat(post.rating) } ({post.rating})</span>
              <br />
              <span>키워드: {post.keywords.join(', ')}</span>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </>
  )
}

export default Community
