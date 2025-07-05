// ElectronicsList.js
// Main content for the Electronics page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function ElectronicsList() {
  const [electronicsItems, setElectronicsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchElectronics() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setElectronicsItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "electronics"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load electronics items."));
      }
      setLoading(false);
    }
    fetchElectronics();
  }, []);

  return (
    <CategoryTemplate
      title="Electronics"
      description="Browse high-quality electronics available for rent"
      items={electronicsItems}
      loading={loading}
      error={error}
      categoryImage="/electronics-hero.jpg"
    />
  );
}
