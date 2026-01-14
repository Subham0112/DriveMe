import React from 'react'

const ShowRaiders = ({ onSelectRider }) => {
  const riders = [
    {
      id: 1,
      name: 'John Smith',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      vehicle: 'Toyota Camry',
      rating: '4.8',
      trips: '234',
      arrivalTime: '2',
      price: '15',
      duration: '5',
      distance: '3.2',
      plateNumber: 'ABC 1234',
      color: 'Silver',
      capacity: '4'
    },
    {
      id: 2,
      name: 'Mike Johnson',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80',
      vehicle: 'Honda Civic',
      rating: '4.9',
      trips: '312',
      arrivalTime: '5',
      price: '18',
      duration: '6',
      distance: '4.5',
      plateNumber: 'XYZ 5678',
      color: 'Black',
      capacity: '4'
    },
    {
      id: 3,
      name: 'Alex Brown',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80',
      vehicle: 'Tesla Model 3',
      rating: '5.0',
      trips: '456',
      arrivalTime: '8',
      price: '25',
      duration: '7',
      distance: '5.8',
      plateNumber: 'DEF 9012',
      color: 'White',
      capacity: '4'
    }
  ]

  return (
    <>
      <h3 className='text-center text-lg mt-2 font-semibold'>
        Available Raiders
      </h3>
      <ul className='mt-2 px-4'>
        {riders.map((rider) => (
          <li 
            key={rider.id}
            onClick={() => onSelectRider(rider)}
            className='flex  shadow-lg shadow-gray-300/50   items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-gray-100 mb-3'
          >
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden'>
              <img 
                src={rider.image} 
                alt='Raider' 
                className='w-full h-full object-cover' 
              />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-semibold text-gray-900'>{rider.name}</div>
              <div className='text-sm text-gray-500 truncate'>{rider.vehicle} </div>
              <div className='text-xs text-gray-400 mt-0.5'>{rider.arrivalTime} mins away</div>
            </div>
            <div className='text-right'>
              <div className='text-lg font-bold text-gray-900'>${rider.price}</div>
              <div className='text-xs text-gray-500'>{rider.duration} min ride</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ShowRaiders