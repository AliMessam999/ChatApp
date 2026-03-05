import React, { useState } from 'react'
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';


function Signup() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className='min-h-screen flex items-center justify-center w-full' style={{backgroundColor: bgColor}}>
      <div className={`bg-white rounded-xl w-full max-w-md px-6 py-4 shadow-lg border`} style={{borderColor: borderColor}}>
        <h1 className={`text-2xl font-bold text-center`} style={{color: primaryColor}}>Vingo</h1>
        <p className={`text-center text-gray-500 mb-1`}>Create your account</p>
        {/* fullName */}
        <div className='mb-1'>
          <label htmlFor="fullName" className='block text-gray-700 font-medium text-sm mb-1'>Full Name</label>
          <input 
            type="text" 
            id='fullName' 
            className={`w-full px-3 py-1 border rounded-lg focus:outline-orange-500 focus:border-orange-500`} 
            style={{borderColor: borderColor}} 
            placeholder='Enter your full name'
            onChange={(e) => {setFullName(e.target.value)}}
            value={fullName} 
            required />
        </div>
        
        {/* email */}
        <div className='mb-1'>
          <label htmlFor="email" className='block text-gray-700 font-medium text-sm mb-1'>Email</label>
          <input 
            type="email" 
            id='email' 
            className={`w-full px-3 py-1 border rounded-lg focus:outline-orange-500 focus:border-orange-500`} 
            style={{borderColor: borderColor}} 
            placeholder='Enter your email' 
            onChange={(e) => {setEmail(e.target.value)}}
            value={email} 
            required />
        </div>
        
        {/* mobile */}
        <div className='mb-1'>
          <label htmlFor="mobile" className='block text-gray-700 font-medium text-sm mb-1'>Mobile</label>
          <input 
            type="text" 
            id='mobile' 
            className={`w-full px-3 py-1 border rounded-lg focus:outline-orange-500 focus:border-orange-500`} 
            style={{borderColor: borderColor}} 
            placeholder='Enter your mobile number' 
            onChange={(e) => {setMobile(e.target.value)}}
            value={mobile} 
            required />
        </div>
        
        {/* password */}
        <div className='mb-1'>
          <label htmlFor="password" className='block text-gray-700 font-medium text-sm mb-1'>Password</label>
          <div className='relative'>
            <input 
            type={showPassword ? "text" : "password"} 
            id='password' 
            className={`w-full px-3 py-1 border rounded-lg focus:outline-orange-500 focus:border-orange-500`} 
            style={{borderColor: borderColor}} 
            placeholder='Enter your password' 
            onChange={(e) => {setPassword(e.target.value)}}
            value={password}  
            required />
            <button type='button' className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
            {showPassword ? 
              <IoIosEye onClick={() => setShowPassword(false)} />
             : 
              <IoIosEyeOff onClick={() => setShowPassword(true)} />
            }
            </button>
          </div>
        </div>
        
        {/* role */}
        <div className='mb-4'>
          <label htmlFor="role" className='block text-gray-700 font-medium text-sm mb-1'>Role</label>
          <div className='flex gap-2'>
            {
              ["user", "owner", "deliveryBoy"].map((r) => {
                return <button className='flex-1 text-sm hover:!bg-orange-500 hover:!text-white border rounded-lg px-1 py-2 text-center font-medium transition-colors cursor-pointer' 
                  onClick={() => {setRole(r)}}
                  style={
                    role == r ? {backgroundColor: primaryColor, color: "white"} : { borderColor: primaryColor, color: primaryColor }
                  }>
                  {r}
                </button>
              })
            }
          </div>
        </div>

        {/* Sign Up Button */}
        <button type='submit' className='w-full py-2 rounded-lg font-medium transition-colors cursor-pointer transition duration-200' 
          style={{backgroundColor: primaryColor, color: "white"}}>
          Sign Up
        </button>
        {/* Or */}
        <div className="flex items-center justify-center gap-2 my-2 text-gray-400">
          <hr className='flex-1' />
          <span className='text-gray-400'>or</span>
          <hr className='flex-1' />
        </div>
        {/* Google Button */}
        <button className='w-full flex items-center justify-center cursor-pointer gap-2 transition duration-200 hover:bg-gray-200 border border-[#ddd] p-2 rounded-sm' style={{}}>
          <FcGoogle size={25}/>
          <span className='text-gray-700 font-medium'>Sign up with Google</span>
        </button>
        <span className='mx-auto w-full text-gray-400 block text-center mt-2'>Already have an Account? <Link to="/signin" className='text-orange-400 hover:underline hover:text-orange-500 cursor-pointer'>Sign In</Link></span>
          
      </div>
      
    </div>
  )
}

export default Signup