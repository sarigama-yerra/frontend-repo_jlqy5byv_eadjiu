import PlayerForm from './components/PlayerForm'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Soccer Player Profile</h1>
          <p className="text-gray-600 mt-2">A clean, minimal, mobile-friendly form to collect player information and media.</p>
        </header>
        <PlayerForm />
      </div>
    </div>
  )
}
