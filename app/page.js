import { ThemeToggle } from '../context/ThemeProvider';
import ShoppingList from '../components/ShoppingList';

export default function Page() {
  return (
    <>
      <header className="topbar">
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 3h18v4H3z" fill="currentColor" opacity="0.12" />
            <path d="M6 7l2 10h8l2-10" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          </svg>
          <span>Shopaholic</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ThemeToggle className="theme-toggle compact" />
        </div>
      </header>

      <div className="page-wrap">
        <section className="hero">
          <div className="hero-inner hero-center">
            <div>
              <h1>Welcome to Shopaholic</h1>
              <p className="lead">Your one-stop shop for managing shopping lists and favorite items.</p>
            </div>

            <div className="card">
              <h3>Get Started</h3>
              <p>Create your shopping list by adding items below. You can also save your favorite items for quick access later.</p>
            </div>

            <ShoppingList />
          </div>
        </section>
      </div>
    </>
  );
}
