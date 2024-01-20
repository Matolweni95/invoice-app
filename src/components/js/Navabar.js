import React, { useEffect, useState } from 'react';
import '../../css/addbtn.css'
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';


function Navabar() {
    const [totalInvoices, setTotalInvoices] = useState(0);

    useEffect(() => {
      const fetchTotalInvoices = async () => {
        try {
          const { count, error } = await supabase
            .from('Invoice')
            .select('count', { head: true });
  
          if (error) {
            throw error;
          }
  
          setTotalInvoices(count);
        } catch (error) {
          console.error('Error fetching total invoices:', error);
        }
      };
  
      fetchTotalInvoices();
    }, []);
  
  return (
    <div className='navi w-full'>
        <div className='navi__container flex flex-col md:flex-row gap-10 justify-between pt-11'>
            <div className='main__text'>
                <h1 className='text-5xl mb-3'>Invoices</h1>
                <h2>{`There are ${totalInvoices} total invoices`}</h2>
            </div>
            <div className='button'>
            <Link to="/home/add">
            <a  className="button bg-purple p-3" href="#">
            <span className="button__icon-wrapper ">
                <svg width="10" className="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                    <path fill="currentColor" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                </svg>
                
                <svg className="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                    <path fill="currentColor" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                </svg>
            </span>
            New Invoice
            </a>
            </Link>
            </div>
        </div>
    </div>
  )
}

export default Navabar