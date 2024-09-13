import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Username from './components/Username'
import Register from './components/Register'
import Reset from './components/Reset'
import PagenotFound from './components/PagenotFound'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import Password from './components/Password'


// auth middleware

import { AuthorizeUser,ProtectRoute } from './middleware/auth'

const router = createBrowserRouter([
    {
        path:'/',
        element: <Username/>
    },
    {
        path:'/register',
        element: <Register/>
    },
    {
      path:"/password",
      element: <ProtectRoute><Password/></ProtectRoute> ,
    },
    {
      path:"/profile",
      element: <AuthorizeUser><Profile/> </AuthorizeUser> ,
    },
    {
      path:"/recovery",
      element: <Recovery/>,
    },
    {
      path:"/reset",
      element:<Reset/>,
    },
    {
      path:"*",
      element:<PagenotFound/>
    }
])


const App = () => {
  return (
    <main>
        <RouterProvider router={router}>

        </RouterProvider>
    </main>
  )
}

export default App
