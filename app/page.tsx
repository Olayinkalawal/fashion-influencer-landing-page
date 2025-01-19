import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <Gallery />
      <Shop />
      <Footer />
      {/* Other sections will go here */}
    </main>
  );
}
