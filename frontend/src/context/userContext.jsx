import React from 'react'


export const UserContext = React.createContext()

const userContext = ({ children }) => {

  const [user, setUser] = React.useState({

    fullname: {
      firstname: '',
      lastname: '',
    },
    email: '', 
  }

  )

  return (
    <UserContext.Provider value={[user, setUser ]}>
    <div>
     {children}
    </div>
    </UserContext.Provider>
  )
}

export default userContext
