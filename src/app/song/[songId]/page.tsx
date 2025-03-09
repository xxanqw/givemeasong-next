'use client';

import { useParams } from 'next/navigation';
import SongContainer from '@/components/SongContainer';

// This is a dynamic route page component that uses the songId from the URL
export default function SongPage() {
    const params = useParams();
    const songId = params.songId as string;
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            
            <SongContainer songId={songId} />
        </main>
    );
}
