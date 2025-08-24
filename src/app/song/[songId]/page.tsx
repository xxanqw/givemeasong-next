'use client';

import { useParams } from 'next/navigation';
import SongContainerNeobrutalist from '@/components/SongContainerNeobrutalist';

// This is a dynamic route page component that uses the songId from the URL
export default function SongPage() {
    const params = useParams();
    const songId = params.songId as string;
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <SongContainerNeobrutalist songId={songId} />
        </main>
    );
}
