import React, { useState } from "react";
import Header from "/src/components/electionResults/Header";
import PartyListsResults from "/src/components/electionResults/PartyListsResults";
import LocalListsResults from "/src/components/electionResults/LocalListsResults";
import VoiceSearch from "/src/components/electionResults/VoiceSearch";
import DistrictSelector from "/src/components/electionResults/DistrictSelector";

function ElectionResults() {
  const [activeTab, setActiveTab] = useState("محلي");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleDistrictSearch = (district) => {
    setSelectedDistrict(district);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 rtl font-arabic"
      dir="rtl"
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        VoiceSearch={<VoiceSearch onSearch={handleDistrictSearch} />}
      />
      <main className="container mx-auto px-4 py-8">
        {activeTab === "محلي" && (
          <DistrictSelector
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />
        )}
        {activeTab === "محلي" ? (
          <LocalListsResults selectedDistrict={selectedDistrict} />
        ) : (
          <PartyListsResults />
        )}
      </main>
    </div>
  );
}

export default ElectionResults;
