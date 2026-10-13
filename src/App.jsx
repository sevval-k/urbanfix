import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// lazy() loads each page's code the first time that route is visited.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const IssuesPage = lazy(() => import('./pages/IssuesPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
const DataPage = lazy(() => import('./pages/DataPage'))
const NewIssuePage = lazy(() => import('./pages/NewIssuePage'))
const EditIssuePage = lazy(() => import('./pages/EditIssuePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}