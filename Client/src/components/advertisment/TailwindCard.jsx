import React from "react";

const TailwindCard = ({ candidateDetails, customization }) => {
  const { name, slogan, district, photoURL } = candidateDetails;
  const { fontColor, cardColor, borderColor, backgroundImage } = customization;

  return (
    <div
      className="flex flex-col items-center justify-center  w-full p-8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden"
        style={{ borderColor: borderColor, borderWidth: "4px" }}
      >
        <h1
          className="text-4xl font-bold text-center py-6"
          style={{ color: fontColor, backgroundColor: cardColor }}
        >
          اللوحة الانتخابية
        </h1>
        <div
          className="flex flex-col md:flex-row p-8"
          style={{ backgroundColor: cardColor }}
        >
          {photoURL && (
            <div className="md:w-1/2 mb-6 md:mb-0 md:ml-8">
              <img
                src={photoURL}
                alt={name}
                className="w-72 h-auto object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          <div className="md:w-1/2">
            <h2
              className="text-3xl font-semibold mb-4"
              style={{ color: fontColor }}
            >
              {name || "اسم المرشح"}
            </h2>
            <p
              className="text-xl leading-relaxed mb-4"
              style={{ color: fontColor }}
            >
              {slogan || "الشعار الانتخابي"}
            </p>
            <p className="text-lg" style={{ color: fontColor }}>
              الدائرة الانتخابية: {district || "غير محدد"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindCard;

// import React from "react";

// const TailwindCard = ({ candidateDetails, customization }) => {
//   const { name, description, photoURL } = candidateDetails;
//   const { fontColor, cardColor, borderColor, backgroundImage } = customization;

//   return (
//     <div
//       className="border-4 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
//       style={{
//         backgroundColor: cardColor,
//         borderColor: borderColor,
//         backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="mb-4">
//         {photoURL && (
//           <img
//             src={photoURL}
//             alt={name}
//             className="w-full h-full object-cover rounded-lg mb-4"
//           />
//         )}
//         <h3 className="text-2xl font-bold" style={{ color: fontColor }}>
//           {name || "Candidate Name"}
//         </h3>
//         <p className="mt-2" style={{ color: fontColor }}>
//           {description ||
//             "Candidate description goes here. Add some details about the candidate."}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TailwindCard;
