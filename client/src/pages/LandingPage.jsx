import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Shield, Users, ArrowRight, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">TrackZen</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-primary-600 transition-colors">Solutions</a>
          <a href="#enterprise" className="hover:text-primary-600 transition-colors">Enterprise</a>
          <Link to="/login" className="px-5 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all">Sign In</Link>
          <Link to="/register" className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-6">
              <Zap size={16} />
              <span>Next-Gen Performance Management</span>
            </div>
            <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Empower Your Workforce with <span className="text-primary-600">TrackZen</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              The AI-powered portal for goal setting, real-time performance tracking, and organizational alignment. Built for modern enterprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-primary-200">
                Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all shadow-sm">
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card rounded-3xl p-4 shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Dashboard Preview" 
                className="rounded-2xl w-full object-cover shadow-inner"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">99.9%</h3>
              <p className="text-slate-400">Platform Uptime</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-slate-400">Enterprise Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">2M+</h3>
              <p className="text-slate-400">Goals Tracked</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-slate-400">Global Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">TrackZen provides the robust tools required for modern performance management workflows.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="text-primary-600" />, title: "Goal Setting", desc: "Collaborative goal definition with flexible UOMs and weightage validation." },
            { icon: <TrendingUp className="text-emerald-600" />, title: "Real-time Tracking", desc: "Monitor progress with interactive dashboards and automatic calculations." },
            { icon: <Shield className="text-purple-600" />, title: "RBAC & Governance", desc: "Enterprise-grade access control with multi-level approval workflows." },
            { icon: <Users className="text-blue-600" />, title: "Team Alignment", desc: "Cascade shared goals and departmental KPIs across the entire organization." },
            { icon: <Zap className="text-orange-600" />, title: "Escalation Engine", desc: "Automated reminders and escalations to ensure timely completion." },
            { icon: <Shield className="text-indigo-600" />, title: "Audit Trail", desc: "Comprehensive logging of every change for regulatory compliance." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ translateY: -10 }}
              className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">TrackZen</span>
          </div>
          <div className="text-slate-500 text-sm italic">
            © 2024 TrackZen Enterprise Systems. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
