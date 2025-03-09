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
} from '@fortawesome/free-solid-svg-icons';
import {
    faSpotify,
    faYoutube,
    faDeezer,
    faSoundcloud
} from '@fortawesome/free-brands-svg-icons';
import { link } from 'fs';

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
            color: 'bg-green-500 hover:bg-green-600',
            icon: faSpotify,
            label: 'Spotify'
    },
    youtube_music: {
            color: 'bg-red-600 hover:bg-red-700',
            icon: faYoutube,
            label: 'YouTube Music'
    },
    deezer: {
            color: 'bg-pink-500 hover:bg-pink-600',
            icon: faDeezer,
            label: 'Deezer'
    },
    soundcloud: {
            color: 'bg-orange-500 hover:bg-orange-600',
            icon: faSoundcloud,
            label: 'SoundCloud'
    },
    default: {
            color: 'bg-blue-500 hover:bg-blue-700',
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
                className="container glass-effect p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-3xl shadow-2xl w-full max-w-none sm:max-w-lg mx-auto transition-all duration-300 hover:shadow-purple-900 transform hover:-translate-y-1 min-h-fit pb-8"
            >
                
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 1, height: "200px" }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 mb-4" viewBox="0 0 24 24">
                                <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4" 
                                    fill="none"
                                />
                                <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </motion.div>
                    ) : song ? (
                        <>
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
                                    className="mb-6 flex justify-center"
                                >
                                    <img src={song.cover_url} alt="Album Cover" className="rounded-lg shadow-md"
                                        style={{ maxWidth: '180px', width: '100%' }} />
                                </motion.div>
                            )}

                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-2xl sm:text-4xl font-extrabold text-gradient mb-2 text-center tracking-tight"
                            >
                                {song.title}
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-lg sm:text-2xl font-bold text-gradient mb-1 text-center tracking-tight"
                            >
                                від
                            </motion.h2>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-xl sm:text-3xl font-bold text-gradient mb-8 sm:mb-8 text-center tracking-tight"
                            >
                                {song.artist}
                            </motion.h2>

                            <motion.ul
                                className="list-none pl-0 flex flex-wrap justify-center items-center gap-3 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                {song.platforms && Object.entries(song.platforms).map(([platform, data], index) => (
                                    data?.url ? (
                                        <motion.li
                                            key={platform}
                                            className="mb-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                                        >
                                            <a href={data.url} target="_blank" rel="noopener noreferrer"
                                                className={`text-white font-bold py-3 px-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center btn-shine ${getPlatformConfig(platform).color}`}>
                                                <FontAwesomeIcon icon={getPlatformConfig(platform).icon} className="mr-2" />
                                                <span className="text-sm sm:text-base">{getPlatformConfig(platform).label}</span>
                                            </a>
                                        </motion.li>
                                    ) : null
                                ))}
                                {(!song.platforms || Object.keys(song.platforms).length === 0) && (
                                    <li className="text-gray-400">No links available yet.</li>
                                )}
                            </motion.ul>
                            </motion.div>
                        </motion.div>
                        </>

                    ) : (
                        // Error or no data
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                        >
                            <i className="fas fa-exclamation-circle text-3xl sm:text-4xl text-red-400 mb-4"></i>
                            <p className="text-lg sm:text-xl text-red-400"><FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />  {error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="mt-10 pt-6 border-t border-gray-700 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <Link href="/"
                        className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-700 relative overflow-hidden">
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
            className="container glass-effect p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-3xl shadow-2xl w-full max-w-none sm:max-w-lg mx-auto transition-all duration-300 hover:shadow-purple-900 transform hover:-translate-y-1 min-h-fit pb-8"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-extrabold text-gradient mb-8 sm:mb-8 text-center tracking-tight"
            >
                <FontAwesomeIcon icon={faMusic} className="mr-1 text-purple-500" /> GiveMeASong
            </motion.h1>
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 sm:gap-6 mb-4"
            >
                <div className="relative">
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
                        className="peer border-2 border-gray-700 p-4 rounded-xl w-full focus:ring-2 focus:ring-purple-900 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md placeholder-gray-400 input-style text-base"
                    />
                </div>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-400 text-sm font-medium px-1 mb-2"
                        >
                            <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />  {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-700 relative overflow-hidden mt-2"
                >
                    <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <div className="inline-flex items-center">
                                    <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24">
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4" 
                                            fill="none"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Завантаження...
                                </div>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSearch} className="mr-2" /> Знайти пісню
                            </>
                        )}
                    </span>
                </motion.button>
            </motion.form>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 pt-6 border-t border-gray-700 text-center"
            >
                <Link href="/docs" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faFileAlt}className={"mr-1"} /> API Документація
                </Link>
            </motion.div>
        </motion.div>
    );
}