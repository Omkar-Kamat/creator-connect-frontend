import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../api/authRoutes";
import { useAuth } from "../context/AuthContext";
import { successToast, errorToast } from "../utils/toast";
import Button from "../components/Button";

const style = {

    wrapper:
        "min-h-screen flex items-center justify-center bg-black px-4",

    card:
        "w-full max-w-sm sm:max-w-md bg-gray-900 border border-gray-800 shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8",

    title:
        "text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-white",

    form:
        "space-y-4",

    input:
        "w-full bg-black border border-gray-700 text-white placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:border-gray-500 transition text-sm sm:text-base text-center tracking-widest",

    footer:
        "text-xs sm:text-sm text-center mt-4 sm:mt-5 text-gray-400",

    link:
        "text-white font-medium hover:text-gray-300 transition"

};

const VerifyOtp = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const formData = location.state;

    useEffect(() => {

        if (!formData) {
            navigate("/signup", { replace: true });
        }

    }, [formData, navigate]);

    if (!formData) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!otp) {
            errorToast("Please enter OTP");
            return;
        }

        setLoading(true);

        try {

            const data = await verifyOtp({
                ...formData,
                otp
            });

            setUser(data);

            successToast("Account created successfully");

            navigate("/dashboard");

        } catch (error) {

            errorToast(
                error.message ||
                error.response?.data?.message ||
                "Verification failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className={style.wrapper}>

            <div className={style.card}>

                <h2 className={style.title}>
                    Verify OTP
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className={style.form}
                >

                    <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        placeholder="Enter 6-digit OTP"
                        className={style.input}
                        maxLength={6}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </Button>

                </form>

                <p className={style.footer}>

                    Didn’t receive OTP?{" "}

                    <Link
                        to="/signup"
                        className={style.link}
                    >
                        Try again
                    </Link>

                </p>

            </div>

        </div>

    );

};

export default VerifyOtp;