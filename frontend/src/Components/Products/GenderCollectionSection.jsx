import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GenderCollectionSection = () => {
  
  const { content } = useSelector((state) => state.siteContent);


  return (
    <section className=" py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8 ">
        {/* womens collection */}
        <div className="relative flex-1 ">
          <img
            src={
              content?.womenCollectionBanner ||
              "/images/womenCollectionBanner-fallback.jpg"
            }
            alt="Women's collecction"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/* Men's collection */}
        <div className="relative flex-1 ">
          <img
            src={
              content?.menCollectionBanner ||
              "/images/menCollectionBanner-fallback.jpg"
            }
            alt="Men's collecction"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
