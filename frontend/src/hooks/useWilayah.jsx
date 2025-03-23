import { useState, useEffect } from 'react';
import { listWilayah } from '@/services/wilayahService';

const useWilayah = () => {
  const [wilayahData, setWilayahData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listWilayah();
        setWilayahData(data);
        setIsSuccess(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { wilayahData, isLoading, isSuccess, error };
};

export default useWilayah;
