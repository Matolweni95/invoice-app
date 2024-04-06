import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Card from './Card';
import hero from '../../assets/hero.jpg'
import { data } from 'autoprefixer';
import '../../css/profile.css'
import { useNavigate } from 'react-router-dom';


function Dashboard() {
const [invoices, setInvoices] = useState([]); 
const [totalAmount, settotalAmount] = useState('');
const [user, setUser] = useState('');
const [pendingAmount, setpendingAmount] = useState('');
const [paidAmount, setAmount] = useState('');
const userid = localStorage.getItem('userId');
const [menuActive, setMenuActive] = useState(false);
const navigate = useNavigate();
const toggleMenu = () => {
    setMenuActive(prevMenuActive => !prevMenuActive);
};


useEffect(() => {
const fetchData = async () => {
    try {
        const { data: invoiceData, error } = await supabase
            .from('Invoice')
            .select('*')
            .eq('user_id', userid);

        const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('*')
            .eq('user_id', userid)
            .single();
            setUser(userData)
            calc();

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            if (Array.isArray(invoiceData)) {
                setInvoices(invoiceData);
            } else {
                setInvoices([invoiceData]);
            }
        }
    } catch (err) {
        console.error('An unexpected error occurred:', err);
    }
};

fetchData();
}, []);



  async function calc() {
    try {
      const { data: paidInvoices, error: paidError } = await supabase
        .from('Invoice')
        .select('total')
        .eq('status', 'paid')
        .eq('user_id', userid);
  
      const { data: pendingInvoices, error: pendingError } = await supabase
        .from('Invoice')
        .select('total')
        .eq('status', 'pending')
        .eq('user_id', userid);
  
      const { data: allInvoices, error: allError } = await supabase
        .from('Invoice')
        .select('total')
        .eq('user_id', userid);
  
      if (paidError || pendingError || allError) {
        throw paidError || pendingError || allError;
      }
  
      const paidAmount = sumInvoicesTotal(paidInvoices);
      const pendingAmount = sumInvoicesTotal(pendingInvoices);
      const totalAmount = sumInvoicesTotal(allInvoices);

      settotalAmount(totalAmount);
      setpendingAmount(pendingAmount);
      setAmount(paidAmount)
     
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
  

  function sumInvoicesTotal(invoices) {
    return invoices.reduce((total, invoice) => total + invoice.total, 0);
  }

  function logout () {
    localStorage.removeItem('loggedin');
    localStorage.removeItem('userid');
    navigate('/')
  }
  

  
  return (
    <div>
        <div className='p-9'>
            <div className='flex justify-between items-center'>
                <h1 className='text-card'>Hello {user.name}, Welcome Back!</h1>
                {/* <div className='flex bg-card p-3 items-center rounded'>
                    <img src={hero} className='w-[45px] mr-3 object-cover rounded-[100%]'/>
                    <button className='flex items-center gap-3'>
                        <h1 className='text-cream'>{user.name}</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill='#E6DBD0' width="20"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
                    </button>
                </div> */}
                <nav>
            <div className='flex justify-between w-full'>
                <div></div>
                <div className="profile text-card" onClick={toggleMenu}>
                    <div className="user">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                    <div className="img-box">
                        <img src="https://i.postimg.cc/BvNYhMHS/user-img.jpg" alt="some user image" />
                    </div>
                </div>
            </div>
                
            <div className={`menu ${menuActive ? 'active' : ''}`}>
                <ul>
                    <li><button className='w-full'>&nbsp;Profile</button></li>
                    <li><button onClick={logout} className='w-full'>&nbsp;Sign Out</button></li>
                </ul>
            </div>
        </nav>
            </div>
            <div className='mt-12'>
                <h1 className='md:text-4xl'>My Dashboard</h1>
                <div className='flex flex-col gap-4 md:gap-0 md:flex-row justify-between w-full mt-9 text-cream'>
                    <div className='card w-full md:w-[240px] lg:w-[400px] h-[150px] md:h-[160px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Total Expected</h1>
                        <h1 className='text-4xl'>R{totalAmount}</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                    <div className='card w-full md:w-[240px] lg:w-[400px] h-[150px] md:h-[160px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Pending Payments</h1>
                        <h1 className='text-4xl'>R {pendingAmount}</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                    <div className='card w-full md:w-[240px] lg:w-[400px] h-[150px] md:h-[160px] w-[500px] h-[200px] bg-card rounded-lg p-8 flex justify-around flex-col'>
                        <h1 className='text-2xl'>Total Paid</h1>
                        <h1 className='text-4xl'>R {paidAmount  }</h1>
                        <h1 className='text-sm'>2% more than las month</h1>
                    </div>
                </div>
            </div>
            <div>
                <div className=' mt-9 flex justify-between items-center'>
                    <h1 className='text-3xl'>Invoices</h1>
                    <Link to="/home/add">
                        <button  className="button bg-card p-3" href="#">
                        <span className="button__icon-wrapper ">
                            <svg width="10" className="button__icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                <path fill="#222E50" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                            </svg>
                            
                            <svg className="button__icon-svg  button__icon-svg--copy" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                <path fill="#222E50" d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                            </svg>
                        </span>
                        New Invoice
                        </button>
                    </Link>
                </div>
                <div>
                <div className='cards'>
                    <div className='card__container mt-12 flex flex-wrap justify-between gap-5'>
                    {invoices.map((invoice) => (
                        <Card key={invoice.Invoice_id} data={invoice} />
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