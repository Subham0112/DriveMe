import React from 'react'


export const UserDataContext = React.createContext()

const UserContext = ({ children }) => {

  const [user, setUser] = React.useState({

    fullname: {
      firstname: '',
      lastname: '',
    },
    email: '', 
  }

  )

  return (
    <UserDataContext.Provider value={{user, setUser }}>
    <div>
     {children}
    </div>
    </UserDataContext.Provider>
  )
}

export default UserContext;
