// SportsList.js
// Main content for the Sports page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function SportsList() {
  const [sportsItems, setSportsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSports() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setSportsItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "sports"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load sports items."));
      }
      setLoading(false);
    }
    fetchSports();
  }, []);

  return (
    <CategoryTemplate
      title="Sports Equipment"
      description="Find premium sports equipment for your next adventure"
      items={sportsItems}
      loading={loading}
      error={error}
      categoryImage="/sports-hero.jpg"
    />
  );
}
