import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { logout } from '@/routes';
import { 
  Search, Menu, User, Wrench, 
  Hammer, Truck, Box, ShieldCheck, Clock, 
  ChevronRight, Star, MapPin
} from 'lucide-react';

// --- COMPONENTS ---

type WelcomeUser = {
  name: string;
  role?: 'klant' | 'medewerker' | 'beheerder' | string;
};

const getRoleFirstPage = (role?: WelcomeUser['role']) => {
  if (role === 'klant') return '/klant/producten';
  if (role === 'medewerker') return '/medewerker/uitgifte-registreren';
  if (role === 'beheerder') return '/admin/category';
  return '/dashboard';
};

const Navbar = ({ user }: { user?: WelcomeUser | null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">De<span className="text-orange-500">Klusloods</span></span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for tools, materials, or machinery..." 
                className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 p-2 rounded-md hover:bg-orange-600 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400">Locatie</span>
              <div className="flex items-center gap-1 text-sm font-medium hover:text-orange-500 cursor-pointer transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Almelo, NL</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            {user ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400">Ingelogd als</span>
                  <Link href={getRoleFirstPage(user.role)} className="flex items-center gap-2 text-sm font-medium text-white hover:text-orange-500 transition-colors cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Link>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
                <Link href={getRoleFirstPage(user.role)} className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                  <span className="font-medium">Dashboard</span>
                </Link>
                <div className="h-8 w-px bg-slate-700"></div>
                <Link href={logout()} as="button" className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                  <span className="font-medium">Uitloggen</span>
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                <User className="w-5 h-5" />
                <span className="font-medium">Inloggen</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-6 border-t border-slate-700">
          <div className="relative w-full mb-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-orange-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500">
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <a href="#" className="block py-2 text-slate-300 hover:text-white">Categories</a>
            <a href="#" className="block py-2 text-slate-300 hover:text-white">Projects & Guides</a>
            {user ? (
              <>
                <Link href={getRoleFirstPage(user.role)} className="block py-2 text-slate-300 hover:text-white">Ingelogd als {user.name}</Link>
                <Link href={getRoleFirstPage(user.role)} className="block py-2 text-slate-300 hover:text-white">Dashboard</Link>
                <Link href={logout()} className="block py-2 text-slate-300 hover:text-white">Uitloggen</Link>
              </>
            ) : (
              <Link href="/login" className="block py-2 text-slate-300 hover:text-white">Inloggen / Registreren</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1541888081498-1122be26df04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Construction Site" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold tracking-wider mb-6 border border-orange-500/30">
            VOOR PARTICULIER & AANNEMER
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Welkom bij <br/>
            De <span className="text-orange-500">Klusloods</span>
          </h1>
          <p className="text-lg text-slate-300 mb-6 max-w-xl">
            Gereedschap- en bouwmaterialenverhuur in Hengelo, opgericht door Sanne Meijer. 
            Huur alles van boorhamers en slijptollen tot steigers, aanhangers en trilplaten voor uw volgende project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2">
              Bekijk Aanbod
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg backdrop-blur-sm transition-all flex items-center justify-center border border-white/10">
              Onze Tarieven
            </button>
          </div>
          
          <div className="mt-12 flex items-center gap-8 border-t border-slate-700/50 pt-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-white font-semibold">Fully Insured</p>
                <p className="text-slate-400 text-sm">All rentals covered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-white font-semibold">Fast Delivery</p>
                <p className="text-slate-400 text-sm">Same-day available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ categories }: { categories: any[] }) => {
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Explore Categories</h2>
            <p className="text-slate-600 mt-2">Find exactly what you need for your next project</p>
          </div>
          <button className="hidden md:flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors">
            View All Categories <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-500">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = ({ featuredItems }: { featuredItems: any[] }) => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Popular Rentals</h2>
          <p className="text-slate-600">Top-rated equipment currently available for rent in your area. Book now to secure for your project.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <span className="bg-slate-800 text-white font-bold py-2 px-4 rounded-md">Out of Stock</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                  {item.category}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-slate-700">{item.rating}</span>
                  <span className="text-sm text-slate-400">({item.reviews})</span>
                </div>
                
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{item.name}</h3>
                
                <div className="mt-auto pt-4 flex items-end justify-between border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">€{Number(item.price).toFixed(2)}</span>
                    <span className="text-slate-500 text-sm"> / day</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Build<span className="text-orange-500">Rent</span></span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Your trusted partner for professional-grade building tools and materials. Quality equipment, exactly when you need it.
            </p>
            <div className="flex space-x-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                <span className="font-bold">fb</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                <span className="font-bold">ig</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                <span className="font-bold">x</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Equipment</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Power Tools</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Heavy Machinery</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Scaffolding & Ladders</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Landscaping</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Raw Materials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Pro Accounts</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Locations</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Rental Policies</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Report an Issue</a></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} De Klusloods. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN APP COMPONENT ---
export default function App({ categories, featuredItems, auth }: { categories: any[], featuredItems: any[], auth?: { user?: WelcomeUser | null } }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
      <Navbar user={auth?.user} />
      <main>
        <Hero />
        <CategorySection categories={categories} />
        <FeaturedProducts featuredItems={featuredItems} />
      </main>
      <Footer />
    </div>
  );
}