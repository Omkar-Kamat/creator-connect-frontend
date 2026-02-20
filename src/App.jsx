import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectRoute";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import VerifyOtp from "./pages/VerifyOtp";
import CreateAsset from "./pages/CreateAsset";
import MyAssets from "./pages/MyAssets";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster
                    position="bottom-left"
                    toastOptions={{
                        style: {
                            background: "#111",
                            color: "#fff",
                            border: "1px solid #333",
                        },
                    }}
                />

                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    <Route path="/signup" element={<Signup />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/verify-otp" element={<VerifyOtp />} />

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route path="/create-asset" element={<CreateAsset />} />

                        <Route path="/my-assets" element={<MyAssets />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
