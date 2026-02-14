import { Route, Routes } from 'react-router-dom'
import SearchPage from './HomePage'
import TrackPage from './TrackPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/track/:id" element={<TrackPage />} />
    </Routes>
  );
}

export default App;
