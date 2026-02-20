import { useState } from "react";
import { sendOtp } from "../api/authRoutes";
import { useNavigate, Link } from "react-router-dom";
import { successToast, errorToast } from "../utils/toast";
import Button from "../components/Button";

const style = {

    wrapper:
        "min-h-screen flex items-center justify-center bg-black px-4",

    card:
        "w-full max-w-sm sm:max-w-md bg-gray-900 border border-gray-800 shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8",

    title:
        "text-xl sm:text-2xl font-semibold text-center mb-5 sm:mb-6 text-white",

    form:
        "space-y-3 sm:space-y-4",

    input:
        "w-full bg-black border border-gray-700 text-white placeholder-gray-500 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:border-gray-500 transition text-sm sm:text-base",

    footer:
        "text-xs sm:text-sm text-center mt-4 sm:mt-5 text-gray-400",

    link:
        "text-white font-medium hover:text-gray-300 transition"

};

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await sendOtp({
                email: formData.email
            });

            successToast("OTP sent to your email");

            navigate("/verify-otp", {
                state: formData
            });

        } catch (error) {

            errorToast(
                error.message ||
                error.response?.data?.message ||
                "Failed to send OTP"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className={style.wrapper}>

            <div className={style.card}>

                <h2 className={style.title}>
                    Create Account
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className={style.form}
                >

                    <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                        className={style.input}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className={style.input}
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className={style.input}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending OTP..."
                            : "Send OTP"}
                    </Button>

                </form>

                <p className={style.footer}>

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className={style.link}
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

};

export default Signup;