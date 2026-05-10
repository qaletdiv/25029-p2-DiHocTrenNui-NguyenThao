/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Bell, 
  Bookmark, 
  Briefcase, 
  ChevronDown, 
  LayoutGrid, 
  Mail, 
  MoreHorizontal, 
  Search, 
  Settings, 
  User 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [activeSetting, setActiveSetting] = useState('Account Setting');

  const navItems = [
    { name: 'My Job Feed', icon: Briefcase },
    { name: 'Profile', icon: User },
    { name: 'Dashboard', icon: LayoutGrid },
    { name: 'Saved Jobs', icon: Bookmark },
    { name: 'Settings', icon: Settings },
  ];

  const settingsTabs = [
    { name: 'Account Setting', description: 'Details about your Personal information' },
    { name: 'Notification', description: 'Details about your Personal information' },
    { name: 'Membership Plan', description: 'Details about your Personal information' },
    { name: 'Password & Security', description: 'Details about your Personal information' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans text-[#1A1A1A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4F6EF7] text-white flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-wider">weblance</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.name ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Anything"
              className="w-full bg-[#F8F9FD] border-none rounded-full py-2.5 pl-5 pr-12 text-sm focus:ring-2 focus:ring-[#4F6EF7]/20 outline-none"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500">
                <Mail size={20} />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500">
                <User size={20} />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4F6EF7] flex items-center justify-center text-white font-bold">
                TK
              </div>
              <span className="font-semibold text-sm">Tonmoy Karmoker</span>
              <button className="p-1 hover:bg-gray-50 rounded-lg">
                <MoreHorizontal size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 flex gap-8">
          {/* Settings Navigation */}
          <div className="w-72 space-y-4">
            {settingsTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveSetting(tab.name)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  activeSetting === tab.name 
                    ? 'border-[#4F6EF7] bg-white shadow-sm' 
                    : 'border-transparent bg-white/50 hover:bg-white'
                }`}
              >
                <h3 className={`font-bold text-lg ${activeSetting === tab.name ? 'text-[#1A1A1A]' : 'text-gray-700'}`}>
                  {tab.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{tab.description}</p>
              </button>
            ))}
          </div>

          {/* Form Area */}
          <div className="flex-1 space-y-6">
            {/* Upload Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src="https://picsum.photos/seed/tonmoy/200" 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-[#F8F9FD]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Upload a New Photo</h3>
                  <p className="text-sm text-gray-400">Profile-pic.jpg</p>
                </div>
              </div>
              <button className="px-8 py-2.5 border-2 border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                Update
              </button>
            </motion.div>

            {/* Information Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-2xl shadow-sm border border-gray-50"
            >
              <h2 className="text-2xl font-bold mb-8">Change User Information here</h2>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name*</label>
                    <input 
                      type="text" 
                      defaultValue="Tonmoy karmoker"
                      className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address*</label>
                    <input 
                      type="email" 
                      defaultValue="tonmoydedesigner@gmail.com"
                      className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address*</label>
                  <input 
                    type="text" 
                    defaultValue="190 Upor Bazar, Natore Sadar, Natore"
                    className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      defaultValue="Natore"
                      className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">State/Province</label>
                    <input 
                      type="text" 
                      defaultValue="Rajshahi"
                      className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zip Code</label>
                    <input 
                      type="text" 
                      defaultValue="6400"
                      className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-5 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label>
                    <div className="relative">
                      <select className="w-full bg-[#F8F9FD] border-2 border-transparent rounded-xl px-12 py-3 focus:border-[#4F6EF7] outline-none transition-all font-medium appearance-none">
                        <option>Bangladesh</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                      </select>
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-lg">🇧🇩</span>
                      </div>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#4F6EF7] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#4F6EF7]/20 hover:bg-[#3D5CD9] transition-all active:scale-[0.98] mt-4">
                  Update Information
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
