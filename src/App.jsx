import Cover from './components/Cover'
import Ceremony from './components/Ceremony'
import Reception from './components/Reception'
import LocationMap from './components/LocationMap'
import Footer from './components/Footer'

function App() {
  return (
    <div className="text-ink">
      <Cover />
      <Ceremony />
      <Reception />
      <LocationMap />
      <Footer />
    </div>
  )
}

export default App
