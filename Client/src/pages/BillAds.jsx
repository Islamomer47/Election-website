import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Load Stripe outside of a component’s render to avoid recreating the `loadStripe` instance on every render.
const stripePromise = loadStripe(
  "pk_test_51Pnz1SATqmsNuw1AvRAKcoH0tJTDb09gyeEYPJw2ZCR0yv2PqghcohnNKjqN7kRrtVi9mHIeqAKACEa3CmW18cYh00XeHXafj2"
);

const StripeCheckoutForm = ({
  totalAmount,
  advertisementId,
  onPaymentSuccess,
}) => {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!stripe || !elements) {
              return;
            }
            const cardElement = elements.getElement(CardElement);
            const { error, paymentMethod } = await stripe.createPaymentMethod({
              type: "card",
              card: cardElement,
            });
            if (error) {
              Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK",
              });
            } else {
              try {
                await axios.post("http://localhost:4000/api/payment", {
                  ad_id: advertisementId,
                  payment_method_id: paymentMethod.id,
                  total_amount: totalAmount * 100,
                });
                Swal.fire({
                  title: "نجاح!",
                  text: "تمت عملية الدفع بنجاح.",
                  icon: "success",
                  confirmButtonText: "موافق",
                });

                onPaymentSuccess();
              } catch (error) {
                Swal.fire({
                  title: "خطأ!",
                  text: "حدث خطأ أثناء معالجة الدفع.",
                  icon: "error",
                  confirmButtonText: "موافق",
                });
                console.error("Error processing payment:", error);
              }
            }
          }}
        >
          <CardElement />
          <button
            type="submit"
            className="w-full bg-[#007a3d] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#007a3d] mt-4"
          >
            Pay with Stripe
          </button>
        </form>
      )}
    </ElementsConsumer>
  );
};

