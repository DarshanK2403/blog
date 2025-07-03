import { useState, useEffect } from "react";

export default function usePostTypes() {
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracted so it can be reused
  const fetchPostTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/post-type", {
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setPostTypes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching post types:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostTypes();
  }, []);

  return { postTypes, loading, error, refetch: fetchPostTypes };
}
