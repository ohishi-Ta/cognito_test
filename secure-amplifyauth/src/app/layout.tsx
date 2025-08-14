// app/layout.tsx
import AuthWrapper from './components/AuthWrapper'
import AmplifyProvider from './components/AmplifyProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AmplifyProvider>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </AmplifyProvider>
      </body>
    </html>
  )
}