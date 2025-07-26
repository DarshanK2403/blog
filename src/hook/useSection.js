import { useState, useEffect } from "react";

export default function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted so it can be reused
  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/section", {
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSections(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return { sections, loading, error, refetch: fetchSections };
}
