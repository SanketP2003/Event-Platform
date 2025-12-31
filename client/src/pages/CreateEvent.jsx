import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Users, Image, Type, FileText, Loader2, ArrowLeft } from 'lucide-react';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', capacity: '', category: 'General', image: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await axios.post('/api/events', formData, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Event created successfully!');
            navigate('/');
        } catch {
            toast.error('Error creating event');
        } finally {
            setLoading(false);
        }
    };

    const generateDescription = async () => {
        const prompts = [
            "Join us for an exciting event filled with networking opportunities and engaging activities.",
            "Experience an unforgettable gathering with great food, entertainment, and community spirit.",
            "Discover new ideas and connect with like-minded individuals in this dynamic event.",
            "A perfect blend of learning, fun, and inspiration awaits you at this special occasion."
        ];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        setFormData({ ...formData, description: randomPrompt });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Events
                </button>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create New Event</h1>
                        <p className="text-gray-600 dark:text-gray-300">Fill in the details to create your event</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Type size={16} className="inline mr-2" />
                                Event Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter event title"
                                className={`w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                    errors.title ? 'border-red-500' : 'border-gray-600'
                                }`}
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FileText size={16} className="inline mr-2" />
                                Description
                            </label>
                            <textarea
                                placeholder="Describe your event"
                                rows={4}
                                className={`w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none ${
                                    errors.description ? 'border-red-500' : 'border-gray-600'
                                }`}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className={`w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                        errors.date ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <MapPin size={16} className="inline mr-2" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="Event location"
                                    className={`w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                        errors.location ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Users size={16} className="inline mr-2" />
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    placeholder="Maximum attendees"
                                    min="1"
                                    className={`w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                                        errors.capacity ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    required
                                />
                                {errors.capacity && <p className="text-red-400 text-sm mt-1">{errors.capacity}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 border border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Music">Music</option>
                                    <option value="Art">Art</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={generateDescription}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center"
                            >
                                <Image className="mr-2" size={18} />
                                Generate Description
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;