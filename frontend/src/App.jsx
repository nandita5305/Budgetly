import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home'; 
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardPage from './components/Dashboard/pages/DashboardPage';
import ExpensesPage from './components/Dashboard/pages/ExpensesPage';
import TransactionsPage from './components/Dashboard/pages/TransactionsPage';
import AnalyticsPage from './components/Dashboard/pages/AnalyticsPage';
import SettingsPage from './components/Dashboard/pages/SettingsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* The Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
