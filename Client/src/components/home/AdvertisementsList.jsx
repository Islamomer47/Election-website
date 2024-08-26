import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const AdvertisementsList = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/advertisements-active"
        );
        setAdvertisements(response.data);
      } catch (error) {
        console.error("خطأ في جلب الإعلانات:", error);
      }
    };

    fetchAdvertisements();
  }, []);

  const getCardStyle = (design_type) => {
    return design_type === "circle" ? "rounded-3xl" : "rounded-lg";
  };

  const handlePrevClick = () => {
    const slider = document.querySelector(".slider");
    slider.scrollBy({
      left: -slider.offsetWidth / 3,
      behavior: "smooth",
    });
  };

  const handleNextClick = () => {
    const slider = document.querySelector(".slider");
    slider.scrollBy({
      left: slider.offsetWidth / 3,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-4 mb-10" style={{ direction: "rtl" }}>
      {isAuthenticated ? (
        <div className="max-w-[84rem] mx-auto relative">
          <h2 className="text-2xl font-bold text-center mb-6">الإعلانات</h2>
          {advertisements.length > 0 ? (
            <div className="relative">
              <button
                onClick={handlePrevClick}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg shadow-lg z-10"
                style={{ left: "10px" }}
              >
                &#10095;
              </button>
              <div className="slider flex overflow-hidden">
                <div
                  className="flex"
                  style={{
                    width: `${
                      advertisements.length * 100 + advertisements.length * 20
                    }vw`, // Adjust width for card margin
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {advertisements.map((ad) => (
                    <div
                      key={ad.ad_id}
                      className={`p-4 flex-shrink-0 w-full max-w-md mx-auto shadow-lg flex flex-col items-center ${getCardStyle(
                        ad.design_type
                      )}`}
                      style={{
                        backgroundColor: ad.color_card,
                        border: `2px ${ad.border_type} ${ad.color_border}`,
                        color: ad.color_font,
                        textAlign: "center",
                        borderRadius:
                          ad.design_type === "circle" ? "50%" : "8px",
                        boxSizing: "border-box",
                        scrollSnapAlign: "center",
                        marginRight: "20px", // Add space between cards
                      }}
                    >
                      {ad.personal_image && (
                        <img
                          src={ad.personal_image}
                          alt="إعلان"
                          className={`w-full ${
                            ad.design_type === "circle"
                              ? "h-56 w-56 rounded-full"
                              : "h-40 object-cover rounded-lg"
                          } mb-4`}
                        />
                      )}
                      <h3 className="text-lg font-semibold mb-2">{ad.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">
                        الشعار الانتخابي: {ad.election_slogan}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        الوصف: {ad.description}
                      </p>
                      {/* <p className="text-gray-600 text-sm">
                        مبلغ الدفع: {ad.total_amount}
                      </p> */}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNextClick}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-r-lg shadow-lg z-10"
                style={{ right: "10px" }}
              >
                &#10094;
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-600">لا توجد إعلانات متاحة.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          يرجى تسجيل الدخول لعرض الإعلانات.
        </p>
      )}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Webkit browsers */
          }

          .no-scrollbar {
            -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
          }
        `}
      </style>
    </div>
  );
};

export default AdvertisementsList;
