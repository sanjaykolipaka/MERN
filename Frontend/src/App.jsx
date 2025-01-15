import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Home from './pages/Home'

function App() {
  const [loggedIn, setloggedIn] = useState("")
  return (
    <>
      <Navbar loggedIn = {loggedIn}/>
      <Routes>
        <Route index element={<Register setloggedIn = {setloggedIn}/>} />
      
        <Route path='/home'>
          <Route index element={<Home loggedIn = {loggedIn}/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
