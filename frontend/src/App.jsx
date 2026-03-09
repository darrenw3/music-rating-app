import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TrackPage from './pages/TrackPage'
import AlbumPage from './pages/AlbumPage'
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { userId, name, img, exp } = jwtDecode(token);
      if (exp * 1000 > Date.now()) {
        setUser({ userId, name, img });
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, []);

  const hideNavarPaths = ["/login"];
  const showNavbar = !hideNavarPaths.includes(location.pathname);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {showNavbar && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/track/:id" element={<TrackPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
