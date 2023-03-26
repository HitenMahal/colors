import { React } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './hooks/use-auth-listener';
import ProtectedRoute from './context/protected-route';
import Login from './pages/Login'
import Home from './pages/Home'

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  )
}

export default App