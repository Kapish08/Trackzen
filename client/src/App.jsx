import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { useSelector } from 'react-redux';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Team from './pages/Team';
import SharedGoals from './pages/SharedGoals';
import CheckIns from './pages/CheckIns';
import AuditLog from './pages/AuditLog';
import LandingPage from './pages/LandingPage';
import Notification from './pages/Notification';

import Layout from './layouts/Layout';

function App() {

  const { user } = useSelector(
    (state) => state.auth
  );

  return (
    <Router>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={
            !user
              ? <Login />
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/register"
          element={
            !user
              ? <Register />
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/notifications"
          element={
            user
              ? (
                  <Layout>
                    <Notifications />
                  </Layout>
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />
        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            user
              ? (
                <Layout>
                  <Dashboard />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/goals"
          element={
            user
              ? (
                <Layout>
                  <Goals />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/team"
          element={
            user
              ? (
                <Layout>
                  <Team />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/checkins"
          element={
            user
              ? (
                <Layout>
                  <CheckIns />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        {/* MANAGER / ADMIN */}

        <Route
          path="/shared-goals"
          element={
            user &&
            user.role !== 'Employee'
              ? (
                <Layout>
                  <SharedGoals />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        {/* ADMIN ONLY */}

        <Route
          path="/audit"
          element={
            user &&
            user.role === 'Admin'
              ? (
                <Layout>
                  <AuditLog />
                </Layout>
              )
              : <Navigate to="/login" />
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </Router>
  );
}

export default App;