import { useEffect } from "react";
import { getPublicAssets } from "../api/assetRoutes";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setPublicAssets } from "../store/slices/assetSlice";

const style = {

    title:
        "text-3xl font-bold mb-6 text-white",

    grid:
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",

    empty:
        "text-gray-400",

    loading:
        "text-gray-400"

};

const Dashboard = () => {

    const dispatch = useDispatch();

    const assets = useSelector(state => state.asset.publicAssets);
    const loading = useSelector(state => state.asset.loading);
    
    useEffect(() => {

        fetchAssets();

    }, []);

    const fetchAssets = async () => {
        dispatch(setLoading(true));
        try {

            const data = await getPublicAssets({
                page: 1
            });

            dispatch(setPublicAssets(data.assets));

        } catch (error) {

            console.error(
                "Failed to fetch public assets:",
                error
            );

        } finally {

            dispatch(setLoading(false));

        }

    };

    if (loading) {

        return (
            <div className={style.loading}>
                Loading assets...
            </div>
        );

    }

    return (

        <>

            <h2 className={style.title}>
                Explore Public Assets
            </h2>

            {assets.length === 0 ? (

                <div className={style.empty}>
                    No public assets found
                </div>

            ) : (

                <div className={style.grid}>

                    {assets.map(asset => (

                        <Card
                            key={asset._id}

                            media={
                                asset.type === "image"
                                    ? (
                                        <img
                                            src={asset.url}
                                            alt={asset.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                    : (
                                        <video
                                            src={asset.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                    )
                            }

                            title={asset.title}

                            subtitle={
                                asset.description ||
                                "No description"
                            }

                            author={
                                asset.owner?.name
                                    ? `By ${asset.owner.name}`
                                    : "Unknown author"
                            }

                        />

                    ))}

                </div>

            )}

        </>

    );

};

export default Dashboard;