import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

function Card({ data }) {
  const { reference, dueDate, clientName, total, status,Invoice_id } = data;

  const id = Invoice_id;
  const containerClasses = classnames('rounded', {
    'bg-orangebg': status === 'pending',
    'bg-greenbg': status !== 'pending',
  });

  const textClasses = classnames('p-3', {
    'text-orangetext': status === 'pending',
    'text-greentext': status !== 'pending',
  });

  return (
    <>
   <Link to={`../view/${id}`}>
    <div className='card w-[300px] flex flex-col md:flex-row gap-5  justify-between p-7 bg-card rounded-lg'>
        <div className='flex justify-between w-full w-[350px] text-cream'>
            <div className=''>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" fill='#E6DBD0'><path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z"/></svg>
            </div>
            <div>
              <div className='ref'>
                  <p>{reference}</p>
              </div>
              <div className='due-date text-left'>
                  <p>Due {dueDate}</p>
              </div>
              {/* <div className='client'>
                  <p>{clientName}</p>
              </div> */}
              {/* <div className='amount'>
                  <p>R {total}</p>
              </div> */}
            </div>
              <div className={containerClasses}>
            {/* <p className={textClasses}>
              <span>&bull;</span>
              {status}
            </p> */}
          </div>
          <div className='flex items-center'>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512" width="8" fill='#E6DBD0'><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
            </button>
          </div>
        </div>
    </div>
    </Link>
    </>
  );
}

export default Card;
