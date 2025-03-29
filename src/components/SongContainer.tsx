// src/components/SongContainer.tsx
"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMusic, 
    faSearch, 
    faExclamationCircle,
    faFileAlt, 
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import {
    faSpotify,
    faYoutube,
    faDeezer,
    faSoundcloud
} from '@fortawesome/free-brands-svg-icons';

interface Song {
    id: string;
    title: string;
    artist: string;
    cover_url?: string;
    platforms: {
        [platform: string]: {
            url: string;
            title?: string;
            artists?: string | string[];
            album?: string;
            cover_url?: string;
            length?: number;
        } | null | undefined;
    } | null;
}

interface SongContainerProps {
    songId?: string;
}

// Platform configuration for consistent UI
const platformConfig = {
    spotify: {
            color: 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800',
            icon: faSpotify,
            label: 'Spotify'
    },
    youtube_music: {
            color: 'bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900',
            icon: faYoutube,
            label: 'YouTube Music'
    },
    deezer: {
            color: 'bg-gradient-to-br from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800',
            icon: faDeezer,
            label: 'Deezer'
    },
    soundcloud: {
            color: 'bg-gradient-to-br from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800',
            icon: faSoundcloud,
            label: 'SoundCloud'
    },
    default: {
            color: 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
            icon: faMusic,
            label: 'Listen'
    }
};

