import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Templates } from './pages/Templates';
import { TemplateEditor } from './pages/TemplateEditor';
import { DistributionLists } from './pages/DistributionLists';
import { DistributionListEditor } from './pages/DistributionListEditor';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';

function App() {
  return (
    <BrowserRouter basename="/manager">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/new" element={<TemplateEditor />} />
          <Route path="/templates/:id" element={<TemplateEditor />} />
          <Route path="/distribution-lists" element={<DistributionLists />} />
          <Route path="/distribution-lists/new" element={<DistributionListEditor />} />
          <Route path="/distribution-lists/:id" element={<DistributionListEditor />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

