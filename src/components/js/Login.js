import React, { useEffect, useState } from 'react';
import google from '../../assets/google.svg';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

function Login({ isLoggedIn, setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
};


  const handleAuth = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        console.log('Email and password are required');
        return;
      }
  
      if (isLogin) {
        const { data: existingUser, error: fetchError } = await supabase
          .from('Users')
          .select('user_id, email, password')
          .eq('email', email)
          .single();
  
        if (fetchError) {
          console.log('User does not exist in the database');
          return;
        }
  
        if (!existingUser) {
          console.log('User does not exist in the database');
          return;
        }
  
        if (isLogin && existingUser && existingUser.password === password) {
          setIsLoggedIn(true);
          localStorage.setItem('loggedin', true)
          localStorage.setItem('userId', existingUser.user_id);
          navigate('/home');
        } else {
          console.log('Incorrect password');
        }
      } else {
        const { data: existingUsers, error: checkError } = await supabase
          .from('Users')
          .select('user_id, email')
          .eq('email', email);
  
        if (checkError) {
          console.error('Error checking existing user:', checkError.message);
          return;
        }
  
        if (existingUsers && existingUsers.length > 0) {
          console.log('Email is already registered');
          return;
        }
  
        const { data: newUser, error: registrationError } = await supabase
          .from('Users')
          .insert([{ email, password, name }]);
  
        if (registrationError) {
          console.error('Error registering user:', registrationError.message);
          return;
        }
  
        console.log('User registered successfully:', newUser);
      }
    } catch (error) {
      console.error('Supabase error:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
      <div className='login'>
        <div className=' relative flex items-center justify-center h-screen'>
          <div className='loginNav bg-white p-9 w-[448px] h-[570px] absolute rounded-[20px]'>
            <div className='flex justify-between mb-3'>
              <div></div>
              <button onClick={clearForm}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20">
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
              </button>
            </div>
            <h1 className='text-lg text-center mb-7'>
              Welcome Invoice ME
            </h1>
            <div className='flex justify-center mb-6'>
              <div>
                <button
                  onClick={() => setIsLogin(true)}
                  className='w-[114px] mb-4'
                >
                  Sign in
                </button>
                <div className={`login_underline ${isLogin ? 'bg-vanilla h-[5px]' : 'bg-vanilla h-[2px] mt-[3px]'}`} />
              </div>
              <div>
                <button
                  onClick={() => setIsLogin(false)}
                  className='w-[114px] mb-4'
                >
                  Register
                </button>
                <div className={`register_underline ${isLogin ? 'bg-register h-[2px] mt-[3px]' : 'bg-register h-[5px]'}`} />
              </div>
            </div>
            <div>
              <div className={!isLogin ? 'login' : 'Register'}>
                <div className='flex flex-col gap-5'>
                  <div className='flex border border-gray p-3 rounded-[10px]'>
                    <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20">
                      <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
                    </svg>
                    <input
                      className='outline-none'
                      placeholder='Enter Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className='flex border border-gray p-3 rounded-[10px]'>
                    <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20">
                      <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/>
                    </svg>
                    <input
                      type='password'
                      className='outline-none'
                      placeholder='Enter Password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {!isLogin && ( 
                    <div className='flex border border-gray p-3 rounded-[10px]'>
                      <svg className='mr-3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20">
                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
                      </svg>
                      <input
                        type='text'
                        className='outline-none'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                      />
                    </div>
                  )}
                </div>
                <div className='w-full mt-5'>
                  <button
                    className={`bg-${isLogin ? 'vanilla' : 'register'} text-white w-full p-3 rounded-[10px]`}
                    onClick={handleAuth}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
                  </button>
                </div>
                {isLogin && (
                  <div>
                    <p className='text-blue text-center mt-5 font-semibold'>Forgot your password?</p>
                  </div>
                )}
              </div>
              <p className='text-sm text-center font-semibold mt-6'>
                By continuing I understand and agree with Invoice ME’s
                <span className='text-blue'> Terms & Conditions</span> and
                <span className='text-blue'> Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;