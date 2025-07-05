// KidsList.js
// Main content for the Kids page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function KidsList() {
  const [kidsItems, setKidsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchKids() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        setKidsItems(data.filter(item => (item.category || item.Category || "").toLowerCase().trim() === "kids"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load kids items."));
      }
      setLoading(false);
    }
    fetchKids();
  }, []);

  return (
    <CategoryTemplate
      title="Kids' Collection"
      description="Find quality items for children of all ages"
      items={kidsItems}
      loading={loading}
      error={error}
      categoryImage="/kids-hero.jpg"
    />
  );
}
