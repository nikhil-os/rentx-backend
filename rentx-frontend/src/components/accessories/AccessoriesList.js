// AccessoriesList.js
// Main content for the Accessories page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function AccessoriesList() {
  const [accessoriesItems, setAccessoriesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAccessories() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setAccessoriesItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "accessories"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load accessories items."));
      }
      setLoading(false);
    }
    fetchAccessories();
  }, []);

  return (
    <CategoryTemplate
      title="Accessories"
      description="Discover stylish accessories to complement your look"
      items={accessoriesItems}
      loading={loading}
      error={error}
      categoryImage="/accessories-hero.jpg"
    />
  );
}
