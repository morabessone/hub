import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import PlanPage from './pages/PlanPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