export default function SongContainer({ songId }: SongContainerProps) {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [song, setSong] = useState<Song | null>(null);

    // Update document title when song data is available
    useEffect(() => {
        if (song) {
            // Update document title
            document.title = `${song.title} by ${song.artist} | GiveMeASong`;
            
            // Update favicon
            const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
            const newFavicon = existingFavicon || document.createElement('link') as HTMLLinkElement;
            newFavicon.type = 'image/x-icon';
            newFavicon.rel = 'icon';
            newFavicon.href = song.cover_url || '/favicon.ico'; // Use song cover if available
            if (!existingFavicon) document.head.appendChild(newFavicon);
        }
        return () => {
            // Reset title and favicon on unmount
            document.title = "GiveMeASong";
            const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
            if (favicon) favicon.href = '/favicon.ico';
        };
    }, [song]);

    // Load song data if songId is provided
    useEffect(() => {
        if (songId) {
            fetchSongData(songId);
        }
    }, [songId]);

    const fetchSongData = async (id: string) => {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        try {
            const res = await fetch(`${apiUrl}/song/${id}`);
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }
            const data = await res.json();
            setSong(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch song data');
        } finally {
            setIsLoading(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        try {
            const response = await fetch(`${apiUrl}/resolve?url=${encodeURIComponent(url)}`, {
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            router.push(`/song/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch song data');
        } finally {
            setIsLoading(false);
        }
    };

    // Get platform configuration
    const getPlatformConfig = (platform: string) => {
        return platformConfig[platform as keyof typeof platformConfig] || platformConfig.default;
    };

    // Render song details if we have a song
    if (songId) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                    duration: 0.6, 
                    ease: "easeOut"
                }}
                className="container relative backdrop-blur-xl bg-black/30 border border-white/10 p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-3xl shadow-2xl w-full max-w-none sm:max-w-xl md:max-w-2xl mx-auto transition-all duration-300 hover:shadow-purple-900/30 transform hover:-translate-y-1 min-h-fit"
            >
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 1, height: "200px" }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-16 w-16 rounded-full border-t-4 border-l-4 border-purple-500 animate-spin"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faMusic} className="text-purple-500 animate-pulse h-6 w-6" />
                                </div>
                            </div>
                            <p className="mt-4 text-purple-300 font-medium">Завантаження...</p>
                        </motion.div>
                    ) : song ? (
                        <motion.div
                            key="song-details"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="px-1 sm:px-4 mt-4"
                            >
                            {song.cover_url && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="mb-8 flex justify-center"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                                        <img 
                                            src={song.cover_url} 
                                            alt={`${song.title} by ${song.artist}`} 
                                            className="relative rounded-lg shadow-lg w-48 sm:w-56 md:w-64 aspect-square object-cover"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 mb-2 text-center tracking-tight"
                            >
                                {song.title}
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-lg sm:text-xl font-medium text-purple-300 mb-1 text-center tracking-tight"
                            >
                                від
                            </motion.h2>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 mb-10 sm:mb-12 text-center tracking-tight"
                            >
                                {song.artist}
                            </motion.h2>

                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                {song.platforms && Object.entries(song.platforms).map(([platform, data], index) => (
                                    data?.url ? (
                                        <motion.div
                                            key={platform}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="w-full"
                                        >
                                            <a 
                                                href={data.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={`text-white font-bold py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl w-full ${getPlatformConfig(platform).color}`}
                                                aria-label={`Listen on ${getPlatformConfig(platform).label}`}
                                            >
                                                <FontAwesomeIcon icon={getPlatformConfig(platform).icon} className="mr-2 text-lg" />
                                                <span className="text-sm sm:text-base">{getPlatformConfig(platform).label}</span>
                                            </a>
                                        </motion.div>
                                    ) : null
                                ))}
                                {(!song.platforms || Object.keys(song.platforms).length === 0) && (
                                    <div className="col-span-full text-gray-400 py-4 text-center">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                        <span>No links available yet.</span>
                                    </div>
                                )}
                            </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        // Error or no data
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30 mb-4">
                                <FontAwesomeIcon icon={faExclamationCircle} className="text-3xl sm:text-4xl text-red-400 mb-3" />
                                <p className="text-lg sm:text-xl text-red-300">{error || "Помилка завантаження пісні"}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="mt-10 pt-6 border-t border-gray-700/50 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <Link href="/"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-700 relative overflow-hidden"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Назад до пошуку
                    </Link>
                </motion.div>
            </motion.div>
        );
    }
    
    // Show the search form (default)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container relative backdrop-blur-xl bg-black/30 border border-white/10 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-3xl shadow-2xl w-full max-w-none sm:max-w-xl mx-auto transition-all duration-300 hover:shadow-purple-900/30 transform hover:-translate-y-1 min-h-fit"
        >
            <motion.div 
                className="absolute top-0 left-0 right=0 h-24 rounded-t-xl bg-gradient-to-b from-purple-900/30 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.7 }}
            />
            
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 mb-2 sm:mb-4 text-center tracking-tight flex items-center justify-center gap-3"
            >
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75"></div>
                    <div className="relative bg-black/50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faMusic} className="text-purple-400 text-lg sm:text-xl" />
                    </div>
                </div>
                <span>GiveMeASong</span>
            </motion.h1>
            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center text-gray-300 mb-8 max-w-md mx-auto"
            >
                Знайди свою улюблену пісню на всіх платформах, маючи лише одне посилання!
            </motion.p>
            
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 sm:gap-6 mb-4"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-md"></div>
                    <motion.input
                        whileFocus={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        type="text"
                        id="url"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Посилання на пісню..."
                        required
                        className="relative peer w-full border-2 border-gray-700/50 bg-black/50 p-4 rounded-xl focus:ring-2 focus:ring-purple-900 focus:border-transparent focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md placeholder-gray-400 text-base"
                        aria-label="URL to song"
                    />
                </div>
                
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/20 p-3 rounded-lg border border-red-500/30"
                        >
                            <div className="flex items-center text-red-300 text-sm font-medium">
                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 overflow-hidden"
                >
                    {isLoading ? (
                        <span className="relative z-10 flex items-center justify-center">
                            <div className="h-5 w-5 rounded-full border-t-2 border-l-2 border-white animate-spin mr-3"></div>
                            <span>Завантаження...</span>
                        </span>
                    ) : (
                        <span className="relative z-10 flex items-center justify-center">
                            <FontAwesomeIcon icon={faSearch} className="mr-2" /> 
                            <span>Знайти пісню</span>
                        </span>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 hover:opacity-50 transition-opacity duration-300"></div>
                </motion.button>
            </motion.form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 pt-6 border-t border-gray-700/50 text-center"
            >
                <Link 
                    href="https://api.xxanqw.pp.ua/gmas/docs" 
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 text-sm sm:text-base hover:underline focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
                >
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> 
                    API Документація
                </Link>
            </motion.div>
        </motion.div>
    );
}