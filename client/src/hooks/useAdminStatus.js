import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export const useAdminStatus = () => {
  const [isAdminCheck, setIsAdminCheck] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user && user.is_admin) {
        setIsAdminCheck(true)
    } else {
        setIsAdminCheck(false)
    }
    setCheckingStatus(false)
  }, [user])

  return { isAdminCheck, checkingStatus }
}