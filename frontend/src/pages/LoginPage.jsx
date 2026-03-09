import GoogleLoginButton from "../components/GoogleLoginButton";
import { Container, Typography, Paper } from "@mui/material";

function Login({ setUser }) {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "var(--bg-color)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to wavRater
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Sign in to rate your favorite music
        </Typography>

        <GoogleLoginButton setUser={setUser} />
      </Paper>
    </Container>
  );
}

export default Login;
