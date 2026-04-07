import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { UserDataContext } from '../context/UserContext'
import { User, Mail, Phone, Calendar, Car, Edit3, Check, X, Lock, Eye, EyeOff } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const UserProfile = () => {
  const { user, setUser } = useContext(UserDataContext)

  // Edit mode state
  const [editMode, setEditMode] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  // Form fields
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  // UI state
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [alert, setAlert] = useState(null) // { type: 'success'|'error', msg: string }
  const [totalRides, setTotalRides] = useState(0)

  // Fetch fresh profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setFetchLoading(true)
      try {
        const res = await fetch(`${API_BASE}/users/profile`, { credentials: 'include' })
        const data = await res.json()
        if (data?._id) {
          setUser(data)
          setForm({
            firstname: data.fullname?.firstname || '',
            lastname: data.fullname?.lastname || '',
            email: data.email || '',
          })
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setFetchLoading(false)
      }
    }

    // Also fetch total ride count
    const fetchRideCount = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/ride-count`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) setTotalRides(data.count)
      } catch {}
    }

    fetchProfile()
    fetchRideCount()
  }, [])

  // Sync form when user context changes externally
  useEffect(() => {
    if (user?._id) {
      setForm({
        firstname: user.fullname?.firstname || '',
        lastname: user.fullname?.lastname || '',
        email: user.email || '',
      })
    }
  }, [user])

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 3500)
  }

  const handleEditToggle = () => {
    if (editMode) {
      // Reset form to current user data on cancel
      setForm({
        firstname: user.fullname?.firstname || '',
        lastname: user.fullname?.lastname || '',
        email: user.email || '',
      })
    }
    setEditMode(!editMode)
    setChangePassword(false)
  }

  const handleSaveProfile = async () => {
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim()) {
      return showAlert('error', 'All fields are required.')
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullname: { firstname: form.firstname.trim(), lastname: form.lastname.trim() },
          email: form.email.trim(),
        }),
      })
      const data = await res.json()
      if (data.user || data._id) {
        const updated = data.user || data
        setUser(prev => ({ ...prev, ...updated }))
        handleAlert({ type: 'success', title: 'Success', description: 'Profile updated successfully!' })
        setEditMode(false)
      } else {
        handleAlert({ type: 'danger', title: 'Error', description: data.message || 'Unable to update profile!' })
      }
    } catch (err) {
      handleAlert({ type: 'danger', title: 'Error', description: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return showAlert('error', 'Please fill all password fields.')
    }
    if (passwordForm.newPassword.length < 6) {
      return showAlert('error', 'New password must be at least 6 characters.')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showAlert('error', 'New passwords do not match.')
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showAlert('success', 'Password changed successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setChangePassword(false)
      } else {
        showAlert('error', data.message || 'Could not change password.')
      }
    } catch {
      showAlert('error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initials = `${user?.fullname?.firstname?.charAt(0) || ''}${user?.fullname?.lastname?.charAt(0) || ''}`.toUpperCase()
  const fullName = `${user?.fullname?.firstname || ''} ${user?.fullname?.lastname || ''}`.trim()
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  if (fetchLoading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-gray-50'>
        <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="user" />

      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className='p-6 max-w-2xl mx-auto'>

          {/* Alert */}
          {alert && (
            <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium ${
              alert.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {alert.type === 'success' ? <Check size={16} /> : <X size={16} />}
              {alert.msg}
            </div>
          )}

          {/* Avatar + Name */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <div className='flex items-center gap-5'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0'>
                {initials || <User size={28} />}
              </div>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900'>{fullName || 'User'}</h2>
                <p className='text-sm text-gray-500'>{user?.email}</p>
                <span className='inline-block mt-1 text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-0.5 rounded-full border border-blue-100'>
                  Passenger
                </span>
              </div>
              <button
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  editMode
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {editMode ? <><X size={15} /> Cancel</> : <><Edit3 size={15} /> Edit</>}
              </button>
            </div>
          </div>

          {/* Profile Details / Edit Form */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <h3 className='text-base font-semibold text-gray-800 mb-4'>Personal Information</h3>

            {editMode ? (
              // ── EDIT FORM ──────────────────────────────────────────
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>First Name</label>
                    <input
                      value={form.firstname}
                      onChange={e => setForm(p => ({ ...p, firstname: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'
                      placeholder='First name'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Last Name</label>
                    <input
                      value={form.lastname}
                      onChange={e => setForm(p => ({ ...p, lastname: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'
                      placeholder='Last name'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>Email</label>
                  <input
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    type='email'
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'
                    placeholder='Email address'
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60'
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              // ── READ-ONLY VIEW ─────────────────────────────────────
              <div className='space-y-4'>
                <div className='flex items-center gap-3 py-3 border-b border-gray-50'>
                  <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0'>
                    <User size={15} className='text-blue-500' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Full Name</p>
                    <p className='text-sm font-semibold text-gray-800'>{fullName || '—'}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3 py-3 border-b border-gray-50'>
                  <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0'>
                    <Mail size={15} className='text-indigo-500' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Email</p>
                    <p className='text-sm font-semibold text-gray-800'>{user?.email || '—'}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3 py-3'>
                  <div className='w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0'>
                    <Calendar size={15} className='text-green-500' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Member Since</p>
                    <p className='text-sm font-semibold text-gray-800'>{memberSince}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <h3 className='text-base font-semibold text-gray-800 mb-4'>Ride Statistics</h3>
            <div className='flex gap-3'>
              <div className='flex-1 bg-blue-50 rounded-xl p-4 text-center border border-blue-100'>
                <p className='text-3xl font-bold text-blue-600'>{totalRides}</p>
                <p className='text-xs text-blue-500 font-medium mt-1'>Total Rides</p>
              </div>
              <div className='flex-1 bg-green-50 rounded-xl p-4 text-center border border-green-100'>
                <p className='text-3xl font-bold text-green-600'>
                  {user?.createdAt
                    ? Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30))
                    : 0}
                </p>
                <p className='text-xs text-green-500 font-medium mt-1'>Months Active</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <button
              onClick={() => { setChangePassword(!changePassword); setEditMode(false) }}
              className='w-full flex items-center justify-between'
            >
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center'>
                  <Lock size={15} className='text-orange-500' />
                </div>
                <span className='text-sm font-semibold text-gray-800'>Change Password</span>
              </div>
              <span className='text-xs text-blue-500 font-medium'>
                {changePassword ? 'Close' : 'Update'}
              </span>
            </button>

            {changePassword && (
              <div className='mt-4 space-y-3'>
                {[
                  { key: 'current', label: 'Current Password', field: 'currentPassword' },
                  { key: 'new',     label: 'New Password',     field: 'newPassword' },
                  { key: 'confirm', label: 'Confirm Password', field: 'confirmPassword' },
                ].map(({ key, label, field }) => (
                  <div key={key}>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>{label}</label>
                    <div className='relative'>
                      <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={passwordForm[field]}
                        onChange={e => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                        className='w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'
                        placeholder={label}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                      >
                        {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className='w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60 mt-1'
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserProfile