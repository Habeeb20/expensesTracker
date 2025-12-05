// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { 
  Mic, Camera, Brain, TrendingUp, Wallet, Shield,
  ArrowRight, Download, Star, Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import NairaWiseAIFloatingButton from '../components/AIFloating';

// Your exact vibrant green
const GREEN = "#32E00FFF";
const GREEN_DARK = "#22c55e";
const GREEN_LIGHT = "#dcfce7";

export default function LandingPage() {
  return (
    <div className="bg-gray-200 text-gray-900 font-sans overflow-x-hidden">
      {/* Subtle floating orbs in your green */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-70">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-lime-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -right-32 w-72 h-72 bg-gradient-to-tr from-green-300/20 to-lime-400/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            NAIRA
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-600 animate-gradient-x">
              WISE
            </span>
          </h1>

          <p className="text-2xl md:text-4xl font-semibold text-gray-800 mt-6 mb-8">
            The Most Trusted Personal expense tracker App in Nigeria
          </p>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Voice Add • Receipt Scanner • AI Alerts • Debt Tracker • 100% Private
          </p>
<Link to="/login">

        <button className="group relative px-12 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-2xl font-bold shadow-xl hover:shadow-emerald-500/40 transform hover:scale-105 transition-all duration-400">
            <span className="flex items-center gap-4">
              <Download className="w-9 h-9" />
            Get started
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition" />
            </span>
          </button>
</Link>

          {/* Trust stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
            {[
              { num: "500K+", label: "Active Users" },
              { rating: true },
              { num: "₦50B+", label: "Money Tracked" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-white/40 shadow-lg">
                {stat.rating ? (
                  <>
                    <div className="flex justify-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xl font-bold text-gray-800">4.9/5 Rating</p>
                  </>
                ) : (
                  <>
                    <p className="text-5xl font-black" style={{ color: GREEN }}>{stat.num}</p>
                    <p className="text-lg font-medium text-gray-700 mt-2">{stat.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-4xl font-black text-center mb-20 text-gray-800">
            Powerful Features You’ll Love
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Mic, title: "Voice Add Expense", desc: "Just speak — “5000 food”, “50k salary” → saved instantly" },
              { icon: Camera, title: "Receipt Scanner", desc: "Snap any receipt → auto-fills amount, shop & date" },
              { icon: Brain, title: "AI Predictions", desc: "Knows your rent, data, Netflix before due date" },
              { icon: TrendingUp, title: "True Net Worth", desc: "See your real wealth grow every month" },
              { icon: Wallet, title: "Debt Manager", desc: "Track who owes you & who you owe — never forget" },
              { icon: Shield, title: "100% Private", desc: "No cloud. Your data stays only on your phone" }
            ].map((f, i) => (
              <div key={i} className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-md hover:shadow-xl border border-white/50 hover:border-green-400 transition-all duration-500 hover:-translate-y-3">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition">
                  <f.icon className="w-10 h-10" style={{ color: GREEN }} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{f.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-green-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-3xl font-black mb-8">
            Ready to Master Your Money?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            Join 500,000+ Nigerians already saving smarter
          </p>
<Link to="/login">
          <button className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-full text-2xl md:text-3xl font-bold shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-400">
            <span className="flex items-center gap-5">
           
              <Download className="w-10 h-10" />
              Get started

        
            </span>
          </button>
</Link>
        </div>
      </section>

      {/* Footer - Green accents */}
      <footer className="py-20 px-6 bg-gradient-to-t from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h1 className="text-4xl font-black mb-5" style={{ color: GREEN }}>
                NAIRA WISE
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Nigeria's most trusted personal expense tracker app.<br />Built with love for Nigerians, by a Nigerian.
              </p>
            </div>

            {[ "Contact", "Follow Us"].map((title, idx) => (
              <div key={idx}>
                <h3 className="font-bold mb-6" style={{ color: GREEN }}>{title}</h3>
              
                {title === "Contact" && (
                  <div className="space-y-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-3"><Mail className="w-5 h-5" style={{ color: GREEN }} /> Support@codequor.com</div>
                    <div className="flex items-center gap-3"><Phone className="w-5 h-5" style={{ color: GREEN }} /> +234 805 560 3221</div>
                    <div className="flex items-center gap-3"><MapPin className="w-5 h-5" style={{ color: GREEN }} /> Lagos, Nigeria</div>
                  </div>
                )}
                {title === "Follow Us" && (
                  <div className="flex gap-5">
                    {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                      <Icon key={i} className="w-9 h-9 text-gray-400 hover:text-green-400 cursor-pointer transition" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-10 border-t border-gray-700 text-gray-500 text-sm">
            © 2025 Naira Wise. Made with love in Nigeria. All rights reserved.
          </div>
              <NairaWiseAIFloatingButton/>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 10s ease infinite;
        }
      `}</style>
    </div>
  );
}