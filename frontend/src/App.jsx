import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrackPage from './pages/TrackPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/track/:id" element={<TrackPage />} />
    </Routes>
  );
}

export default App;
