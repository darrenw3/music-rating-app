import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import searchRoutes from './routes/search.js';
import trackRoutes from './routes/tracks.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/search",searchRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
