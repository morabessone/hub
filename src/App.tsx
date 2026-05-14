import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Marketplace from './pages/Marketplace'
import MyPlan from './pages/MyPlan'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mi-plan" element={<MyPlan />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
