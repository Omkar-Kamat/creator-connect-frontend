import { useEffect, useState } from "react";
import { getPlans, createOrder } from "../api/paymentRoutes";
import { successToast, errorToast } from "../utils/toast";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { getCurrentUser } from "../api/authRoutes";

const style = {
    wrapper: "min-h-screen bg-black text-white px-6 py-10",
    title: "text-3xl font-bold mb-10",
    grid: "grid md:grid-cols-3 gap-8",
    card: "bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-600 transition",
    name: "text-xl font-semibold mb-2",
    price: "text-3xl font-bold mb-4",
    tokenInfo: "text-gray-400 mb-6",
    button: "bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition",
};

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await getPlans();
            setPlans(data);
        } catch (err) {
            errorToast("Failed to load plans");
            console.log(err);
        }
    };

    const handleBuy = async (planKey) => {
        try {
            setLoading(true);

            const currentUser = await getCurrentUser();
            const initialTokens = currentUser.tokens;

            const order = await createOrder(planKey);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "CreatorConnect",
                description: "Token Purchase",
                order_id: order.id,
                handler: async function () {
                    successToast("Payment successful. Processing payment...");

                    const maxAttempts = 15;
                    let attempts = 0;

                    const interval = setInterval(async () => {
                        attempts++;

                        try {
                            const updatedUser = await getCurrentUser();

                            if (updatedUser.tokens > initialTokens) {
                                clearInterval(interval);
                                dispatch(setUser(updatedUser));
                                successToast("Tokens added successfully");
                            }

                            if (attempts >= maxAttempts) {
                                clearInterval(interval);
                                errorToast(
                                    "Payment processing delayed. Please refresh.",
                                );
                            }
                        } catch (err) {
                            clearInterval(interval);
                            console.log(err);
                            errorToast("Failed to verify payment.");
                        }
                    }, 2000);
                },
                theme: {
                    color: "#000000",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            errorToast("Payment failed");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Choose Your Plan</h1>

            <div className={style.grid}>
                {plans.map((plan) => (
                    <div key={plan._id} className={style.card}>
                        <div>
                            <div className={style.name}>{plan.name}</div>
                            <div className={style.price}>
                                ₹{plan.price / 100}
                            </div>
                            <div className={style.tokenInfo}>
                                {plan.tokens + plan.bonusTokens} Tokens
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            onClick={() => handleBuy(plan.key)}
                            className={style.button}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
