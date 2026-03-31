// Optimized image handling for image_0.png structure
import React, { useState } from 'react';

// Product data (simplified sample)
const initialProducts = [
  { id: 1, name: "DeWalt 20V Max Schroevendraaier", price: 18.50, image: "https://images.unsplash.com/photo-1594895874271-9c60e33beec1?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, name: "Bosch Professionele Klopboormachine", price: 25.00, image: "https://images.unsplash.com/photo-1620614902899-733d3b664d6d?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, name: "Estwing Klauwhamer 450g", price: 6.50, image: "https://images.unsplash.com/photo-1579294247265-d4e51bd08d70?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, name: "Stanley Betonschaar 900mm", price: 15.00, image: "https://images.unsplash.com/photo-1582294119799-231f8b1c4b2b?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, name: "Snelbouwankers M12 (50st)", price: 32.00, image: "https://images.unsplash.com/photo-1610996883204-e3c69c65691d?q=80&w=1200&auto=format&fit=crop" },
  { id: 6, name: "Laserliner Kruislijnlaser", price: 40.00, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop" },
];

export default function Producten() {
  const [products] = useState(initialProducts);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 1. Header (Navbar) - Left-aligned logo, Right-aligned user */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-orange-500 text-3xl">🛠️</span> {/* Simplified wrench icon */}
            <span className="text-3xl font-extrabold text-gray-950">Klusloods</span>
          </div>
          <button className="text-gray-600 hover:text-orange-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-10">
        
        {/* 2. Filters / Search / Add Category (Structured like image_0.png) */}
        <div className="flex flex-col md:flex-row md:justify-center items-center my-8 gap-4 max-w-7xl mx-auto border-b-2 border-orange-200 pb-12 mb-12">
          
          {/* Searchbar (Positioned like the line in image_0.png) */}
          <div className="relative w-full md:w-2/3">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input
              type="text"
              placeholder="Zoeken naar producten..."
              className="w-full pl-12 pr-6 py-3.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition text-lg"
            />
          </div>

          {/* Add Item Button (Extra from image_1.png skin) */}
          <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold p-3.5 rounded-xl shadow-md transition-all flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>

        {/* 3. Product Grid (2x3 structure from image_0.png) */}
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-950 mb-10">Product Catalogus</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <div key={product.id} className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col group">
                  <div className="aspect-video w-full max-h-[220px] bg-gray-100 overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-8 flex flex-col flex-grow">
                    
                    {/* {Naam} placeholder content, now styled and real */}
                    <h3 className="text-xl font-bold text-gray-950 mb-1.5 line-clamp-2">{product.name}</h3>
                    
                    {/* Prijs (per dag) placeholder content, now styled and real */}
                    <div className="text-2xl font-bold text-orange-500 mb-8 mt-auto flex items-baseline">
                        <span className="text-base font-medium text-gray-600 mr-1.5">€</span>
                        {product.price.toFixed(2)}
                        <span className="text-sm font-medium text-gray-500 ml-1.5">/ dag</span>
                    </div>
                    
                    {/* [Reserveren] button (Large, orange from image_1.png color palette) */}
                    <button className="w-full bg-slate-900 hover:bg-slate-950 text-white font-semibold px-8 py-3.5 rounded-xl shadow transition mt-auto">
                        Reserveren
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
        </div>

      </main>

      {/* 4. Footer (Detailed and Navy, from image_1.png) */}
      <footer className="bg-slate-950 text-gray-100 mt-24">
        <div className="max-w-[1600px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1 - Logo & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <span className="text-orange-500 text-3xl">🛠️</span>
                <span className="text-3xl font-extrabold">BuildRent</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              Your trusted partner for professional-grade building tools and materials. Quality equipment, exactly when you need it.
            </p>
            <div className="flex items-center gap-5 pt-3">
                {["fb", "ig", "x"].map(icon => (
                    <button key={icon} className="bg-slate-800 hover:bg-slate-700 w-12 h-12 rounded-full font-bold flex items-center justify-center transition shadow-inner">
                        {icon.toUpperCase()}
                    </button>
                ))}
            </div>
          </div>

          {/* Columns 2-4 - Link Groups */}
          {[
            { title: "EQUIPMENT", links: ["Power Tools", "Heavy Machinery", "Scaffolding & Ladders", "Landscaping", "Raw Materials"] },
            { title: "COMPANY", links: ["About Us", "How It Works", "Pro Accounts", "Locations", "Careers"] },
            { title: "SUPPORT", links: ["Contact Us", "FAQ", "Rental Policies", "Report an Issue"] }
          ].map((group) => (
            <div key={group.title} className="flex flex-col gap-6">
                <h4 className="text-base font-bold text-orange-500 tracking-wider mb-2">{group.title}</h4>
                <ul className="flex flex-col gap-4 text-base">
                    {group.links.map(link => (
                        <li key={link}><a href="#" className="hover:text-orange-400 text-gray-300 transition">{link}</a></li>
                    ))}
                </ul>
            </div>
          ))}

        </div>
        
        {/* Sub-footer (Copyright etc) */}
        <div className="border-t border-slate-800">
            <div className="max-w-[1600px] mx-auto px-6 py-6 text-center text-sm text-gray-400">
              &copy; {new Date().getFullYear()} BuildRent B.V. Alle rechten voorbehouden. Admin Panel v1.0
            </div>
        </div>
      </footer>
    </div>
  );
}