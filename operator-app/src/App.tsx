import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DispatchFlow } from './pages/DispatchFlow';
import { DispatchHistory } from './pages/DispatchHistory';
import { DispatchDetails } from './pages/DispatchDetails';

function App() {
  return (
    <BrowserRouter basename="/operator">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dispatch/:templateId" element={<DispatchFlow />} />
          <Route path="/history" element={<DispatchHistory />} />
          <Route path="/history/:eventId" element={<DispatchDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

