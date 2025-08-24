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
import ButtonNeobrutalist from './ui/ButtonNeobrutalist';
import InputNeobrutalist from './ui/InputNeobrutalist';
import CardNeobrutalist from './ui/CardNeobrutalist';
import './SongContainerNeobrutalist.css';

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

// Platform configuration for Neobrutalist style
const platformConfig = {
    spotify: {
        color: '#00FF41', // Neon green instead of Spotify green
        icon: faSpotify,
        label: 'SPOTIFY'
    },
    youtube_music: {
        color: '#FF0040', // Accent red
        icon: faYoutube,
        label: 'YOUTUBE'
    },
    deezer: {
        color: '#000000', // Black
        icon: faDeezer,
        label: 'DEEZER'
    },
    soundcloud: {
        color: '#FFB000', // Brutal yellow
        icon: faSoundcloud,
        label: 'SOUNDCLOUD'
    },
    default: {
        color: '#FF0040', // Default accent
        icon: faMusic,
        label: 'LISTEN'
    }
};

export default function SongContainerNeobrutalist({ songId }: SongContainerProps) {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [song, setSong] = useState<Song | null>(null);

    // Update document title when song data is available
    useEffect(() => {
        if (song) {
            document.title = `${song.title.toUpperCase()} BY ${song.artist.toUpperCase()} | GIVEMEASONG`;
            
            const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
            const newFavicon = existingFavicon || document.createElement('link') as HTMLLinkElement;
            newFavicon.type = 'image/x-icon';
            newFavicon.rel = 'icon';
            newFavicon.href = song.cover_url || '/favicon.ico';
            if (!existingFavicon) document.head.appendChild(newFavicon);
        }
        return () => {
            document.title = "GIVEMEASONG";
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
                throw new Error(`API ERROR: ${res.status}`);
            }
            const data = await res.json();
            setSong(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'FAILED TO FETCH SONG DATA');
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
                throw new Error(data.error || 'SOMETHING WENT WRONG');
            }

            router.push(`/song/${data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message.toUpperCase() : 'FAILED TO FETCH SONG DATA');
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
            <div className="neobrutalist-song-page">
                {/* Asymmetric layout with dramatic scale differences */}
                <div className="brutal-layout">
                    {/* Large accent block */}
                    
                    <CardNeobrutalist 
                        variant="default" 
                        shadow="extreme" 
                        padding="xl"
                        className="brutal-main-card"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="brutal-loading-state"
                                >
                                    <div className="brutal-loading-grid">
                                        <div className="brutal-spinner-large"></div>
                                        <div className="brutal-loading-text">
                                            <div className="brutal-loading-title">ЗАВАНТАЖЕННЯ</div>
                                            <div className="brutal-loading-subtitle">ЗАВАНТАЖЕННЯ ДАНИХ ПІСНІ</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : song ? (
                                <motion.div
                                    key="song-details"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="brutal-song-content"
                                >
                                    {/* Asymmetric grid layout */}
                                    <div className="brutal-song-grid">
                                        {/* Left column - Dramatic typography */}
                                        <div className="brutal-text-column">
                                            <div className="brutal-title-block">
                                                <div className="brutal-label">ТРЕК</div>
                                                <h1 className="brutal-song-title">
                                                    {song.title.toUpperCase()}
                                                </h1>
                                            </div>
                                            
                                            <div className="brutal-artist-block">
                                                <div className="brutal-label">АРТИСТ</div>
                                                <h2 className="brutal-artist-name">
                                                    {song.artist.toUpperCase()}
                                                </h2>
                                            </div>
                                        </div>
                                        
                                        {/* Right column - Cover image if available */}
                                        {song.cover_url && (
                                            <div className="brutal-cover-column">
                                                <div className="brutal-image-container">
                                                    <img 
                                                        src={song.cover_url} 
                                                        alt={`${song.title} by ${song.artist}`} 
                                                        className="brutal-cover-image"
                                                    />
                                                    <div className="brutal-image-border"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Platform buttons with harsh styling */}
                                    <div className="brutal-platforms-section">
                                        <div className="brutal-section-label">ДОСТУПНО НА</div>
                                        <div className="brutal-platforms-grid">
                                            {song.platforms && Object.entries(song.platforms).map(([platform, data], index) => (
                                                data?.url ? (
                                                    <motion.div
                                                        key={platform}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1, duration: 0.2 }}
                                                        className="brutal-platform-item"
                                                    >
                                                        <a 
                                                            href={data.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="brutal-platform-link"
                                                            style={{ 
                                                                '--platform-color': getPlatformConfig(platform).color 
                                                            } as React.CSSProperties}
                                                        >
                                                            <div className="brutal-platform-icon">
                                                                <FontAwesomeIcon icon={getPlatformConfig(platform).icon} />
                                                            </div>
                                                            <div className="brutal-platform-label">
                                                                {getPlatformConfig(platform).label}
                                                            </div>
                                                        </a>
                                                    </motion.div>
                                                ) : null
                                            ))}
                                            {(!song.platforms || Object.keys(song.platforms).length === 0) && (
                                                <div className="brutal-no-platforms">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    <span>ПОСИЛАНЬ НІМА</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                // Error state
                                <motion.div 
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="brutal-error-state"
                                >
                                    <CardNeobrutalist variant="accent" shadow="harsh" padding="lg">
                                        <div className="brutal-error-content">
                                            <FontAwesomeIcon icon={faExclamationCircle} className="brutal-error-icon" />
                                            <div className="brutal-error-text">{error || "ERROR LOADING SONG"}</div>
                                        </div>
                                    </CardNeobrutalist>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Back button */}
                        <div className="brutal-back-section">
                            <Link href="/">
                                <ButtonNeobrutalist variant="secondary" size="lg" icon={<FontAwesomeIcon icon={faArrowLeft} />}>
                                    НАЗАД ДО ПОШУКУ
                                </ButtonNeobrutalist>
                            </Link>
                        </div>
                    </CardNeobrutalist>
                </div>
            </div>
        );
    }
    
    // Show the search form (default)
    return (
        <div className="neobrutalist-home-page">
            <div className="brutal-layout">
                {/* Angular accent elements */}
                
                <CardNeobrutalist 
                    variant="default" 
                    shadow="brutal" 
                    padding="xl"
                    className="brutal-search-card"
                >
                    {/* Dramatic title section */}
                    <div className="brutal-header-section">
                        <div className="brutal-logo-section">
                            <div className="brutal-logo-icon">
                                <FontAwesomeIcon icon={faMusic} />
                            </div>
                            <div className="brutal-logo-text">
                                <div className="brutal-main-title">GIVEMEASONG</div>
                                <div className="brutal-subtitle">БРУТАЛЬНА ВЕРСІЯ</div>
                            </div>
                        </div>
                        
                        <div className="brutal-tagline">
                            ЗНАЙДИ СВОЮ ПІСНЮ НА ВСІХ ПЛАТФОРМАХ<br />
                            БРУТАЛЬНО ШВИДКО
                        </div>
                    </div>
                    
                    {/* Search form */}
                    <form onSubmit={handleSubmit} className="brutal-search-form">
                        <InputNeobrutalist
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="ВСТАВТЕ ПОСИЛАННЯ НА ПІСНЮ..."
                            required
                            icon={<FontAwesomeIcon icon={faSearch} />}
                            error={error}
                            variant={error ? 'error' : 'default'}
                        />
                        
                        <ButtonNeobrutalist 
                            type="submit" 
                            variant="primary" 
                            size="xl" 
                            loading={isLoading}
                            icon={<FontAwesomeIcon icon={faSearch} />}
                            disabled={isLoading}
                        >
                            {isLoading ? 'ПОШУК...' : 'ЗНАЙТИ ПІСНЮ'}
                        </ButtonNeobrutalist>
                    </form>

                    {/* Footer section */}
                    <div className="brutal-footer-section">
                        <Link 
                            href="https://api.xxanqw.pp.ua/gmas/docs"
                            className="brutal-api-link"
                        >
                            <FontAwesomeIcon icon={faFileAlt} />
                            <span>API DOCS</span>
                        </Link>
                    </div>
                </CardNeobrutalist>
            </div>
        </div>
    );
}