// VehiclesList.js
// Main content for the Vehicles page
"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import CategoryTemplate from "../common/CategoryTemplate";

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      setError("");
      try {
        const data = await api.get("/rentals");
        console.log("All rentals:", data);

        setVehicles(data.filter(item => (item.category || item.Category || "").toLowerCase() === "vehicles"));
      } catch (err) {
        setError(typeof err === "string" ? err : (err.message || "Failed to load vehicles."));
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  return (
    <CategoryTemplate
      title="Vehicles"
      description="Explore a wide range of vehicles available for rent"
      items={vehicles}
      loading={loading}
      error={error}
      categoryImage="/vehicles-hero.jpg"
    />
  );
}
