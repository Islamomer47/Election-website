import React, { useState } from "react";
import axios from "axios";

const ImageGenerator = () => {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleGenerateImage}
        className="bg-blue-500 text-white py-2 px-4"
      >
        Generate Image
      </button>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated"
          className="mt-4 max-w-full h-auto"
        />
      )}
    </div>
  );
};

export default ImageGenerator;
