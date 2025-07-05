// FemaleFashionList.js
// Main content for the Female Fashion page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function FemaleFashionList() {
  const [femaleItems, setFemaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFemale() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setFemaleItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "female"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load female fashion items."));
      }
      setLoading(false);
    }
    fetchFemale();
  }, []);

  return (
    <CategoryTemplate
      title="Women's Fashion"
      description="Discover elegant and trendy women's fashion for any occasion"
      items={femaleItems}
      loading={loading}
      error={error}
      categoryImage="/female-fashion-hero.jpg"
    />
  );
}
