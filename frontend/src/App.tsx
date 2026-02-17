import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Login } from './pages/Login';
import { Map } from './pages/Map';
import { Vacations } from './pages/Vacations';
import { Timeline } from './pages/Timeline';
import { Score } from './pages/Score';
import { Wishlist } from './pages/Wishlist';
import { Settings } from './pages/Settings';
import { Checkin } from './pages/Checkin';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<Map />} />
          <Route path="/vacations" element={<Vacations />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/score" element={<Score />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkin" element={<Checkin />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
