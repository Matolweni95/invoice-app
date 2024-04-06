import React, { useState, useEffect} from 'react';
import { supabase } from '../supabase';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddInvoice = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const [invoices, setInvoices] = useState([]);
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [issueDate, setIssueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [error, setError] = useState('');

  const initialFormData = {
    billFromStreetAddress: '',
    billFromCity: '',
    reference: '',
    billFromPostalCode: '',
    billFromCountry: '',
    billToStreetAddress: '',
    billToCity: '',
    billToPostalCode: '',
    billToCountry: '',
    clientName: '',
    clientEmail: '',
    total: '',
    status: 'pending',
    invoiceDate: '',
    dueDate: '',
    currentItem: { description: '', quantity: '', rate: '' },
    items: [],
  };
  
  const handleIssueDateChange = (date) => {
    setIssueDate(date);
    const formattedDate = date instanceof Date ? date.toISOString().slice(0, 10) : date;
    setFormData({
      ...formData,
      invoiceDate: formattedDate,
    });
    validateDates(formattedDate, dueDate); 
  };
  
  const handleDueDateChange = (date) => {
    setDueDate(date);
    const formattedDate = date instanceof Date ? date.toISOString().slice(0, 10) : date;
    setFormData({
      ...formData,
      dueDate: formattedDate,
    });
    validateDates(issueDate, formattedDate); 
  };
  
  const validateDates = (issueDate, dueDate) => {
    if (issueDate && dueDate && new Date(dueDate) < new Date(issueDate)) {
      setError('Due date cannot be before the issue date');
    } else {
      setError('');
    }
  };

  const handleInputChange = (key, value) => {
    
    setFormData({
      ...formData,
      currentItem: {
        ...formData.currentItem,
        [key]: value,
      },
    });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, formData.currentItem],
      currentItem: { description: '', quantity: 1, rate: 0 },
    });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
 
  const generateNumericPart = () => {
    const numericPart = Math.floor(10000 + Math.random() * 90000);
    return numericPart.toString();
  };
  
  const generateCode = async () => {
    const letters = 'XM';
    const numericPart = generateNumericPart();
    const generatedCode = `#${letters}${numericPart}`;
    setCode(generatedCode);
    console.log('Code generated:', generatedCode);
    return generatedCode; 
  };
  
  async function handleGenerateInvoice() {
    try {

      //validate input fields

      if (
        !formData.billFromStreetAddress ||
        !formData.billFromCity ||
        !formData.billFromPostalCode ||
        !formData.billFromCountry ||
        !formData.billToStreetAddress ||
        !formData.billToCity ||
        !formData.billToPostalCode ||
        !formData.billToCountry ||
        !formData.clientName ||
        !formData.clientEmail ||
        !formData.invoiceDate ||
        !formData.dueDate ||
        formData.items.length === 0
      ) {
        alert('Please fill out all fields.');
        return;
      }
  
      const ref = await generateCode(); 
      const newtotal = calculateTotal();
      
      
      const {
        billFromStreetAddress,
        billFromCity,
        billFromPostalCode,
        billFromCountry,
        billToStreetAddress,
        billToCity,
        billToPostalCode,
        billToCountry,
        clientName,
        clientEmail,
        status,
        invoiceDate,
        dueDate,
        items
      } = formData;

      //insert to invoices
      
      const { data: insertData, error: insertError } = await supabase
        .from('Invoice')
        .insert({
          billFromStreetAddress,
          billFromCity,
          reference: ref, 
          billFromPostal: billFromPostalCode,
          billFromCountry,
          billToAddress: billToStreetAddress,
          billToCity,
          billToPostal: billToPostalCode,
          billToCountry,
          clientName,
          clientEmail,
          status,
          total: newtotal,
          invoiceDate,
          dueDate,
          user_id: localStorage.getItem('userId')
        });
  
      if (insertError) {
        console.error('Error inserting into Invoice table:', insertError);
        return;
      }

      //select recent Invoice_id entry to use for different table
  
      const { data: lastInsertData, error: lastInsertError } = await supabase
        .from('Invoice')
        .select('Invoice_id')
        .order('Invoice_id', { ascending: false })
        .limit(1);
  
      if (lastInsertError) {
        console.error('Error fetching last inserted ID:', lastInsertError);
        return;
      }
  
      const insertedId = lastInsertData[0].Invoice_id;

      //use Invoice_id to set Invoice items

      const itemsToInsert = items.map((item) => ({
        Invoice_id: insertedId,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      }));
  
      const { data: itemsInsertData, error: itemsInsertError } = await supabase
        .from('Items')
        .insert(itemsToInsert);
  
      if (itemsInsertError) {
        console.error('Error inserting items into InvoiceItems table:', itemsInsertError);
        return;
      }
  
      console.log('Data inserted successfully. Inserted ID:', insertedId);
      navigate('../');
      if (!validateDates()) {
        console.error('Due date must be after the invoice date.');
        setValidationError('Due date must be after the invoice date.');
        return;
      }

      console.log('Data inserted successfully. Inserted ID:', insertedId);
      navigate('../');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };


  return (
    <div className="flex items-center justify-center  m-8  text-cream">
      <div className='bg-card p-6 rounded-lg shadow-md'>
      <Link to="../">
      <button className='bg-cream text-card px-4 py-2 rounded-md mt-4 mb-4 flex items-center gap-4'>
        <div className='fill-white'>
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="10" viewBox="0 0 320 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </div>
        Go Back
      </button>
      </Link>
      <h2 className="text-1xl text-cream font-bold mb-4 mt-12">Bill From</h2>
  
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Street Address</label>
        <input
          type="text"
          className="mt-1 p-2 bg-cream text-card outline-none w-full rounded-md"
          value={formData.billFromStreetAddress}
          onChange={(e) => setFormData({ ...formData, billFromStreetAddress: e.target.value })}
        />
      </div>
  
      <div className="mb-4 flex gap-5 flex-col md:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-600">City</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
            value={formData.billFromCity}
            onChange={(e) => setFormData({ ...formData, billFromCity: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Postal Code</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
            value={formData.billFromPostalCode}
            onChange={(e) => {
              const postalCode = e.target.value.replace(/\D/g, '').slice(0, 4); // Extract only numbers and limit to 4 characters
              setFormData({ ...formData, billFromPostalCode: postalCode });
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Country</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
            value={formData.billFromCountry}
            onChange={(e) => setFormData({ ...formData, billFromCountry: e.target.value })}
          />
        </div>
      </div>
  
      <h2 className="text-1xl text-cream font-bold mb-4 mt-12">Bill To</h2>
  
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Client Name</label>
        <input
          type="text"
          className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Client Email</label>
        <input
          type="email"
          className="mt-1 p-2 w-full bg-cream text-card outline-none rounded-md"
          value={formData.clientEmail}
          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Street Address</label>
        <input
          type="text"
          className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
          value={formData.billToStreetAddress}
          onChange={(e) => setFormData({ ...formData, billToStreetAddress: e.target.value })}
        />
      </div>
  
      <div className="mb-4 flex gap-5 flex-col md:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-600">City</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
            value={formData.billToCity}
            onChange={(e) => setFormData({ ...formData, billToCity: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Postal Code</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream w-full text-card outline-none rounded-md"
            value={formData.billToPostalCode}
            onChange={(e) => {
              const postalCode = e.target.value.replace(/\D/g, '').slice(0, 4);
              setFormData({ ...formData, billToPostalCode: postalCode }); // Set the processed postal code
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Country</label>
          <input
            type="text"
            className="mt-1 p-2 bg-cream text-card outline-none w-full rounded-md"
            value={formData.billToCountry}
            onChange={(e) => setFormData({ ...formData, billToCountry: e.target.value })}
          />
        </div>
      </div>
      <div className='flex justify-between'>
        <div>
          <label htmlFor="issueDate">Issue Date:</label>
          <DatePicker
            id="issueDate"
            selected={issueDate}
            onChange={handleIssueDateChange}
            dateFormat="yyyy-MM-dd"
            className='bg-cream p-2 rounded ml-2 text-card'
          />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <DatePicker
            id="dueDate"
            selected={dueDate}
            onChange={handleDueDateChange}
            dateFormat="yyyy-MM-dd"
            className='bg-cream p-2 rounded ml-2 text-card'
          />
        </div>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2 mt-12">Add Item</h3>
      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={formData.currentItem.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="p-2 bg-cream text-card outline-none rounded-md"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.currentItem.quantity}
          onChange={(e) => handleInputChange('quantity', parseInt(e.target.value, 10))}
          className="p-2 bg-cream text-card outline-none rounded-md"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.currentItem.rate}
          onChange={(e) => handleInputChange('rate', parseFloat(e.target.value))}
          className="p-2 bg-cream text-card outline-none rounded-md "
        />
      </div>
      <button
        className="bg-cream text-card px-4 py-2 rounded-md mt-5 mb-12"
        onClick={handleAddItem}
      >
        Add Item
      </button>
    </div>

    <div className="mt-4 bg-cream text-card rounded-lg">
      <table className="w-full text-[small] md:text-base">
        <thead>
          <tr className="">
            <th className="p-2">Item </th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Rate</th>
            <th className="p-2">Total</th>
            <th className="p-2">Action</th>
            
          </tr>
        </thead>
        <tbody>
          {formData.items.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="p-2">{item.description}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">R{item.rate}</td>
              <td className="p-2">R{(item.quantity * item.rate).toFixed(2)}</td>
              <td className="p-2">
                <button
                  className="bg-warn text-card px-2 py-1 rounded-md"
                  onClick={() => handleDeleteItem(index)}
                >
                  <div className='fill-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                  </div>
                </button>
              </td>
            </tr>
          ))}
          <tr className='p-2'>
            <td className='text-center'>
              <p>Due</p>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td className='pt-2 pb-2'>
              <div className="mt-4 ">
                <h3 className="text text-center font-semibold mb-2 text-white">R{calculateTotal()}</h3>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="mt-8">
      <button className="bg-cream text-card px-6 py-3 rounded-md" onClick={handleGenerateInvoice}>
        Generate Invoice
      </button>
    </div>
  </div>
  </div>
);

      


  function calculateTotal() {
    return formData.items.reduce((total, item) => total + item.quantity * item.rate, 0).toFixed(2);
  }
};

export default AddInvoice;
