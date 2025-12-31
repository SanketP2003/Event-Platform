import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Calendar, Users, Loader2 } from 'lucide-react';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('date');
    const { token, user } = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await API.get('/events');
            console.log('Fetched events:', res.data);
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async (eventId) => {
        if (!token) return toast.error('Please login to RSVP');
        try {
            await API.post(`/events/rsvp/${eventId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            toast.success('RSVP Successful!');
            fetchEvents();
        } catch {
            toast.error('Error RSVPing');
        }
    };

    const handleLeave = async (eventId) => {
        try {
            await API.delete(`/events/rsvp/${eventId}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Left event successfully');
            fetchEvents();
        } catch {
            toast.error('Error leaving event');
        }
    };

    const handleEdit = () => {
        alert('Edit functionality would navigate to edit page with prefilled data');
    };

    const handleDelete = async (eventId) => {
        if (!token) return toast.error('Please login to delete an event');
        try {
            await API.delete(`/events/${eventId}`, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch {
            toast.error('Error deleting event');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center mb-8">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-500 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loading Events...</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                            <div className="p-5">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Discover Amazing Events</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Find and join events that interest you</p>
            </div>

            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Categories</option>
                            <option value="General">General</option>
                            <option value="Music">Music</option>
                            <option value="Art">Art</option>
                            <option value="Technology">Technology</option>
                            <option value="Sports">Sports</option>
                        </select>
                        <button
                            onClick={() => setSortBy('date')}
                            className={`p-3 rounded-lg border transition-all ${
                                sortBy === 'date'
                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            Sort by Date
                        </button>
                        <button
                            onClick={() => setSortBy('popularity')}
                            className={`p-3 rounded-lg border transition-all ${
                                sortBy === 'popularity'
                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            Sort by Popularity
                        </button>
                    </div>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Events Yet</h2>
                    <p className="text-gray-600 dark:text-gray-300">Be the first to create an event!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events
                        .filter(event => {
                            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
                            return matchesSearch && matchesCategory;
                        })
                        .sort((a, b) => {
                            if (sortBy === 'date') {
                                return new Date(b.date) - new Date(a.date);
                            }
                            if (sortBy === 'popularity') {
                                return b.attendees.length - a.attendees.length;
                            }
                            return 0;
                        })
                        .map(event => {
                            const isFull = event.attendees.length >= event.capacity;

                            return (
                                <div key={event._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                        {event.image ? (
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-500">
                                                <span className="text-6xl">📅</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1">
                                            <Calendar size={12} />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        {isFull && (
                                            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                Sold Out
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">{event.title}</h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                <MapPin size={14} className="mr-2" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <Users size={14} className="mr-2 text-gray-600 dark:text-gray-300" />
                                                <span className={`${isFull ? 'text-red-400' : 'text-green-400'}`}>
                                                    {event.attendees.length} / {event.capacity} attendees
                                                </span>
                                            </div>
                                        </div>

                                        {user && event.attendees.some(att => att.toString() === user.id) ? (
                                            <button
                                                onClick={() => handleLeave(event._id)}
                                                className="w-full py-3 rounded-lg font-semibold transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 active:scale-95"
                                            >
                                                Leave Event
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRSVP(event._id)}
                                                disabled={isFull}
                                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                                                    isFull
                                                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 hover:shadow-xl'
                                                }`}
                                            >
                                                {isFull ? 'Event Full' : 'RSVP Now'}
                                            </button>
                                        )}

                                        {user && user.id === event.organizer._id && (
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    onClick={handleEdit}
                                                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-all duration-200 hover:bg-blue-700"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold transition-all duration-200 hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default Home;

