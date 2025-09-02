import './globals.css';
import ThemeProvider from '../context/ThemeProvider';
import Header from './components/Header';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  // read theme cookie on the server so the initial HTML can include data-theme
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = cookieTheme === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <ThemeProvider>
          <div className="app-container">
            <Header />
            <main className="main-content">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
