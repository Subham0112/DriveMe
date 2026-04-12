import React, { useContext, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { CaptainDataContext } from '../context/CaptainContext'
import {
  User, Mail, Phone, Calendar, Car, Edit3, Check,
  X, Lock, Eye, EyeOff, Hash, Users, Palette, Star
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const CaptainProfile = ({ handleAlert }) => {
  const { captain, setCaptain } = useContext(CaptainDataContext)

  const [editMode, setEditMode] = useState(false)
  const [editVehicle, setEditVehicle] = useState(false)
  const [changePassword, setChangePassword] = useState(false)

  const [form, setForm] = useState({
    firstname: '', lastname: '', email: '', phone: '', farePerKm: '',
  })
  const [vehicleForm, setVehicleForm] = useState({
    color: '', plate: '', capacity: '', vehicleType: '', farePerKm: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  })
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  const [loading, setLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [allTimeStats, setAllTimeStats] = useState({ totalEarned: 0, ridesCompleted: 0 })

  // Fetch captain profile + stats on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setFetchLoading(true)
      try {
        const res = await fetch(`${API_BASE}/captains/profile`, { credentials: 'include' })
        const data = await res.json()
        if (data?._id) {
          setCaptain(data)
          syncForms(data)
        }
      } catch (err) {
        console.error('Failed to load captain profile:', err)
      } finally {
        setFetchLoading(false)
      }
    }

    const fetchStats = async (captainId) => {
      try {
        const res = await fetch(`${API_BASE}/rides/captain-all-stats/${captainId}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success) setAllTimeStats({ totalEarned: data.totalEarned, ridesCompleted: data.totalRides })
      } catch {}
    }

    fetchProfile().then(() => {
      // Use captain from context after fetch (or re-fetch id)
      const id = captain?._id
      if (id) fetchStats(id)
    })
  }, [])

  // Re-sync stats once captain._id is available in context
  useEffect(() => {
    if (captain?._id) {
      syncForms(captain)
      fetch(`${API_BASE}/rides/captain-all-stats/${captain._id}`, { credentials: 'include' })
        .then(r => r.json()).then(d => { if (d.success) setAllTimeStats({ totalEarned: d.totalEarned, ridesCompleted: d.totalRides }) }).catch(() => {})
    }
  }, [captain?._id])

  const syncForms = (data) => {
    setForm({
      firstname:  data.fullname?.firstname  || '',
      lastname:   data.fullname?.lastname   || '',
      email:      data.email                || '',
      phone:      data.phone                || '',
      farePerKm:  data.farePerKm            || 20,
    })
    setVehicleForm({
      color:       data.vehicle?.color       || '',
      plate:       data.vehicle?.plate       || '',
      capacity:    data.vehicle?.capacity    || '',
      vehicleType: data.vehicle?.vehicleType || 'car',
    })
  }

  // ── Toggle online/offline status ──────────────────────────────
  const handleToggleStatus = async () => {
    const newStatus = captain?.status === 'active' ? 'inactive' : 'active'
    setStatusLoading(true)
    try {
      const res = await fetch(`${API_BASE}/captains/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setCaptain(prev => ({ ...prev, status: newStatus }))
        showLocalAlert('success', `You are now ${newStatus === 'active' ? 'Online' : 'Offline'}`)
      } else {
        showLocalAlert('error', data.message || 'Could not update status.')
      }
    } catch {
      showLocalAlert('error', 'Network error. Please try again.')
    } finally {
      setStatusLoading(false)
    }
  }

  const showLocalAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 3500)
  }

  const handleEditToggle = () => {
    if (editMode) syncForms(captain)
    setEditMode(!editMode)
    setEditVehicle(false)
    setChangePassword(false)
  }

  // ── Save personal info ─────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!form.firstname.trim() || !form.lastname.trim() || !form.email.trim()) {
      return showLocalAlert('error', 'Name and email are required.')
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/captains/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullname: { firstname: form.firstname.trim(), lastname: form.lastname.trim() },
          email:      form.email.trim(),
          phone:      form.phone.trim(),
          farePerKm:  parseFloat(form.farePerKm) || 20,
        }),
      })
      const data = await res.json()
      if (data.captain || data._id) {
        setCaptain(prev => ({ ...prev, ...(data.captain || data) }))
        handleAlert?.({ type: 'success', title: 'Saved', description: 'Profile updated successfully!' })
        setEditMode(false)
      } else {
        handleAlert?.({ type: 'danger', title: 'Error', description: data.message || 'Could not update profile.' })
      }
    } catch {
      handleAlert?.({ type: 'danger', title: 'Error', description: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Save vehicle info ──────────────────────────────────────────
  const handleSaveVehicle = async () => {
    if (!vehicleForm.color || !vehicleForm.plate || !vehicleForm.capacity) {
      return showLocalAlert('error', 'All vehicle fields are required.')
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/captains/vehicle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vehicle: vehicleForm }),
      })
      const data = await res.json()
      if (data.captain || data._id) {
        setCaptain(prev => ({ ...prev, ...(data.captain || data) }))
        handleAlert?.({ type: 'success', title: 'Saved', description: 'Vehicle details updated!' })
        setEditVehicle(false)
      } else {
        handleAlert?.({ type: 'danger', title: 'Error', description: data.message || 'Could not update vehicle.' })
      }
    } catch {
      handleAlert?.({ type: 'danger', title: 'Error', description: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // ── Change password ────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return showLocalAlert('error', 'Please fill all password fields.')
    }
    if (passwordForm.newPassword.length < 6) {
      return showLocalAlert('error', 'New password must be at least 6 characters.')
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showLocalAlert('error', 'New passwords do not match.')
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/captains/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword:     passwordForm.newPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showLocalAlert('success', 'Password changed successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setChangePassword(false)
      } else {
        showLocalAlert('error', data.message || 'Could not change password.')
      }
    } catch {
      showLocalAlert('error', 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const initials   = `${captain?.fullname?.firstname?.charAt(0) || ''}${captain?.fullname?.lastname?.charAt(0) || ''}`.toUpperCase()
  const fullName   = `${captain?.fullname?.firstname || ''} ${captain?.fullname?.lastname || ''}`.trim()
  const memberSince = captain?.dateJoined
    ? new Date(captain.dateJoined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : captain?.createdAt
    ? new Date(captain.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  const vehicleTypeLabel = {
    car: 'Car', motorcycle: 'Motorcycle', scooter: 'Scooter', 'auto-rickshaw': 'Auto Rickshaw',
  }

  if (fetchLoading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-gray-50'>
        <div className='w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="captain" />

      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className='p-6 max-w-2xl mx-auto'>

          {/* Toast — fixed position so it never shifts layout */}
          {alert && (
            <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all pointer-events-none ${
              alert.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {alert.type === 'success' ? <Check size={16} /> : <X size={16} />}
              {alert.msg}
            </div>
          )}

          {/* ── Avatar + Name ─────────────────────────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <div className='flex items-center gap-5'>
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0'>
                {initials || <User size={28} />}
              </div>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900'>{fullName || 'Captain'}</h2>
                <p className='text-sm text-gray-500'>{captain?.email}</p>
                <div className='flex items-center gap-2 mt-1'>
                  <span className='inline-block text-xs bg-orange-50 text-orange-600 font-semibold px-3 py-0.5 rounded-full border border-orange-100'>
                    Captain
                  </span>
                </div>
              </div>
              <button
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  editMode
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                {editMode ? <><X size={15} /> Cancel</> : <><Edit3 size={15} /> Edit</>}
              </button>
            </div>
          </div>

          {/* ── Online / Offline Status Toggle ───────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  captain?.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    captain?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <p className='text-sm font-bold text-gray-900'>
                    {captain?.status === 'active' ? 'You are Online' : 'You are Offline'}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {captain?.status === 'active'
                      ? 'Accepting ride requests'
                      : 'Not receiving ride requests'}
                  </p>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={handleToggleStatus}
                disabled={statusLoading}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-60 ${
                  captain?.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center ${
                  captain?.status === 'active' ? 'translate-x-7' : 'translate-x-0'
                }`}>
                  {statusLoading && (
                    <span className='w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></span>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* ── All-Time Stats Banner ────────────────────────────── */}
          <div className='bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 mb-4 flex gap-4'>
            <div className='flex-1 text-center'>
              <p className='text-orange-100 text-xs font-medium mb-1'>Total Earned</p>
              <p className='text-white text-3xl font-bold'>Rs.{allTimeStats.totalEarned}</p>
            </div>
            <div className='w-px bg-orange-300'></div>
            <div className='flex-1 text-center'>
              <p className='text-orange-100 text-xs font-medium mb-1'>Total Rides</p>
              <p className='text-white text-3xl font-bold'>{allTimeStats.ridesCompleted}</p>
            </div>
          </div>

          {/* ── Personal Information ─────────────────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <h3 className='text-base font-semibold text-gray-800 mb-4'>Personal Information</h3>

            {editMode ? (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>First Name</label>
                    <input value={form.firstname} onChange={e => setForm(p => ({ ...p, firstname: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Last Name</label>
                    <input value={form.lastname} onChange={e => setForm(p => ({ ...p, lastname: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                  </div>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>Email</label>
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} type='email'
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-500 mb-1'>Fare per km (Rs.)</label>
                  <input value={form.farePerKm} onChange={e => setForm(p => ({ ...p, farePerKm: e.target.value }))} type='number' min='1'
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                </div>
                <button onClick={handleSaveProfile} disabled={loading}
                  className='w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60'>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className='space-y-3'>
                {[
                  { icon: <User size={15} className='text-blue-500' />, bg: 'bg-blue-50',    label: 'Full Name',    value: fullName },
                  { icon: <Mail size={15} className='text-indigo-500' />, bg: 'bg-indigo-50', label: 'Email',        value: captain?.email },
                  { icon: <Phone size={15} className='text-green-500' />, bg: 'bg-green-50',  label: 'Phone',        value: captain?.phone },
                  { icon: <Star size={15} className='text-orange-500' />, bg: 'bg-orange-50', label: 'Fare per km',  value: `Rs.${captain?.farePerKm || 20}/km` },
                  { icon: <Calendar size={15} className='text-purple-500' />, bg: 'bg-purple-50', label: 'Member Since', value: memberSince },
                ].map(({ icon, bg, label, value }) => (
                  <div key={label} className='flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0'>
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>{icon}</div>
                    <div>
                      <p className='text-xs text-gray-400 font-medium'>{label}</p>
                      <p className='text-sm font-semibold text-gray-800'>{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Vehicle Details ──────────────────────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-semibold text-gray-800'>Vehicle Details</h3>
              {!editMode && (
                <button onClick={() => { setEditVehicle(!editVehicle); setChangePassword(false) }}
                  className='flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg'>
                  {editVehicle ? <><X size={13} /> Cancel</> : <><Edit3 size={13} /> Edit</>}
                </button>
              )}
            </div>

            {editVehicle && !editMode ? (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Color</label>
                    <input value={vehicleForm.color} onChange={e => setVehicleForm(p => ({ ...p, color: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' placeholder='e.g. Red' />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Plate Number</label>
                    <input value={vehicleForm.plate} onChange={e => setVehicleForm(p => ({ ...p, plate: e.target.value.toUpperCase() }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' placeholder='e.g. BA 1 JA 1234' />
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Capacity</label>
                    <input value={vehicleForm.capacity} onChange={e => setVehicleForm(p => ({ ...p, capacity: e.target.value }))} type='number' min='1'
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none' />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'>Vehicle Type</label>
                    <select value={vehicleForm.vehicleType} onChange={e => setVehicleForm(p => ({ ...p, vehicleType: e.target.value }))}
                      className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none bg-white'>
                      <option value='car'>Car</option>
                      <option value='motorcycle'>Motorcycle</option>
                      <option value='scooter'>Scooter</option>
                      <option value='auto-rickshaw'>Auto Rickshaw</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveVehicle} disabled={loading}
                  className='w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60'>
                  {loading ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-3'>
                {[
                  { icon: <Car size={15} className='text-orange-500' />,     bg: 'bg-orange-50',  label: 'Type',     value: vehicleTypeLabel[captain?.vehicle?.vehicleType] || captain?.vehicle?.vehicleType },
                  { icon: <Hash size={15} className='text-blue-500' />,      bg: 'bg-blue-50',    label: 'Plate',    value: captain?.vehicle?.plate },
                  { icon: <Palette size={15} className='text-pink-500' />,   bg: 'bg-pink-50',    label: 'Color',    value: captain?.vehicle?.color },
                  { icon: <Users size={15} className='text-green-500' />,    bg: 'bg-green-50',   label: 'Capacity', value: captain?.vehicle?.capacity ? `${captain.vehicle.capacity} passengers` : '—' },
                ].map(({ icon, bg, label, value }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
                    <div className='flex-shrink-0'>{icon}</div>
                    <div>
                      <p className='text-[10px] text-gray-400 font-medium'>{label}</p>
                      <p className='text-sm font-bold text-gray-800 capitalize'>{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Change Password ──────────────────────────────────── */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4'>
            <button onClick={() => { setChangePassword(!changePassword); setEditMode(false); setEditVehicle(false) }}
              className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center'>
                  <Lock size={15} className='text-orange-500' />
                </div>
                <span className='text-sm font-semibold text-gray-800'>Change Password</span>
              </div>
              <span className='text-xs text-orange-500 font-medium'>{changePassword ? 'Close' : 'Update'}</span>
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
                        className='w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-orange-400 focus:outline-none'
                        placeholder={label}
                      />
                      <button type='button' onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                        {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={handleChangePassword} disabled={loading}
                  className='w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-60 mt-1'>
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

export default CaptainProfile