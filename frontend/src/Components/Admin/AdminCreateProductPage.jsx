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

        // ✅ THIS IS THE CORRECT LINE
        images: formData.images,
      }),
    )
      .unwrap()
      .then(() => navigate("/admin/products"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Create Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow"
      >
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="input"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="input md:col-span-2"
        />

        <input
          name="countInStock"
          type="number"
          placeholder="Stock"
          onChange={handleChange}
          className="input"
        />

        <input
          name="sku"
          placeholder="SKU"
          onChange={handleChange}
          className="input"
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          className="input"
        />

        <input
          name="brand"
          placeholder="Brand"
          onChange={handleChange}
          className="input"
        />

        <input
          name="sizes"
          placeholder="Sizes (S,M,L)"
          onChange={handleChange}
          className="input"
        />

        <input
          name="colors"
          placeholder="Colors (Red,Blue)"
          onChange={handleChange}
          className="input"
        />

        <input
          name="collections"
          placeholder="Collections"
          onChange={handleChange}
          className="input"
        />

        <input
          name="material"
          placeholder="Material"
          onChange={handleChange}
          className="input"
        />

        <select name="gender" onChange={handleChange} className="input">
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>

        <input type="file" onChange={handleImageUpload} />

        {uploading && <p>Uploading...</p>}

        <div className="flex gap-3 mt-3">
          {formData.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AdminCreateProduct;
