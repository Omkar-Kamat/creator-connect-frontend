import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectRoute";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";
import VerifyOtp from "./pages/VerifyOtp";
import CreateAsset from "./pages/CreateAsset";
import MyAssets from "./pages/MyAssets";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Plans from "./pages/Plans";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "./store/slices/authSlice";
import { getCurrentUser } from "./api/authRoutes";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("App mounted");
        const restoreSession = async () => {
            try {
                const user = await getCurrentUser();
                console.log("User fetched:", user);
                dispatch(setUser(user));
            } catch (error) {
                console.log("No user session", error);
                dispatch(setUser(null));
            } finally {
                dispatch(setLoading(false)); 
            }
        };

        restoreSession();
    }, [dispatch]);

    return (
        <BrowserRouter>
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
                    <Route path="/messages" element={<Inbox />} />
                    <Route path="/chat/:conversationId" element={<Chat />} />
                    <Route path="/plans" element={<Plans />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
