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
    <div className='card w-full flex flex-col md:flex-row gap-5 items-center justify-around p-7 bg-card rounded-lg'>
        <div className='ref'>
            <p>{reference}</p>
        </div>
        <div className='due-date text-left'>
            <p>Due {dueDate}</p>
        </div>
        <div className='client'>
            <p>{clientName}</p>
        </div>
        <div className='amount'>
            <p>R {total}</p>
        </div>
        <div className={containerClasses}>
      <p className={textClasses}>
        <span>&bull;</span>
        {status}
      </p>
    </div>


    </div>
    </Link>
    </>
  );
}

export default Card;
