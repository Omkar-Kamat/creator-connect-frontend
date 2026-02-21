import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const style = {
    wrapper: "min-h-screen flex items-center justify-center bg-black",

    text: "text-gray-400 text-lg",
};

const ProtectedRoute = ({ children }) => {

    const {user, loading} = useSelector(state => state.auth)

    if (loading) {
        return (
            <div className={style.wrapper}>
                <p className={style.text}>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
