
import './App.css'
import Dashboard from './Dashboard/Dashboard';
import Events from './Dashboard/Events/Events';
import Friends from './Dashboard/Friends/Friends';
import Home from './Dashboard/Profile/Home';
import Settings from './Dashboard/Settings/Settings';

import Login from './Login/Login'
import Register from './Register/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>

        {/* Авторизация и регистрация — вне Dashboard */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Основной интерфейс — в Dashboard*/}

        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="friends" element={<Friends />} />
          <Route path="events" element={<Events />} />
          <Route path="settings" element={<Settings />} /> 
        </Route> 

        {/* TODO: можно добавить NotFound */}
      </Routes>
    </Router>
  );
}
export default App
