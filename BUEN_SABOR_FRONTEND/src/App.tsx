import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './components/layout/Home'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
