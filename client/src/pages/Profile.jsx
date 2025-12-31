import { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Calendar, Loader2, ArrowUpDown } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // desc for newest first
    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        loadData();
    }, [token]);

    const loadData = async () => {
        try {
            const profileData = await fetchProfile();
            if (profileData) {
                await fetchUserEvents(profileData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await API.get('/auth/profile', {
                headers: { 'x-auth-token': token }
            });
            if (response.data) {
                setProfile(response.data);
                return response.data;
            } else {
                throw new Error('Profile not found');
            }
        } catch (error) {
            throw error;
        }
    };

    const fetchUserEvents = async (profileData) => {
        try {
            const [allEventsResponse, createdEventsResponse] = await Promise.all([
                API.get('/events'),
                API.get('/events/my-events', {
                    headers: { 'x-auth-token': token }
                })
            ]);

            const allEvents = allEventsResponse.data || [];
            const userCreatedEvents = createdEventsResponse.data || [];

            const userAttendingEvents = allEvents.filter(event =>
                event && event.attendees && Array.isArray(event.attendees) && event.attendees.some(att => att && att.toString() === profileData._id)
            );

            setAttendingEvents(userAttendingEvents);
            setCreatedEvents(userCreatedEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">Error loading profile. Please try again.</p>
            </div>
        );
    }

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    const sortedAttendingEvents = [...attendingEvents].sort((a, b) =>
        sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

    const sortedCreatedEvents = [...createdEvents].sort((a, b) =>
        sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your account information</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <User className="text-gray-600 dark:text-gray-300" size={20} />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Username</p>
                            <p className="text-gray-900 dark:text-white font-medium">{profile.username}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <Mail className="text-gray-600 dark:text-gray-300" size={20} />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                            <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <Calendar className="text-gray-600 dark:text-gray-300" size={20} />
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Member Since</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Events</h2>
                        <button
                            onClick={toggleSortOrder}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center space-x-2"
                        >
                            <ArrowUpDown size={16} />
                            <span>Sort by Date ({sortOrder === 'asc' ? 'Oldest First' : 'Newest First'})</span>
                        </button>
                    </div>

                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Attending ({attendingEvents.length})</h3>
                        {attendingEvents.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">You are not attending any events.</p>
                        ) : (
                            <ul className="space-y-2">
                                {sortedAttendingEvents.map(event => (
                                    <li key={event._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-white">{event.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {new Date(event.date).toLocaleString()}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{event.location}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Created ({createdEvents.length})</h3>
                        {createdEvents.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300 text-sm">You have not created any events.</p>
                        ) : (
                            <ul className="space-y-2">
                                {sortedCreatedEvents.map(event => (
                                    <li key={event._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        <h4 className="text-md font-medium text-gray-900 dark:text-white">{event.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {new Date(event.date).toLocaleString()}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{event.location}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
