import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function LiveStream() {
  const [roomId, setRoomId] = useState("");
  const [role, setRole] = useState("host");
  const [notification, setNotification] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoomIds = JSON.parse(localStorage.getItem("roomIds")) || [];
    if (storedRoomIds.length > 0) {
      setNotification(
        `يوجد بث مباشر حاليًا برقم الغرفة: ${
          storedRoomIds[storedRoomIds.length - 1]
        }`
      );
    }
  }, []);

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString().substring(-4);
    const newRoomId = randomId + timestamp;
    setRoomId(newRoomId);

    // Get existing room IDs from local storage
    const storedRoomIds = JSON.parse(localStorage.getItem("roomIds")) || [];
    storedRoomIds.push(newRoomId);

    // Store updated room IDs in local storage
    localStorage.setItem("roomIds", JSON.stringify(storedRoomIds));
  };

  const handleCall = () => {
    if (!roomId) {
      alert("يرجى انشاء رقم الغرفة أولاً");
      return;
    }
    navigate(`room/${roomId}?role=${role}`);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    alert("تمت عملية الدفع بنجاح!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#ce1126] mb-4">
          مرحبًا في تطبيق المكالمات المرئية
        </h1>
        <p className="text-gray-600 mb-6">
          ابدأ مكالمة فيديو باستخدام رقم غرفة تم إنشاؤه عشوائيًا
        </p>
        {notification && (
          <div className="bg-[#007a3d] text-white p-4 rounded-lg mb-4">
            {notification}
          </div>
        )}
        {!paymentSuccess && (
          <div className="mb-6">
            <p className="text-gray-800 mb-4">سعر البث المباشر: $500</p>
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "pill",
                  label: "pay",
                  height: 40,
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: "500.00",
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  setPaymentLoading(true);
                  return actions.order.capture().then((details) => {
                    setPaymentLoading(false);
                    console.log(
                      "الصفقة تمت بنجاح من قبل " + details.payer.name.given_name
                    );
                    handlePaymentSuccess();
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}
        {paymentSuccess && (
          <>
            <div className="flex items-center mb-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg mr-2"
                placeholder="رقم الغرفة المولد"
                value={roomId}
                readOnly
              />
              <button
                className="bg-gradient-to-r from-black via-[#007a3d] to-[#007a3d] text-white px-4 py-2 rounded-lg hover:bg-[#a00e1d] transition"
                onClick={handleRoomIdGenerate}
              >
                انشاء
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <button
                className="bg-[#007a3d] text-white px-6 py-2 rounded-lg hover:bg-[#005c43] transition"
                onClick={handleCall}
                disabled={!roomId}
              >
                بدء المكالمة
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LiveStream;
