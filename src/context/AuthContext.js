import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    error: null
  })

  // Полная инициализация пользователя
  const initUser = (token) => {
    try {
      const decoded = jwtDecode(token)
      const isExpired = Date.now() >= decoded.exp * 1000
      
      if (isExpired) {
        localStorage.removeItem('authtoken')
        return null
      }
      return decoded
    } catch (e) {
      localStorage.removeItem('authtoken')
      return null
    }
  }

  // Загрузка пользователя при монтировании
  useEffect(() => {
    const token = localStorage.getItem('authtoken')
    if (token) {
      const user = initUser(token)
      setAuthState({ user, isLoading: false, error: null })
    } else {
      setAuthState({ user: null, isLoading: false, error: null })
    }
  }, [])

  const login = async (token) => {
    try {
      const user = initUser(token)
      if (!user) throw new Error('Invalid token')
      
      localStorage.setItem('authtoken', token)
      setAuthState({ user, isLoading: false, error: null })
      return true
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error.message }))
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('authtoken')
    setAuthState({ user: null, isLoading: false, error: null })
  }

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      isLoading: authState.isLoading,
      error: authState.error,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)