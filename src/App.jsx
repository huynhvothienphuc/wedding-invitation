import Cover from './components/Cover'
import Ceremony from './components/Ceremony'
import Reception from './components/Reception'
import LocationMap from './components/LocationMap'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-cream-dark sm:py-8">
      <div className="mx-auto min-h-[100svh] max-w-md bg-cream text-ink shadow-none sm:min-h-0 sm:rounded-lg sm:shadow-xl">
        <Cover />
        <Ceremony />
        <Reception />
        <LocationMap />
        <Footer />
      </div>
    </div>
  )
}

export default App
