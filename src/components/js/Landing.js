import React, { useState, useEffect } from 'react';
import Navabar from './Navabar';
import Card from './Card';
import { supabase } from '../supabase'; // Assuming you have a supabase configuration file

function Landing() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('Invoice').select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setInvoices(data);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <>
      <Navabar />
      <div className='cards w-full'>
        <div className='card__container mt-12 flex flex-col gap-5'>
          {invoices.map((invoice) => (
            <Card key={invoice.id} data={invoice} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Landing;
