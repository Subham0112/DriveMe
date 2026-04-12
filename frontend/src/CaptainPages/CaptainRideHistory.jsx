import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { CaptainDataContext } from '../context/CaptainContext';
import { MapPin, Calendar, Filter, X, TrendingUp, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// ── Quick filter presets ───────────────────────────────────────────
const PRESETS = [
  { label: 'All time',   days: null },
  { label: 'Today',      days: 1 },
  { label: 'Last 7 days',days: 7 },
  { label: 'Last 30 days',days:30 },
  { label: 'Last 90 days',days:90 },
];

// ── Single ride card (rendered inside virtual window) ─────────────
const RideCard = ({ ride }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mx-1">
    {/* Top row */}
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="font-semibold text-sm text-gray-900">
          {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {new Date(ride.createdAt).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
        <p className="text-[10px] text-gray-300 mt-0.5">#{ride._id.slice(-6).toUpperCase()}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ${
        ride.rideStatus === 'completed'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'
      }`}>
        {ride.rideStatus === 'completed' ? 'Completed' : 'Cancelled'}
      </span>
    </div>

    {/* Route */}
    <div className="space-y-1.5 mb-3">
      <div className="flex items-start gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
        <p className="text-xs text-gray-600 leading-snug">{ride.pickup?.address}</p>
      </div>
      <div className="ml-0.5 w-0.5 h-3 bg-gray-200"></div>
      <div className="flex items-start gap-2">
        <MapPin size={10} className="text-red-500 flex-shrink-0 mt-1" fill="#ef4444" />
        <p className="text-xs text-gray-600 leading-snug">{ride.drop?.address}</p>
      </div>
    </div>

    {/* Bottom row */}
    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        {ride.distance > 0 && <span>{ride.distance} km</span>}
        {ride.duration > 0 && <span>{ride.duration} min</span>}
      </div>
      {ride.rideStatus === 'completed' ? (
        <span className="font-bold text-green-600 text-sm">Rs.{ride.fare}</span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      )}
    </div>
  </div>
);

// ── Simple virtual list using IntersectionObserver (no extra deps) ─
// Renders items in chunks as the user scrolls toward the sentinel.
const CHUNK_SIZE = 15;

const VirtualRideList = ({ rides }) => {
  const [rendered, setRendered] = useState(CHUNK_SIZE);
  const sentinelRef = useRef(null);

  // Reset when rides change (filter applied)
  useEffect(() => { setRendered(CHUNK_SIZE); }, [rides]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRendered(prev => Math.min(prev + CHUNK_SIZE, rides.length));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rides.length]);

  const visible = rides.slice(0, rendered);

  return (
    <div className="space-y-3">
      {visible.map(ride => (
        <RideCard key={ride._id} ride={ride} />
      ))}
      {/* Sentinel — triggers loading more */}
      {rendered < rides.length && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// ── Main page ──────────────────────────────────────────────────────
const CaptainRideHistory = () => {
  const { captain } = useContext(CaptainDataContext);

  const [rides, setRides]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [stats, setStats]         = useState({ totalRides: 0, totalEarned: 0 });
  const [showFilter, setShowFilter] = useState(false);

  // Filter state
  const [activePreset, setActivePreset] = useState(0)          // index into PRESETS
  const [customFrom, setCustomFrom]     = useState('')
  const [customTo, setCustomTo]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')       // 'all' | 'completed' | 'cancelled'

  const fetchHistory = useCallback(async ({ from, to } = {}) => {
    if (!captain?._id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to)   params.set('to',   to);

      const res = await fetch(
        `${API_BASE}/rides/captain-history/${captain._id}?${params}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.success) {
        setRides(data.rides);
        setStats({ totalRides: data.totalRides, totalEarned: data.totalEarned });
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  }, [captain?._id]);

  // Fetch on mount
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const applyPreset = (idx) => {
    setActivePreset(idx);
    setCustomFrom('');
    setCustomTo('');
    const preset = PRESETS[idx];
    if (!preset.days) {
      fetchHistory();
    } else {
      const from = new Date();
      from.setDate(from.getDate() - preset.days + 1);
      from.setHours(0, 0, 0, 0);
      fetchHistory({ from: from.toISOString() });
    }
  };

  const applyCustom = () => {
    if (!customFrom) return;
    fetchHistory({ from: customFrom, to: customTo || undefined });
    setActivePreset(-1);
    setShowFilter(false);
  };

  const resetFilters = () => {
    setActivePreset(0);
    setCustomFrom('');
    setCustomTo('');
    setStatusFilter('all');
    fetchHistory();
    setShowFilter(false);
  };

  // Client-side status filter on already-fetched rides
  const displayed = statusFilter === 'all'
    ? rides
    : rides.filter(r => r.rideStatus === statusFilter);

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-50">
      <Navbar userType="captain" />

      <div className="h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                showFilter ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-200'
              }`}
            >
              <Filter size={14} />
              Filter
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Completed Rides</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRides}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">Rs.{stats.totalEarned}</p>
              </div>
            </div>
          </div>

          {/* Filter panel */}
          {showFilter && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
              {/* Quick presets */}
              <p className="text-xs font-semibold text-gray-500 mb-2">Quick Range</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activePreset === i
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom date range */}
              <p className="text-xs font-semibold text-gray-500 mb-2">Custom Range</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-medium mb-1 block">From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-medium mb-1 block">To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status filter */}
              <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
              <div className="flex gap-2 mb-4">
                {['all', 'completed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === s
                        ? s === 'cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyCustom}
                  disabled={!customFrom}
                  className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50"
                >
                  <X size={14} /> Reset
                </button>
              </div>
            </div>
          )}

          {/* Result count */}
          {!loading && (
            <p className="text-xs text-gray-400 mb-3">
              Showing {displayed.length} ride{displayed.length !== 1 ? 's' : ''}
              {activePreset > 0 && ` · ${PRESETS[activePreset].label}`}
              {activePreset === -1 && customFrom && ` · ${customFrom}${customTo ? ` → ${customTo}` : ''}`}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400">Loading rides...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && displayed.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-2 text-gray-400">
              <Calendar size={36} className="opacity-30" />
              <p className="text-sm font-medium">No rides found</p>
              <p className="text-xs">Try a different date range or filter</p>
            </div>
          )}

          {/* Virtualized ride list */}
          {!loading && displayed.length > 0 && (
            <VirtualRideList rides={displayed} />
          )}

        </div>
      </div>
    </div>
  );
};

export default CaptainRideHistory;