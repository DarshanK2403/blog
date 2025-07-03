import { useState, useEffect } from "react";

export default function useExtrafields() {
  const [extraFields, setExtraFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted so it can be reused
  const fetchExtraFields = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/extra-fields");
      if (!response.ok) throw new Error("Failed to fetch extra fields");
      const data = await response.json();
      setExtraFields(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching extraFields:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtraFields();
  }, []);

  return { extraFields, loading, error, refetch: fetchExtraFields };
}
