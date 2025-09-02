import './globals.css';
import ThemeProvider from '../context/ThemeProvider';
import Header from './components/Header';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  let theme = 'light';
  try {
    const cookieStore = await cookies();
    const cookieTheme = cookieStore.get('theme')?.value;
    theme = cookieTheme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Error reading theme cookie:', error);
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
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
