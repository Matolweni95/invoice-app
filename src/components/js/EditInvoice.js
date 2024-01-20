import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';

function EditInvoice() {
    const initialFormData = {
    billFromAddress: '',
    billFromCity: '',
    reference: '',
    billFromPostal: '',
    billFromCountry: '',
    billToAddress: '',
    billToCity: '',
    billToPostal: '',
    billToCountry: '',
    clientName: '',
    clientEmail: '',
    invoiceDate: '',
    dueDate: '',
    items: [],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [invoices, setInvoices] = useState([]);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    console.log(id)


    async function handleUpdateInvoice() {
        try {
            const {
                billFromAddress,
                billFromCity,
                billFromPostal,
                billFromCountry,
                billToAddress,
                billToCity,
                billToPostal,
                billToCountry,
                clientName,
                clientEmail,
                invoiceDate,
                dueDate,
            } = formData;
    
            const { data: updateData, error: updateError } = await supabase
                .from('Invoice')
                .update({
                    billFromAddress,
                    billFromCity,
                    billFromPostal,
                    billFromCountry,
                    billToAddress,
                    billToCity,
                    billToPostal,
                    billToCountry,
                    clientName,
                    clientEmail,
                    invoiceDate,
                    dueDate,
                })
                .eq('Invoice_id', id);
    
            if (updateError) {
                throw updateError;
            }
    
            console.log('Invoice updated successfully:', updateData);
            navigate('../');
    
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    }
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: invoiceData, error: invoiceError } = await supabase
                    .from('Invoice')
                    .select('*')
                    .eq('Invoice_id', id)
                    .single();
    
                if (invoiceError) {
                    throw invoiceError;
                }
    
                if (invoiceData) {
                    console.log(invoiceData);
                    setFormData(invoiceData);

                    // const { data: itemsData, error: itemsError } = await supabase
                    //     .from('Items')
                    //     .select('*')
                    //     .eq('Invoice_id', id);
    
                    // if (itemsError) {
                    //     throw itemsError;
                    // }
    

                    // if (itemsData) {
                    //     console.log(itemsData);
                    //     setInvoiceItems(itemsData);
                    // }
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
    
        fetchData();
    }, [id]);
    

    

    return (
    <div className="max-w-3xl bg-invoice mx-auto p-6 shadow-md rounded-lg">
        <Link to="*/../../">
            <button className='bg-purple px-4 py-2 rounded-md mt-4 mb-4 flex items-center gap-4'>
            <div className='fill-white'>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                </svg>
            </div>
            Go Back
            </button>
        </Link>
        <h2 className="text-1xl text-purple font-bold mb-4 mt-12">Bill From</h2>
    
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Street Address</label>
        <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billFromStreetAddress}
            onChange={(e) => setFormData({ ...formData, billFromStreetAddress: e.target.value })}
        />
        </div>
    
        <div className="mb-4 flex gap-5 flex-col md:flex-row">
        <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billFromCity}
            onChange={(e) => setFormData({ ...formData, billFromCity: e.target.value })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600">Postal Code</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billFromPostal}
            onChange={(e) => setFormData({ ...formData, billFromPostal: e.target.value })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600">Country</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billFromCountry}
            onChange={(e) => setFormData({ ...formData, billFromCountry: e.target.value })}
            />
        </div>
        </div>
    
        <h2 className="text-1xl text-purple font-bold mb-4 mt-12">Bill To</h2>
    
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Client Name</label>
        <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        />
        </div>
    
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Client Email</label>
        <input
            type="email"
            className="mt-1 p-2 w-full bg-totals rounded-md"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
        />
        </div>
    
        <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Street Address</label>
        <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billToAddress}
            onChange={(e) => setFormData({ ...formData, billToAddress: e.target.value })}
        />
        </div>
    
        <div className="mb-4 flex gap-5 flex-col md:flex-row">
        <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billToCity}
            onChange={(e) => setFormData({ ...formData, billToCity: e.target.value })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600">Postal Code</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billToPostal}
            onChange={(e) => setFormData({ ...formData, billToPostal: e.target.value })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600">Country</label>
            <input
            type="text"
            className="mt-1 p-2 bg-totals w-full rounded-md"
            value={formData.billToCountry}
            onChange={(e) => setFormData({ ...formData, billToCountry: e.target.value })}
            />
        </div>
        </div>

    <div className="flex mb-4 gap-10 flex-col md:flex-row">
        <div className="flex-1">
        <label className="block text-sm font-medium text-gray-600">Invoice Date</label>
        <input
            type="date"
            className="mt-1 p-2 w-full bg-totals rounded-md"
            value={formData.invoiceDate}
            onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
        />
        </div>

        <div className="flex-1">
        <label className="block text-sm font-medium text-gray-600">Due Date</label>
        <input
            type="date"
            className="mt-1 p-2 w-full bg-totals rounded-md"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
        </div>
    </div>

    {/* <div className="mt-4 bg-totals rounded-lg">
        <table className="w-full text-[small] md:text-base">
        <thead>
            <tr className="">
            <th className="p-2">Item </th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Total</th>
            
            </tr>
        </thead>
        <tbody>
        {invoiceItems.map((item, index) => (
            <tr key={index} className="text-center">
                <td className="p-2">{item.description}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">R{item.rate}</td>
                <td className="p-2">R{(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
        ))}
            

        </tbody> 
        </table>
    </div> */}

    <div className="mt-8">
        <button className="bg-purple text-white px-6 py-3 rounded-md" onClick={handleUpdateInvoice}>
        Update Invoice
        </button>
    </div>
    </div>
);

    
};
export default EditInvoice