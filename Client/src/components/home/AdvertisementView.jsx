import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdvertisementView = () => {
  const [advertisement, setAdvertisement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { id } = useParams(); // Extract ID from URL params

  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/advertisements/${id}`
        );
        setAdvertisement(response.data);
      } catch (error) {
        setError("Error fetching advertisement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 mb-10" style={{ direction: "rtl" }}>
      {isAuthenticated ? (
        <div className="max-w-6xl mx-auto">
          {advertisement ? (
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
              {advertisement.image && (
                <img
                  src={advertisement.image}
                  alt="Advertisement"
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-2xl font-bold mb-2 text-center">
                {advertisement.content}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                تاريخ البدء:{" "}
                {new Date(advertisement.start_date).toLocaleDateString("ar-SA")}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                تاريخ الانتهاء:{" "}
                {new Date(advertisement.end_date).toLocaleDateString("ar-SA")}
              </p>
              <p className="text-gray-600 text-sm">
                مبلغ الدفع: {advertisement.payment_amount}
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-600">الإعلان غير موجود.</p>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          يرجى تسجيل الدخول لعرض تفاصيل الإعلان.
        </p>
      )}
    </div>
  );
};

export default AdvertisementView;
