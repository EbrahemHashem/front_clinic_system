
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">My Clinic</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm mb-6">
              The operating system for modern dentistry. Secure, fast, and reliable practice management.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/#features" className="hover:text-orange-500 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
              {/* <li><a href="#" className="hover:text-orange-500 transition-colors">Enterprise</a></li> */}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="/#faq" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Legal</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Join 2,000+ clinics receiving our monthly clinical tips.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-orange-500 focus:outline-none text-white" />
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 transition-all">Join</button>
            </div>
          </div>
        </div>
        
        {/* <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500">© 2024 My Clinic. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
