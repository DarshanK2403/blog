import { useState, useEffect } from "react";

export default function useOrganizations() {
  const [organization, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted so it can be reused
  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/organizations");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setOrganizations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return { organization, loading, error, refetch: fetchOrganizations };
}
