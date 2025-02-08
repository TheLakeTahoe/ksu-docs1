import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage'; 
import RegistrationPage from './pages/RegistrationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<LoginPage/>}/>
        <Route path='register' element={<RegistrationPage/>}/>
        {/* <Route path='main' element={<MainContent/>}/> */}
        <Route path='*' element={<TestPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
