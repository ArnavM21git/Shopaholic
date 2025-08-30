import { ThemeToggle } from '../context/ThemeProvider';
import ShoppingList from '../components/ShoppingList';

export default function Page() {
  return (
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
  );
}
