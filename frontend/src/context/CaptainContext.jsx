import React from 'react'


export const CaptainDataContext = React.createContext()

const CaptainContext = ({ children }) => {

  const [captain, setCaptain] = React.useState({

    fullname: {
      firstname: '',
      lastname: '',
    },
    email: '', 
    password: '', 
    phone: '', 
    vehicle: {
      color: '',
      plate: '',
      capacity: '',
      vehicleType: 'car'
    }
  }

  )

  return (
    <CaptainDataContext.Provider value={{captain, setCaptain }}>
    <div>
     {children}
    </div>
    </CaptainDataContext.Provider>
  )
}

export default CaptainContext;
