import { useDispatch, useSelector } from "react-redux";
import { updateSiteContent } from "../../redux/slices/siteContentSlice";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminSiteContent = () => {
  const dispatch = useDispatch();
  const { content } = useSelector((state) => state.siteContent);

  const [formData, setFormData] = useState({
    homeBanner: "",
    loginBanner: "",
    registerBanner: "",
    featuredCollectionBanner: "",
    menCollectionBanner: "",
    womenCollectionBanner: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        homeBanner: content.homeBanner || "",
        loginBanner: content.loginBanner || "",
        registerBanner: content.registerBanner || "",
        featuredCollectionBanner: content.featuredCollectionBanner || "",
        menCollectionBanner: content.menCollectionBanner || "",
        womenCollectionBanner: content.womenCollectionBanner || "",
      });
    }
  }, [content]);

  // Upload handler
  const uploadHandler = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
      formData,
    );
    return data.imageUrl;
  };

  // Handle file change
  const handleImageChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const url = await uploadHandler(file);

    setFormData((prev) => ({
      ...prev,
      [field]: url,
    }));
    setLoading(false);
  };

  // Save all banners
  const handleSave = () => {
    dispatch(updateSiteContent(formData));
  };

  // Reusable Card
  const renderCard = (title, field) => (
    <div className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>

      <label className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
        Upload Image
        <input
          type="file"
          onChange={(e) => handleImageChange(e, field)}
          className="hidden"
        />
      </label>

      {formData[field] && (
        <div className="mt-4">
          <img
            src={formData[field]}
            alt={title}
            className="w-full h-40 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🎨 Manage Site Banners
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderCard("Home Banner", "homeBanner")}
        {renderCard("Login Banner", "loginBanner")}
        {renderCard("Register Banner", "registerBanner")}
        {renderCard("Featured Banner", "featuredCollectionBanner")}
        {renderCard("Men Collection Banner", "menCollectionBanner")}
        {renderCard("Women Collection Banner", "womenCollectionBanner")}
      </div>

      {/* Save Button */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminSiteContent;
