// DecorList.js
// Main content for the Decor page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function DecorList() {
  const [decorItems, setDecorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDecor() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setDecorItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "decor"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load decor items."));
      }
      setLoading(false);
    }
    fetchDecor();
  }, []);

  return (
    <CategoryTemplate
      title="Home Decor"
      description="Transform your space with our beautiful decor items"
      items={decorItems}
      loading={loading}
      error={error}
      categoryImage="/decor-hero.jpg"
    />
  );
}
