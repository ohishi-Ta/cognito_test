import AuthWrapper from './components/AuthWrapper'
import LogoutButton from './components/LogoutButton'
import UserInfo from './components/UserInfo'

export default function HomePage() {
  return (
    <AuthWrapper>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h1 style={{ margin: 0 }}>TOPページ</h1>
          <LogoutButton />
        </header>

        <main>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0 }}>ようこそ！</h2>
            <UserInfo />
          </div>

          <div style={{ 
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px'
          }}>
            <h3>コンテンツエリア</h3>
            <p>ここにメインコンテンツが表示されます。</p>
            {/* サーバーコンポーネントなので、ここでデータフェッチなども可能 */}
          </div>
        </main>
      </div>
    </AuthWrapper>
  )
}