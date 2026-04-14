import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/slices/adminProductSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      setUploading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formDataImg,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          {
            url: data.imageUrl,
            altText: "",
          },
        ],
      }));

      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createProduct({
        ...formData,

        price: Number(formData.price) || 0,
        countInStock: Number(formData.countInStock) || 0,

        sizes: formData.sizes
          ? formData.sizes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : ["M"],

        colors: formData.colors
          ? formData.colors
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : ["Black"],

        collections: formData.collections || "",

        images: formData.images,
      }),
    )
      .unwrap()
      .then(() => navigate("/admin/products"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        🛍️ Create Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-2xl space-y-10"
      >
        {/* Basic Info */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Basic Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" placeholder="Product Name" onChange={handleChange} />
            <input name="price" type="number" placeholder="Price" onChange={handleChange} />
            <input name="countInStock" type="number" placeholder="Stock" onChange={handleChange} />
            <input name="sku" placeholder="SKU" onChange={handleChange} />
          </div>

          <textarea
            name="description"
            placeholder="Product Description"
            onChange={handleChange}
            className="w-full mt-4 p-3 rounded-xl border border-gray-200 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Details */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="category" placeholder="Category" onChange={handleChange} />
            <input name="brand" placeholder="Brand" onChange={handleChange} />
            <input name="material" placeholder="Material" onChange={handleChange} />
            <input name="collections" placeholder="Collection" onChange={handleChange} />

            <input name="sizes" placeholder="Sizes (S,M,L)" onChange={handleChange} />
            <input name="colors" placeholder="Colors (Red,Blue)" onChange={handleChange} />

            <select
              name="gender"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Product Images
          </h3>

          <label className="cursor-pointer inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition">
            Upload Image
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {uploading && (
            <p className="mt-3 text-sm text-gray-500">Uploading...</p>
          )}

          <div className="flex gap-4 mt-6 flex-wrap">
            {(formData.images || []).map((img, index) => (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden shadow-md"
              >
                <img
                  src={img?.url}
                  alt="preview"
                  className="w-24 h-24 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-2xl text-lg font-semibold shadow-lg hover:scale-[1.02] transition">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProduct;
