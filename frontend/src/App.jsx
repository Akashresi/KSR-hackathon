import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import './styles/main.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
                    <NavLink to="/alerts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Alert History</NavLink>
                    <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Settings</NavLink>
                </nav>

                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
