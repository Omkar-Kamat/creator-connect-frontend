import { useState } from "react";
import { createAsset } from "../api/assetRoutes";
import { successToast, errorToast } from "../utils/toast";
import Button from "../components/Button";

const style = {

    wrapper:
        "w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8",

    title:
        "text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-white",

    label:
        "block mb-1 font-medium text-gray-300 text-sm sm:text-base",

    input:
        "w-full bg-black border border-gray-700 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:border-gray-500 text-sm sm:text-base",

    textarea:
        "w-full bg-black border border-gray-700 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:border-gray-500 text-sm sm:text-base resize-none",

    select:
        "bg-black border border-gray-700 text-white rounded-lg px-3 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base",

    dropzone:
        "border-2 border-dashed border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-gray-500 transition text-gray-400 text-sm sm:text-base",

    browse:
        "text-white font-medium cursor-pointer hover:text-gray-300",

    previewLabel:
        "font-medium mb-2 text-white text-sm sm:text-base",

    remove:
        "text-gray-400 text-xs sm:text-sm mt-2 hover:text-white",

    overlay:
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",

    overlayCard:
        "bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-md text-center",

    progressBg:
        "w-full bg-black border border-gray-700 rounded-full h-2 sm:h-3 overflow-hidden",

    progressBar:
        "h-full bg-white transition-all duration-300",

    progressText:
        "text-xs sm:text-sm text-gray-400 mt-2"

};

const CreateAsset = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [visibility, setVisibility] = useState("public");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (selectedFile) => {

        if (!selectedFile) return;

        if (
            !selectedFile.type.startsWith("image/") &&
            !selectedFile.type.startsWith("video/")
        ) {
            errorToast("Only image or video files allowed");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));

    };

    const handleDrop = (e) => {

        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];

        handleFileChange(droppedFile);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        if (!file) {
            errorToast("Please select a file");
            return;
        }

        setLoading(true);
        setProgress(0);

        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("visibility", visibility);
        formData.append("file", file);

        const interval = setInterval(() => {
            setProgress(prev => prev >= 90 ? prev : prev + 10);
        }, 200);

        try {

            await createAsset(formData);

            setProgress(100);

            successToast("Asset uploaded successfully");

            setTitle("");
            setDescription("");
            setFile(null);
            setPreview(null);
            setVisibility("public");

        } catch (error) {

            errorToast(
                error.message ||
                error.response?.data?.message ||
                "Upload failed"
            );

        } finally {

            clearInterval(interval);

            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 500);

        }

    };

    return (

        <>

            {loading && (

                <div className={style.overlay}>

                    <div className={style.overlayCard}>

                        <p className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                            Uploading Asset...
                        </p>

                        <div className={style.progressBg}>
                            <div
                                className={style.progressBar}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className={style.progressText}>
                            {progress}%
                        </p>

                    </div>

                </div>

            )}

            <div className={style.wrapper}>

                <h2 className={style.title}>
                    Upload New Asset
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className={`space-y-4 sm:space-y-6 ${
                        loading
                            ? "pointer-events-none opacity-60"
                            : ""
                    }`}
                >

                    <div>

                        <label className={style.label}>
                            Title
                        </label>

                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                            className={style.input}
                        />

                    </div>

                    <div>

                        <label className={style.label}>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows="3"
                            className={style.textarea}
                        />

                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                        <label className={style.label}>
                            Visibility
                        </label>

                        <select
                            value={visibility}
                            onChange={(e) =>
                                setVisibility(e.target.value)
                            }
                            className={style.select}
                        >

                            <option value="public">
                                Public
                            </option>

                            <option value="private">
                                Private
                            </option>

                        </select>

                    </div>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) =>
                            e.preventDefault()
                        }
                        className={style.dropzone}
                    >

                        <p>
                            Drag & Drop image or video here
                        </p>

                        <p className="text-xs sm:text-sm mt-2">
                            or
                        </p>

                        <label className={style.browse}>

                            Browse Files

                            <input
                                type="file"
                                accept="image/*,video/*"
                                hidden
                                onChange={(e) =>
                                    handleFileChange(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </label>

                    </div>

                    {preview && (

                        <div>

                            <p className={style.previewLabel}>
                                Preview
                            </p>

                            {file.type.startsWith("image/")
                                ? (
                                    <img
                                        src={preview}
                                        className="rounded-lg max-h-40 sm:max-h-60 object-contain mx-auto"
                                    />
                                )
                                : (
                                    <video
                                        src={preview}
                                        controls
                                        className="rounded-lg max-h-40 sm:max-h-60 mx-auto"
                                    />
                                )
                            }

                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className={style.remove}
                            >
                                Remove File
                            </button>

                        </div>

                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        Upload Asset
                    </Button>

                </form>

            </div>

        </>

    );

};

export default CreateAsset;