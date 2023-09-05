import React from 'react'

const UserCard = ({ user, handleFunction }) => {
  return <main onClick={ handleFunction } className='bg-[#161719] w-[85%] px-4 pt-4 my-2 rounded-xl h-fit cursor-pointer'>
    <div className='flex flex-col space-y-2 '>
      <div className='flex flex-row justify-start items-center space-x-4'>
        <img src={user.pic} alt='User Image' className='w-10 h-10 rounded-xl'/>
        <h3>{ user.name }</h3>
      </div>
      <p className=" text-start">{ user.email }.</p><br/>
    </div>
  </main>;
};

export default UserCard