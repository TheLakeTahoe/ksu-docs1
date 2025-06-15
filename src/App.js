import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import RequestPage from './pages/RequestPage'
import SettingsPage from './pages/SettingsPage'
import DocumentsPage from './pages/DocumentsPage'
import { DocumentsProvider } from './context/DocumentsContext'
import { AuthProvider } from './context/AuthContext'
import NotFoundPage from './pages/NotFoundPage'



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/auth' element={
            <AuthPage />
          } />

          <Route path='/main' element={
            <MainPage />
          } />

          <Route path='/request' element={
            <RequestPage />
          } />

          <Route path='/settings' element={
            <SettingsPage />
          } />

          <Route path='/documents' element={
            <DocumentsProvider>
              <DocumentsPage />
            </DocumentsProvider>
          } />

          <Route path='*' element={
            <NotFoundPage />
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
