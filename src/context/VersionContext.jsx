import { createContext, useContext, useState } from 'react'

export const VersionContext = createContext('3.0')

export function VersionProvider({ children }) {
  const [version, setVersion] = useState('3.0')
  return (
    <VersionContext.Provider value={{ version, setVersion }}>
      {children}
    </VersionContext.Provider>
  )
}

export const useVersion = () => useContext(VersionContext)
