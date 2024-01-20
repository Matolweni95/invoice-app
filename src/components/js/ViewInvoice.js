import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import classnames from 'classnames';


function ViewInvoice() {
const { id } = useParams();
const [invoiceData, setInvoiceData] = useState(null);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
const [items, setItems] = useState([]);
const total = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
const navigate = useNavigate();
const status = invoiceData?.status;

  const containerClasses = classnames('rounded', {
    'bg-orangebg': status === 'pending',
    'bg-greenbg': status !== 'pending',
  });

  const textClasses = classnames('p-3', {
    'text-orangetext': status === 'pending',
    'text-greentext': status !== 'pending',
  });

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('Items')
        .select('*')
        .eq('Invoice_id', id);

      if (error) {
        throw new Error('Error fetching items:', error);
      }

      console.log('Fetched Items:', data);
      setItems(data);
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching items. Please try again.');
    }
  };

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const { data, error } = await supabase
          .from('Invoice')
          .select('*')
          .eq('Invoice_id', id)
          .single();

        if (error) {
          throw new Error('Error fetching invoice data:', error);
        }

        console.log('Fetched Invoice Data:', data);
        setInvoiceData(data);
        setError(null);
        fetchItems();
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();

  }, [id]);

  const handleDeleteInvoice = async () => {
    try {
      const { error } = await supabase
        .from('Invoice')
        .delete()
        .eq('Invoice_id', id);

      if (error) {
        throw error;
      }

      console.log('Invoice deleted successfully');
      navigate('../');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };


  const handleMarkAsRead = async () => {
    try {
      const currentStatus = invoiceData.status;
      const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
      await supabase
        .from('Invoice')
        .upsert([{ Invoice_id: id, status: newStatus }], { onConflict: ['Invoice_id'] });
  
        console.log('Status updated successfully');
        setInvoiceData((prevData) => ({
        ...prevData,
        status: newStatus,
      }));
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className='view__container'>
        <Link to ="../">
        <button className='px-4 py-2 rounded-md mt-4 mb-4 flex items-center gap-4'>
          <div className='fill-purple'>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
          </div>
          Go Back
        </button>
        </Link>
        <div className={`top__card w-full flex flex-col md:flex-row gap-5 justify-between bg-card p-6`}>
        <div className='flex items-center gap-5'>
            <p>Status</p>
            <div className={`status-container ${containerClasses}`}>
            <p className={`${textClasses} rounded-lg`}><span>&bull;</span>{invoiceData.status}</p>
            </div>
        </div>

          <div className='flex gap-6'>
            <Link to={`../view/${id}/edit`}>
              <button className='bg-totals p-3 text-small text-base rounded-lg'>Edit</button>
            </Link>
            <button className='bg-orange p-3 text-base rounded-lg' onClick={handleDeleteInvoice}>Delete</button>

            {invoiceData.status === 'paid' ? (
              <button className={`bg-purple p-1 md:p-3 rounded-lg`} onClick={handleMarkAsRead}> Mark as Pending</button>
            ) : (
              <button className={`bg-purple p-1 md:p-3 rounded-lg`} onClick={handleMarkAsRead}>Mark as paid</button>
            )}
          </div>
        

            </div>
            <div className='mt-12 bg-card rounded-lg p-3 md:p-10'>
              <div className='w-full flex justify-between'>
                <div className='reference'>
                  <h1 className='text-2xl mb-3'>{invoiceData.reference}</h1>
                  <p>Graphic Design</p>
                </div>
                <div className='address'>
                  <p>{invoiceData.billFromStreetAddress}</p>
                  <p>{invoiceData.billFromCity}</p>
                  <p>{invoiceData.billFromPostal}</p>
                  <p>{invoiceData.billFromCountry}</p>
                </div>
              </div>
              <div className='invoice__details mt-9 flex justify-between'>
                <div className='invoice__dates flex flex-col gap-10'>
                  <div>
                    <p>Invoice Date</p>
                    <h1 className='font-bold'>{invoiceData.invoiceDate}</h1>
                  </div>
                  <div>
                    <p>Payment Due</p>
                    <h1 className='font-bold'>{invoiceData.dueDate}</h1>
                  </div>
                </div>
                <div className='billedto'>
                  <div>
                    <p className='mb-3'>Bill to</p>
                    <h1 className='font-semibold'>{invoiceData.clientName}</h1>
                    <p>{invoiceData.billToAddress}</p>
                    <p>{invoiceData.billToCity}</p>
                    <p>{invoiceData.billToPostal}</p>
                    <p>{invoiceData.billToCountry}</p>
                  </div>
                </div>
              </div>
              <div className='sentto'>
                <p>Sent to</p>
                <h1 className='font-semibold'>{invoiceData.clientEmail}</h1>
              </div>
              <div className='items flex justify-center items-center'>
                {items.length > 0 ? (
                  <div className="mt-12 bg-totals rounded-lg w-full">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="p-2">Item</th>
                          <th className="p-2">Quantity</th>
                          <th className="p-2">Rate</th>
                          <th className="p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="text-center">
                            <td className="p-2">{item.description}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">R{item.rate}</td>
                            <td className="p-2">R{(item.quantity * item.rate).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className='text-center'>
                            <td className="p-2">Total:</td>
                            <td className="p-2"></td>
                            <td className="p-2"></td>
                            <td className="p-2">R{total.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className='mt-[100px]'>No items found for this invoice.</p>
                )}
              </div>
            </div>
          </div>
        </>
      );    
    };
    
export default ViewInvoice;
    
