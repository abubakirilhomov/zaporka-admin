import { useState, useEffect, useCallback } from "react";

const useFetch = (baseUrl, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Memoize options to prevent unnecessary re-renders
  const stableOptions = JSON.stringify(options);

  const fetchData = useCallback(
    async (url, overrideOptions = {}) => {
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...JSON.parse(stableOptions),
          ...overrideOptions,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || "An unknown error occurred";
        setError(errorMessage);
        throw new Error(errorMessage); // Rethrow with a consistent message
      } finally {
        setLoading(false);
      }
    },
    [stableOptions]
  );

  useEffect(() => {
    if (autoFetch && baseUrl) {
      fetchData(baseUrl);
    }
  }, [baseUrl, autoFetch, fetchData]);

  const revalidate = () => fetchData(baseUrl);

  const postData = async (url, body) =>
    fetchData(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: JSON.stringify(body),
    });
  
  const putData = async (url, body) =>
    fetchData(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: JSON.stringify(body),
    });

  const deleteData = async (url) =>
    fetchData(url, {
      method: "DELETE",
      headers: options.headers,
    });
  return { data, loading, error, revalidate, postData, putData, deleteData };
};

export default useFetch;