import { useState, useEffect } from "react";
import axios, { CancelTokenSource } from "axios";
import api from "../api";

interface UseFetchUrlOptions {
  shouldFetch?: boolean;
  debounce?: number;
}

export default function useFetchUrl<T>(
  url: string,
  options: UseFetchUrlOptions = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shouldFetch = true, debounce = 0 } = options;

  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    let debouncer: number;

    const fetchData = async () => {
      try {
        if (!shouldFetch) return;
        const response = await api.get<T>(url, {
          cancelToken: source.token,
        });
        setData(response.data);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log(`'${url}' request canceled : `, err.message);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (debounce && debounce > 0) {
      debouncer = setTimeout(fetchData, debounce);
    } else {
      fetchData();
    }

    return () => {
      if (debouncer) clearTimeout(debouncer);
      source.cancel("Operation canceled by the user.");
    };
  }, [url, shouldFetch, debounce]);

  return { data, loading, error };
}
