import { useState } from 'react'
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Createblog from './pages/Createblog';
import Nopage from './pages/Nopage';
import EditBlog from './pages/Editblog';
import RegisterPage from './components/RegisterPage.jsx';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute.jsx';
import Logout from './components/LogoutPage.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />}></Route>
          <Route path='/register' element={<RegisterPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/blog/:id' element={<Blog />}></Route>
          <Route path="/edit-blog/:id" element={<PrivateRoute element={<EditBlog />} />} />
          <Route path='/create' element={<Createblog />}></Route>
          <Route path='/logout' element={<Logout />} /> {/* Add route for Logout */}

          <Route path='*' element={<Nopage />}></Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
