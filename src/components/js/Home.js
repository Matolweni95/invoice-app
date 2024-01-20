import React from 'react';

function Home({ children }) {
  return (
    <div className='home'>
      <div className="flex flex-col md:flex-row h-full">
        <nav className="bg-blue2 w-full md:w-20 justify-between md:flex flex-col items-center">
          <div className="mt-5 md:mt-10 md:mb-10 mb-5">
            <a href="#">
              <img
                src="https://randomuser.me/api/portraits/women/76.jpg"
                className="rounded-full w-10 h-10 mb-3 mx-auto"
              />
            </a>
            {/* <div className="mt-10"></div> */}
          </div>
          
        </nav>
        <div className="main px-3 md:px-16 text-[--text] py-4 h-screen w-full flex flex-col overflow-y-auto">
          <div className='main__content'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
