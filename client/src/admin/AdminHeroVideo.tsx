import { useState, useEffect } from "react";
import { Upload, Video, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import API from "../utils/api";

const AdminHeroVideo = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCurrentVideo();
  }, []);

  const fetchCurrentVideo = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/settings/hero-video");
      if (response.data.success && response.data.heroVideo) {
        setCurrentVideo(response.data.heroVideo);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setMessage({ type: "error", text: "Please select a valid video file" });
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: "error", text: "Video file must be less than 100MB" });
      return;
    }

    setVideoFile(file);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setMessage({ type: "error", text: "Please select a video file first" });
      return;
    }

    try {
      setUploading(true);
      setMessage(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await API.post("/api/settings/hero-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setMessage({ type: "success", text: "Hero video uploaded successfully!" });
        setCurrentVideo(response.data.heroVideo);
        setVideoFile(null);
        // Reset file input
        const fileInput = document.getElementById("video-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload video",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the hero video?")) return;

    try {
      setLoading(true);
      const response = await API.delete("/api/settings/hero-video");

      if (response.data.success) {
        setMessage({ type: "success", text: "Hero video deleted successfully" });
        setCurrentVideo("");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete video",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif text-[#1A1A1A]">Hero Video Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload and manage the homepage hero background video
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Current Video Preview */}
      {currentVideo && (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#1A1A1A]">Current Hero Video</h2>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete Video
            </button>
          </div>
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={currentVideo}
              controls
              className="w-full h-full object-cover"
              poster="/women-hero.png"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">{currentVideo}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">
          {currentVideo ? "Replace Hero Video" : "Upload Hero Video"}
        </h2>

        {/* File Input */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:border-[#C5A059]/50 transition-colors text-center">
            <input
              id="video-input"
              type="file"
              accept="video/mp4,video/webm,video/mov,video/avi"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="video-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to select video file
              </p>
              <p className="text-xs text-gray-500">
                MP4, WebM, MOV up to 100MB
              </p>
            </label>
          </div>

          {/* Selected File Info */}
          {videoFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVideoFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#C5A059] h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!videoFile || uploading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white text-sm font-medium hover:bg-[#333] transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Video
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> The video will be uploaded to Cloudinary and automatically
            displayed on the homepage. For best results, use landscape videos with a 16:9
            aspect ratio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroVideo;
