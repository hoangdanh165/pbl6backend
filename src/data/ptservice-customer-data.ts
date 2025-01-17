import { useState, useEffect } from 'react';
import { GridRowsProp } from '@mui/x-data-grid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


export const usePTServiceCustomerData = (reloadTrigger: number, selectedValue: string) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchPTServiceCustomers = async () => {
      try {
        setLoading(true);

        const url = selectedValue
          ? `/api/v1/pt-services/customers?pt_service=${selectedValue}`
          : `/api/v1/pt-services/customers`;


        const response = await axiosPrivate.get(url, 
          {
            withCredentials: true,
          }
        ); 

        // Nếu backend có pagination thì response.data.results
        const formattedRows = response.data.map((npsc) => ({
          id: npsc.id,
          first_name: npsc.first_name,
          last_name: npsc.last_name,
          address: npsc.address,
          gender: npsc.gender,
          birthday: npsc.birthday,
        }));

        
        setRows(formattedRows);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPTServiceCustomers();

  }, [reloadTrigger, selectedValue]);

  return { rows, loading, error };
};
