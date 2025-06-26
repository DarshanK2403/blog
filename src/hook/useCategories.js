// hooks/useCategory.js
import { useEffect, useState } from "react";

export default function useCategory({
  all = false,
  page = 1,
  limit = 15,
} = {}) {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const url = all
          ? "/api/category?all=true"
          : `/api/category?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();

        setCategories(data.data || []);
        if (!all) {
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [all, page, limit]);

  return { categories, pagination, isLoading };
}
