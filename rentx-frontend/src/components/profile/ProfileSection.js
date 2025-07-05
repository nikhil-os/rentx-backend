'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/utils/api';

export default function ProfileSection() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [rentals, setRentals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [closedBookings, setClosedBookings] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        try {
          setLoading(true);
          // Fetch user profile data
          const userData = await api.get('/auth/profile');
          setUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            bio: userData.bio || '',
          });
          
          // Fetch user's bookings
          const userBookings = await api.get('/bookings/my');
          setBookings(userBookings || []);
          
          // Separate active and closed bookings
          const active = [];
          const closed = [];
          
          userBookings.forEach(booking => {
            const today = new Date();
            const endDate = new Date(booking.endDate || booking.returnDate);
            
            if (endDate >= today) {
              active.push(booking);
            } else {
              closed.push(booking);
            }
          });
          
          // Sort active bookings by end date (ascending)
          active.sort((a, b) => new Date(a.endDate || a.returnDate) - new Date(b.endDate || b.returnDate));
          
          // Sort closed bookings by end date (descending - most recent first)
          closed.sort((a, b) => new Date(b.endDate || b.returnDate) - new Date(a.endDate || a.returnDate));
          
          setActiveBookings(active);
          setClosedBookings(closed);
          
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load profile data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchUserData();
  }, [router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await api.put('/auth/update-profile', formData);
      setUser({
        ...user,
        ...formData,
      });
      setEditMode(false);
      // Show success message
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-800"></div>
      </div>
    );
  }
  
  if (error && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 h-48">
          <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-8 flex items-end">
            <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
              <Image
                src={user?.profileImage || "https://via.placeholder.com/200?text=User"}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-6 pb-4">
              <h1 className="text-white text-2xl font-bold">{user?.name || "User"}</h1>
              <p className="text-emerald-100">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2023"}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="pt-16 px-4 sm:px-6 lg:px-8">
          <nav className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-emerald-800 text-emerald-800' : 'text-gray-500 hover:text-emerald-800'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'bookings' ? 'border-b-2 border-emerald-800 text-emerald-800' : 'text-gray-500 hover:text-emerald-800'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Booking History
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${activeTab === 'settings' ? 'border-b-2 border-emerald-800 text-emerald-800' : 'text-gray-500 hover:text-emerald-800'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
          
          {/* Content Area */}
          <div className="py-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {!editMode ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Full Name</p>
                            <p className="mt-1">{user?.name || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1">{user?.email || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="mt-1">{user?.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="mt-1">{user?.address || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">About Me</h3>
                        <p className="text-gray-700">{user?.bio || "No bio provided yet."}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button 
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-900 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About Me</label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={8}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-900 transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Booking History ({bookings.length})</h3>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven&apos;t made any bookings yet.</p>
                    <div className="mt-6">
                      <Link 
                        href="/category" 
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-800 hover:bg-emerald-900"
                      >
                        Browse Categories
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Active Bookings Section */}
                    <div>
                      <h4 className="text-md font-medium text-emerald-800 mb-4 flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        Active Bookings ({activeBookings.length})
                      </h4>
                      
                      {activeBookings.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No active bookings</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {activeBookings.map((booking) => {
                                const startDate = new Date(booking.startDate || booking.pickupDate);
                                const endDate = new Date(booking.endDate || booking.returnDate);
                                const today = new Date();
                                const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                                
                                return (
                                  <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 relative">
                                          <Image
                                            src={booking.rental?.image && !booking.rental.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${booking.rental.image}` : (booking.rental?.image || '/ref1.png')}
                                            alt={booking.rental?.name || booking.rental?.title || "Rental item"}
                                            fill
                                            className="rounded-md object-cover"
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{booking.rental?.name || booking.rental?.title || "Rental item"}</div>
                                          <div className="text-xs text-gray-500">{booking.rental?.location || ""}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className={`text-sm font-medium ${daysLeft <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                                        {daysLeft} days
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800">
                                      <Link href="/bookings" className="hover:underline">
                                        View Details
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    {/* Closed Bookings Section */}
                    <div>
                      <h4 className="text-md font-medium text-gray-600 mb-4 flex items-center">
                        <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                        Past Bookings ({closedBookings.length})
                      </h4>
                      
                      {closedBookings.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No past bookings</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {closedBookings.map((booking) => {
                                const startDate = new Date(booking.startDate || booking.pickupDate);
                                const endDate = new Date(booking.endDate || booking.returnDate);
                                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                                
                                return (
                                  <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 relative">
                                          <Image
                                            src={booking.rental?.image && !booking.rental.image.startsWith('http') ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${booking.rental.image}` : (booking.rental?.image || '/ref1.png')}
                                            alt={booking.rental?.name || booking.rental?.title || "Rental item"}
                                            fill
                                            className="rounded-md object-cover"
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{booking.rental?.name || booking.rental?.title || "Rental item"}</div>
                                          <div className="text-xs text-gray-500">{booking.rental?.location || ""}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {duration} days
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        Closed
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-800">
                                      <Link href="/bookings" className="hover:underline">
                                        View Details
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Change Password</h4>
                      <p className="text-sm text-gray-500 mb-4">Update your password to keep your account secure.</p>
                      <button className="text-sm text-emerald-800 hover:underline">
                        Change Password
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Preferences</h4>
                      <p className="text-sm text-gray-500 mb-4">Manage how we contact you.</p>
                      <button className="text-sm text-emerald-800 hover:underline">
                        Manage Notifications
                      </button>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Delete Account</h4>
                      <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all your data.</p>
                      <button className="text-sm text-red-600 hover:underline">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}