import { useState, useEffect } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export const useNonPTServicesData = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNonPTServices = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/api/v1/nonpt-services/', 
          {
            withCredentials: true,
          }
        ); 

        // Nếu backend có pagination thì response.data.results
        const formattedRows = response.data.map((nonptservice) => ({
          id: nonptservice.id,
          start_date: nonptservice.start_date,
          expire_date: nonptservice.expire_date,
          discount: nonptservice.discount,
          number_of_month: nonptservice.number_of_month, 
          cost_per_month: nonptservice.cost_per_month, 
          name: nonptservice.name, 
        }));

        
        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNonPTServices();

  }, [reloadTrigger]);

  return { rows, loading, error };
};
