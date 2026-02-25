import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrackPage from './pages/TrackPage'
import AlbumPage from './pages/AlbumPage'
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/track/:id" element={<TrackPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
