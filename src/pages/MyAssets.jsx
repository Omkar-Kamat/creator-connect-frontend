import { useEffect } from "react";
import { getMyAssets } from "../api/assetRoutes";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setMyAssets } from "../store/slices/assetSlice";

const style = {
    title: "text-3xl font-bold mb-6 text-white",

    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6",

    empty: "text-gray-400",

    loading: "text-gray-400",
};

const MyAssets = () => {

    const dispatch = useDispatch();

    const assets = useSelector(state => state.asset.myAssets);
    const loading = useSelector(state => state.asset.loading);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        dispatch(setLoading(true))
        try {
            const data = await getMyAssets({
                page: 1,
            });

            dispatch(setMyAssets(data.assets));
        } catch (error) {
            console.error("Failed to fetch assets:", error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (loading) {
        return <div className={style.loading}>Loading assets...</div>;
    }

    return (
        <>
            <h2 className={style.title}>My Assets</h2>

            {assets.length === 0 ? (
                <div className={style.empty}>No assets found</div>
            ) : (
                <div className={style.grid}>
                    {assets.map((asset) => (
                        <Card
                            media={
                                asset.type === "image" ? (
                                    <img
                                        src={asset.url}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={asset.url}
                                        className="w-full h-full object-cover"
                                        muted
                                    />
                                )
                            }
                            title={asset.title}
                            subtitle={asset.description}
                            author={`By ${asset.owner?.name}`}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default MyAssets;
