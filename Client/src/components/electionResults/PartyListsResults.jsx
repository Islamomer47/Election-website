import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function PartyListsResults() {
  const [partyLists, setPartyLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartyLists() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/election/district/1/results"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPartyLists(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPartyLists();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-red-800 col-span-full"
      >
        نتائج القوائم الحزبية
      </motion.h2>
      {partyLists.map((list, index) => (
        <motion.div
          key={list.list_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300 border-2 border-green-700"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-green-700 to-black">
            <h3 className="text-2xl font-bold text-white">{list.name}</h3>
            <p className="text-white mt-1 text-lg">
              عدد المقاعد: {list.seatsWon}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

export default PartyListsResults;
