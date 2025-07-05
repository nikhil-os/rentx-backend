// FurnitureList.js
// Main content for the Furniture page

"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function FurnitureList() {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFurniture() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setFurnitureItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "furniture"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load furniture items."));
      }
      setLoading(false);
    }
    fetchFurniture();
  }, []);

  return (
    <CategoryTemplate
      title="Furniture"
      description="Find the perfect furniture for your home or event"
      items={furnitureItems}
      loading={loading}
      error={error}
      categoryImage="/furniture-hero.jpg"
    />
  );
}
