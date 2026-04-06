import React, { useEffect, useState } from "react";
import Hero from "../Components/Layout/Hero";
import GenderCollectionSection from "../Components/Products/GenderCollectionSection";
import NewArrivals from "../Components/Products/NewArrivals";
import ProductDetails from "../Components/Products/ProductDetails";
import ProductGrid from "../Components/Products/ProductGrid";
import FeaturedCollection from "../Components/Products/FeaturedCollection";
import FeaturesSection from "../Components/Products/FeaturesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerproduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    //Fetch Prducts for a specific Collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      }),
    );
    //Fetch Best seller products
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller()
  },[dispatch]);


  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerproduct ? (<ProductDetails productId={bestSellerproduct._id } />) : (
        <p className="text-center">Loading Best seller products ...</p>
      )}
      

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
