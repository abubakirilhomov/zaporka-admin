import { useState, useEffect, useCallback } from "react";

const useFetch = (baseUrl, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (url, overrideOptions = {}) => {
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
    [options]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchData(baseUrl);
    }
  }, [baseUrl, autoFetch]);

  const revalidate = () => fetchData(baseUrl);

  const postData = async (url, body) =>
    fetchData(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const putData = async (url, body) =>
    fetchData(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  const deleteData = async (url) =>
    fetchData(url, {
      method: "DELETE",
    });

  return { data, loading, error, revalidate, postData, putData, deleteData };
};

export default useFetch;