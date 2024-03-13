import React, { useEffect, useState } from 'react';
import hero from '../../assets/google.svg';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Card from './Card';


function Dashboard() {
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
    <div>
        <div className='p-9'>
            <div className='flex justify-between items-center'>
                <h1>Hello Dennis, Welcome Back!</h1>
                <div className='flex bg-card p-3 items-center rounded'>
                    <img src={hero} className='w-[30px]'/>
                    <h1 className='text-cream'>Dennis</h1>
                </div>
            </div>
            <div className='mt-12'>
                <h1 className='md:text-4xl'>My Dashboard</h1>
                <div className='flex justify-between w-full mt-9 text-cream'>
                    <div className='card md:w-[400px] md:h-[180px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Balance</h1>
                        <h1 className='text-4xl'>R 600</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                    <div className='card md:w-[400px] md:h-[180px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Total Due</h1>
                        <h1 className='text-4xl'>R 600</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                    <div className='card md:w-[400px] md:h-[180px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Total Recieved</h1>
                        <h1 className='text-4xl'>R 600</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                </div>
            </div>
            <div>
                <div className=' mt-9 flex justify-between items-center'>
                    <h1 className='text-3xl'>Invoices</h1>
                    <Link to="/home/add">
                        <a  className="button bg-card p-3" href="#">
                        <span className="button__icon-wrapper ">
                            <svg width="10" className="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                <path fill="#222E50" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                            </svg>
                            
                            <svg className="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                <path fill="#222E50" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                            </svg>
                        </span>
                        New Invoice
                        </a>
                    </Link>
                </div>
                <div>
                <div className='cards w-full'>
                    <div className='card__container mt-12 flex flex-wrap justify-between gap-5'>
                    {invoices.map((invoice) => (
                        <Card key={invoice.id} data={invoice} />
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard