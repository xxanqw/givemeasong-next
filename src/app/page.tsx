import SongContainer from '@/components/SongContainer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl">
        <SongContainer />
      </div>
    </main>
  )
}