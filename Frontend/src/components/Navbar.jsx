import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ loggedIn }) => {
  const [LogOut, setLogOut] = useState(false)
  return (
    <>

      <nav className='flex bg-violet-300 justify-between items-center h-20 '>
        <div className="logo ml-5">
          <span className='font-bold font-sans text-2xl text-violet-700'>&lt;PAYYEE /&gt;</span>
        </div>
        <div className='mr-5'>
          {(loggedIn && !LogOut) ? (
            <div className='flex gap-5 items-center'>
              <div className='text-white font-semibold'>{loggedIn}</div>
              <div><button onClick={()=>setLogOut(true)} className='bg-violet-800 p-2 text-white font-semibold rounded-md hover:bg-violet-700'><Link to="/">Logout</Link></button></div>
            </div>
          ) : (<button className='bg-violet-800 p-3 text-white font-semibold rounded-md hover:bg-violet-700'><Link to="/">Register/Login</Link></button>)}
        </div>
      </nav>
    </>
  )
}

export default Navbar
