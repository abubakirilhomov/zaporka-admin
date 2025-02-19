import { useState, useEffect, useCallback } from "react";

const useFetch = (url, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (overrideOptions = {}) => {
      const controller = new AbortController();
      const signal = controller.signal;
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          ...overrideOptions,
          signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        return result; // ВАЖНО: возвращаем результат
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  const revalidate = () => fetchData();

  const postData = async (body) =>
    fetchData({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const putData = async (body) =>
    fetchData({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const deleteData = async () =>
    fetchData({
      method: "DELETE",
    });

  return { data, loading, error, revalidate, postData, putData, deleteData };
};

export default useFetch;
