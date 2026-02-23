import { useNavigate } from "react-router-dom";
import { createConversation } from "../api/messageRoutes";

const style = {
    base: "group relative w-full rounded-2xl overflow-hidden border border-gray-800 bg-black transition-all duration-300 hover:border-gray-600 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)] cursor-pointer",

    mediaWrapper:
        "relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden",

    media: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",

    overlay:
        "absolute inset-0 bg-black/30 group-hover:bg-black/70 transition-all duration-300",

    infoContainer: "absolute inset-0 flex flex-col justify-end p-4 sm:p-5",

    infoContent:
        "transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",

    title: "text-white font-semibold text-base sm:text-lg leading-tight text-left",

    subtitle: "text-gray-300 text-xs sm:text-sm mt-1 text-left",

    author: "text-gray-400 text-xs sm:text-sm mt-1 text-left",

    messageButton:
        "mt-3 inline-block bg-white text-black text-xs sm:text-sm px-3 py-1.5 rounded-lg hover:bg-gray-200 transition",
};

const Card = ({ media, title, subtitle, author, ownerId, onClick }) => {
    const navigate = useNavigate();

    const handleMessageClick = async (e) => {
        e.stopPropagation();

        try {
            const conversation = await createConversation(ownerId);

            navigate(`/chat/${conversation._id}`);
        } catch (error) {
            console.error("Failed to create conversation");
            console.error(error);
        }
    };

    return (
        <div onClick={onClick} className={style.base}>
            <div className={style.mediaWrapper}>
                {media}

                <div className={style.overlay} />

                <div className={style.infoContainer}>
                    <div className={style.infoContent}>
                        <h3 className={style.title}>{title}</h3>

                        {subtitle && (
                            <p className={style.subtitle}>{subtitle}</p>
                        )}

                        {author && <p className={style.author}>{author}</p>}

                        <button
                            onClick={handleMessageClick}
                            className={style.messageButton}
                        >
                            Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
