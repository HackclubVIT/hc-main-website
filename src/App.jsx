import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectsPage from './pages/projects/ProjectsPage'
import './index.css'
import CustomCursor from './components/CustomCursor'

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        {/* Your teammates add their routes here */}
      </Routes>
    </BrowserRouter>
  )
}