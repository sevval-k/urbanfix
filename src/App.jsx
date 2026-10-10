import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import IssuesPage from './pages/IssuesPage'
import MapPage from './pages/MapPage'
import AnalysisPage from './pages/AnalysisPage'
import DataPage from './pages/DataPage'
import NewIssuePage from './pages/NewIssuePage'
import EditIssuePage from './pages/EditIssuePage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="issues" element={<IssuesPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="data" element={<DataPage />} />
        <Route path="issues/new" element={<NewIssuePage />} />
        <Route path="issues/:id/edit" element={<EditIssuePage />} />
      </Route>
    </Routes>
  )
}