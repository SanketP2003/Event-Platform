import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Plus, LogOut, LogIn, UserPlus, Menu, X, User, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-indigo-500 transition flex items-center space-x-2">
                    <span>🎉</span>
                    <span>EventPlatform</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/create" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                                <Plus size={18} />
                                <span>Create Event</span>
                            </Link>
                            <Link to="/profile" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                                <User size={18} />
                                <span>Profile</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                                <UserPlus size={18} />
                                <span>Register</span>
                            </Link>
                        </>
                    )}
                    <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>

                <div className="md:hidden flex items-center space-x-2">
                    <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={toggleMobileMenu} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
                    <div className="px-6 py-4 space-y-4">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition block">
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition block">
                                    <Plus size={18} />
                                    <span>Create Event</span>
                                </Link>
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition block">
                                    <User size={18} />
                                    <span>Profile</span>
                                </Link>
                                <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition w-full text-left">
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition block">
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition block">
                                    <UserPlus size={18} />
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;