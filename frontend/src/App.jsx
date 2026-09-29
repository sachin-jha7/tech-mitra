import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import ScrollToTop from './components/ScrolltoTop'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import { DataProvider } from './context/DataContext'
import Admin from './pages/Admin'

function App() {

  return (
    <>
      <DataProvider>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Checkout />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
        <Footer />
      </DataProvider>
    </>
  )
}

export default App
