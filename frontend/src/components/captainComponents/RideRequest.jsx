import React from 'react'

const rideRequest = () => {

  const riderRequests = [
    {
      name: 'John Doe',
      location: 'San Francisco, CA',
      destination: 'New York, NY',
      fare: '$25',
      time: '12 mins ago',
    },
    {
      name: 'John Doe',
      location: 'San Francisco, CA',
      destination: 'New York, NY',
      fare: '$25',
      time: '12 mins ago',
    },
    {
      name: 'John Doe',
      location: 'San Francisco, CA',
      destination: 'New York, NY',
      fare: '$25',
      time: '12 mins ago',
    },
  ]
  return (
    <>
      <div className='px-[15px] py-[5px] bg-[white] relative md:max-w-md md:mx-auto md:rounded-t-2xl md:shadow-xl max-h-[40vh]'>
        <h3> Ride Requests</h3>
        {/* this is for rider component so user information will be displaying user requests with user name, picup location-destination, their fare */}
        <div className='flex flex-col space-y-3'>
          <div className='flex items-center space-x-3'>
               <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden'>
              <img 
                src={'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80'} 
                alt='Raider' 
                className='w-full h-full object-cover' 
              />
            </div>
            <div>
              <h4 className='font-bold'>John Doe</h4>
              <p className='text-sm'>San Francisco, CA</p>
            </div>
            <div className='text-sm'>
              <p>Requested</p>
              <p>12 mins ago</p>
            </div>
          </div>
          {riderRequests.map((request, index) => (
            <div key={index} className='flex items-center space-x-3'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden'>
              <img 
                src={'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80'} 
                alt='Raider' 
                className='w-full h-full object-cover' 
              />
            </div>
              <div>
                <h4 className='font-bold'>John Doe</h4>
                <p className='text-sm'>San Francisco, CA</p>
              </div>
              <div className='text-sm'>
                <p>Requested</p>
                <p>12 mins ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default rideRequest
