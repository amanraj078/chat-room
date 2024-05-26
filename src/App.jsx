import "./App.css";
import LoginPage from "./pages/LoginPage";
import Room from "./pages/Room";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import RegisterPage from "./pages/RegisterPage";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Room />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
