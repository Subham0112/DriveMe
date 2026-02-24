import React from 'react';
import { MapPin, Navigation, DollarSign, Clock } from 'lucide-react';

const RideRequest = () => {
  const riderRequests = [
    {
      id: 1,
      name: 'John Doe',
      rating: 4.8,
      pickup: '123 Market St, San Francisco',
      destination: '456 Broadway, Oakland',
      fare: '$25',
      distance: '12.5 mi',
      time: '2 mins ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 4.9,
      pickup: '789 Mission St, San Francisco',
      destination: '321 Castro St, Mountain View',
      fare: '$35',
      distance: '18.3 mi',
      time: '5 mins ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 4.7,
      pickup: '555 Howard St, San Francisco',
      destination: '888 El Camino Real, Palo Alto',
      fare: '$42',
      distance: '25.7 mi',
      time: '8 mins ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80'
    },
  ];

  return (
    <div className='w-full h-full bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10'>
        <h3 className='text-lg font-bold text-gray-800'>Available Ride Requests</h3>
        <p className='text-xs text-gray-500 mt-0.5'>{riderRequests.length} passengers waiting</p>
      </div>

      {/* Ride Request Cards */}
      <div className='p-3 space-y-2'>
        {riderRequests.map((request) => (
          <div 
            key={request.id} 
            className='bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden'
          >
            <div className='p-3'>
              {/* Header with User Info and Time */}
              <div className='flex items-start justify-between mb-2'>
                <div className='flex items-center gap-2.5'>
                  <div className='relative'>
                    <img 
                      src={request.avatar} 
                      alt={request.name}
                      className='w-10 h-10 rounded-full object-cover ring-2 ring-blue-100' 
                    />
                    <div className='absolute -bottom-0.5 -right-0.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white'></div>
                  </div>
                  <div>
                    <h4 className='font-semibold text-sm text-gray-800'>{request.name}</h4>
                    <div className='flex items-center gap-1'>
                      <span className='text-yellow-500 text-xs'>★</span>
                      <span className='text-xs font-medium text-gray-600'>{request.rating}</span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='flex items-center gap-1 text-gray-500 text-xs'>
                    <Clock size={10} />
                    <span>{request.time}</span>
                  </div>
                  <div className='text-xl font-bold text-green-600 mt-0.5'>{request.fare}</div>
                </div>
              </div>

              {/* Route Information */}
              <div className='space-y-1.5 mb-2.5 pl-0.5'>
                {/* Pickup Location */}
                <div className='flex items-start gap-2.5'>
                  <div className='mt-0.5'>
                    <div className='w-2 h-2 rounded-full bg-blue-500'></div>
                  </div>
                  <div className='flex-1'>
                    <p className='text-[10px] text-gray-500 font-medium'>PICKUP</p>
                    <p className='text-xs text-gray-800 font-medium leading-tight'>{request.pickup}</p>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className='flex items-start gap-2.5'>
                  <div className='ml-0.5'>
                    <div className='w-0.5 h-3 bg-gray-300'></div>
                  </div>
                </div>

                {/* Destination */}
                <div className='flex items-start gap-2.5'>
                  <div className='mt-0.5'>
                    <MapPin size={12} className='text-red-500' fill='#ef4444' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-[10px] text-gray-500 font-medium'>DESTINATION</p>
                    <p className='text-xs text-gray-800 font-medium leading-tight'>{request.destination}</p>
                  </div>
                </div>
              </div>

              {/* Distance Info and Action Button */}
              <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                <div className='flex items-center gap-3 text-xs text-gray-600'>
                  <div className='flex items-center gap-1'>
                    <Navigation size={12} className='text-blue-500' />
                    <span className='font-medium'>{request.distance}</span>
                  </div>
                </div>
                <button className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105'>
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideRequest;