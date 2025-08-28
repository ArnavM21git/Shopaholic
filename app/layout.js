import './globals.css';
import ThemeProvider from './ThemeProvider';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  // read theme cookie on the server so the initial HTML can include data-theme
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = cookieTheme === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