const BillAds = () => {
  const [candidateName, setCandidateName] = useState("الاسم الكامل");
  const [electionSlogan, setElectionSlogan] = useState("الشعار الانتخابي");
  const [candidateDescription, setCandidateDescription] = useState("الوصف");
  const [candidatePhoto, setCandidatePhoto] = useState("");
  const [fontColor, setFontColor] = useState("#000000");
  const [cardColor, setCardColor] = useState("#FFFFFF");
  const [borderColor, setBorderColor] = useState("#FF0000");
  const [borderType, setBorderType] = useState("solid");
  const [cardShape, setCardShape] = useState("circle");
  const [advertisementId, setAdvertisementId] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const totalAmount = 100;

  useEffect(() => {
    if (advertisementId) {
      setShowPayPal(true);
      setShowStripe(true);
    }
  }, [advertisementId]);

  //اني اعمل صورة
  const handleGenerateImage = async () => {
    try {
      const response = await axios.post(
        "https://api.deepai.org/api/text2img",
        {
          text: description,
        },
        {
          headers: {
            "Api-Key": "350e2690-8a28-4a50-adc1-bb1c0269f146",
          },
        }
      );

      setImageUrl(response.data.output_url);
      setCandidatePhoto(response.data.output_url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/advertisements",
        {
          name: candidateName,
          election_slogan: electionSlogan,
          design_type: cardShape,
          description: candidateDescription,
          personal_image: candidatePhoto,
          color_font: fontColor,
          color_card: cardColor,
          color_border: borderColor,
          border_type: borderType,
          status: "inactive",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const adId = response.data.ad_id;
      setAdvertisementId(adId);
      console.log("Advertisement created:", response.data);
    } catch (error) {
      console.error("Error creating advertisement:", error);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axios.put(
        `http://localhost:4000/api/advertisements/${advertisementId}`,
        {
          total_amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      Swal.fire({
        title: "نجاح!",
        text: "تمت عملية الدفع بنجاح.",
        icon: "success",
        confirmButtonText: "موافق",
        customClass: {
          confirmButton: "custom-confirm-button",
        },
        background: "#007a3d",
        color: "#ffffff",
      });
      console.log("Advertisement updated with payment details.");

      // Set payment success to true
      setIsPaymentSuccessful(true);
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء معالجة الدفع.",
        icon: "error",
        confirmButtonText: "موافق",
      });

      console.error(
        "Error updating advertisement with payment details:",
        error
      );
    }
  };

  const cardRef = useRef(null);

  const downloadPdf = () => {
    html2canvas(cardRef.current, {
      scale: 2, // Improves the quality of the image
      useCORS: true, // Enables cross-origin resource sharing
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 297; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("card.pdf");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold mb-12 text-[#007a3d]">
        مخصص اللوحة الإعلانية
      </h1>

      <div className="w-full max-w-[80rem] flex flex-row gap-8">
        <div className="w-full max-w-md h-[35rem] bg-gradient-to-r from-green-500 to-green-700 p-8 shadow-2xl rounded-xl overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6 text-white">
            تخصيص اللوحة الإعلانية الخاصة بك
          </h2>

          {/* Form Fields */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              اسم المرشح
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              شعار الانتخابات
            </label>
            <input
              type="text"
              value={electionSlogan}
              onChange={(e) => setElectionSlogan(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              الوصف
            </label>
            <textarea
              value={candidateDescription}
              onChange={(e) => setCandidateDescription(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              انشاء الصورة
            </label>
            <input
              type="text"
              placeholder="أدخل وصف الصورة"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={handleGenerateImage}
              className="w-full bg-gradient-to-r from-[#ce1126] via-[#007a3d] h-[3rem] rounded-xl to-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
            >
              انشاء الصورة
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              الصورة
            </label>
            <input
              type="text"
              placeholder="رابط الصورة"
              value={candidatePhoto}
              onChange={(e) => setCandidatePhoto(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              لون الخط
            </label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-full p-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              لون البطاقة
            </label>
            <input
              type="color"
              value={cardColor}
              onChange={(e) => setCardColor(e.target.value)}
              className="w-full p-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              لون الإطار
            </label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="w-full p-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              نوع الإطار
            </label>
            <select
              value={borderType}
              onChange={(e) => setBorderType(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="none">بدون</option>
              <option value="solid">خط متصل</option>
              <option value="dashed">خط متقطع</option>
              <option value="dotted">نقاط</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium mb-2 text-white">
              شكل البطاقة
            </label>
            <select
              value={cardShape}
              onChange={(e) => setCardShape(e.target.value)}
              className="w-full p-3 bg-white border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="square">مربع</option>
              <option value="circle">دائرة</option>
            </select>
          </div>

          {!showPayPal && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              إرسال الإعلان
            </button>
          )}
        </div>

        {/* Preview Section */}
        <div
          className="w-full bg-white p-10 shadow-lg rounded-lg flex items-center justify-center hover:shadow-2xl"
          ref={cardRef}
        >
          <div
            className={`p-8 text-center w-full ${
              cardShape === "circle"
                ? "rounded-full h-full"
                : "rounded-lg h-full"
            } border-4`}
            style={{
              backgroundColor: cardColor,
              color: fontColor,
              borderColor: borderColor,
              borderWidth: borderType !== "none" ? "3px" : "0",
              borderStyle: borderType,
            }}
          >
            {candidatePhoto && (
              <img
                src={candidatePhoto}
                alt="المرشح"
                className={`w-full h-72 object-cover mb-5 mx-auto ${
                  cardShape === "circle" ? "rounded-full" : "rounded-lg"
                } shadow-md`}
              />
            )}
            <h3 className="text-2xl font-bold mb-2">{candidateName}</h3>
            <p className="text-lg font-semibold mb-4">{electionSlogan}</p>
            <p className="text-base">{candidateDescription}</p>
          </div>
        </div>
      </div>
      {isPaymentSuccessful && (
        <button
          onClick={downloadPdf}
          className="mt-5 bg-[#007a3d] hover:opacity-90 text-white p-3 rounded-2xl"
        >
          تحميل بصيغة PDF
        </button>
      )}

      {showPayPal && showStripe && (
        <div className="w-full max-w-6xl mt-12 bg-[#f9f9f9] p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-center text-[#007a3d]">
            ادفع الإعلان
          </h2>
          <p className="text-lg font-medium text-gray-700 text-center mb-6">
            يرجى إكمال الدفع لإتمام عملية تقديم الإعلان.
          </p>
          <p className="text-lg font-semibold text-gray-800 text-center mb-6">
            المبلغ الإجمالي:{" "}
            <span className="text-[#007a3d]">{totalAmount.toFixed(2)} USD</span>
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6 border border-[#007a3d]">
              <h3 className="text-2xl font-semibold mb-4 text-[#007a3d]">
                الدفع عبر PayPal
              </h3>
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "horizontal",
                    color: "black", // Stripe colors are limited, so use custom styling for the button
                    shape: "rect",
                    label: "pay",
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: totalAmount.toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      console.log(
                        "Transaction completed by " +
                          details.payer.name.given_name
                      );
                      handlePaymentSuccess(details);
                    });
                  }}
                />
              </PayPalScriptProvider>
            </div>
            <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6 border border-[#007a3d]">
              <h3 className="text-2xl font-semibold mb-4 text-[#007a3d]">
                الدفع عبر Stripe
              </h3>
              <Elements stripe={stripePromise}>
                <StripeCheckoutForm
                  totalAmount={totalAmount}
                  advertisementId={advertisementId}
                  onPaymentSuccess={() => handlePaymentSuccess({})}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillAds;
