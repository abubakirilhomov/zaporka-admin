import { useState, useEffect, useCallback } from "react";

const useFetch = (url, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (overrideOptions = {}) => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          ...overrideOptions,
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url] // Убрали options из зависимостей
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoFetch]); // Убрали fetchData из зависимостей

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
