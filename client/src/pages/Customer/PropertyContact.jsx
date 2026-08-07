import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Calendar, CheckCircle2, MessageSquare, Send } from 'lucide-react';

export default function Contact({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('Enquire'); // 'Enquire' | 'Visit' | 'Reserve'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  // Set default message when activeTab or listing updates
  useEffect(() => {
    let msg = '';
    if (activeTab === 'Enquire') {
      msg = `I'm interested in "${listing.name}". Please share more details.`;
    } else if (activeTab === 'Visit') {
      msg = `I would like to schedule a visit to "${listing.name}". Please let me know your availability.`;
    } else if (activeTab === 'Reserve') {
      msg = `I would like to reserve "${listing.name}". Please send over the reservation agreement.`;
    }

    setFormData((prev) => ({
      ...prev,
      name: currentUser?.username || '',
      email: currentUser?.email || '',
      message: msg
    }));
  }, [activeTab, listing, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in to send an enquiry!');
      return;
    }
    
    setSending(true);
    try {
      const res = await fetch('/api/enquiry/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing._id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          type: activeTab,
        }),
      });
      const data = await res.json();
      setSending(false);

      if (data.success === false) {
        toast.error(data.message || 'Failed to submit enquiry.');
        return;
      }

      toast.success('Your enquiry has been sent! The property manager will review and contact you shortly.');
      setFormData((prev) => ({
        ...prev,
        phone: '',
      }));
    } catch (error) {
      setSending(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='bg-white dark:bg-[#24211e]/90 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-[#302d29] shadow-md dark:shadow-xl rounded-2xl p-6 flex flex-col gap-6 transition-colors duration-250'>
      
      {/* Tabs list */}
      <div className='flex gap-2 p-1 bg-slate-100 dark:bg-[#1a1816] rounded-xl border border-slate-200 dark:border-[#302d29]'>
        {['Enquire', 'Visit', 'Reserve'].map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-[#1b4332] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header based on tab */}
      <div>
        <h3 className='text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2'>
          {activeTab === 'Enquire' && <MessageSquare size={18} className='text-[#3ba264]' />}
          {activeTab === 'Visit' && <Calendar size={18} className='text-[#3ba264]' />}
          {activeTab === 'Reserve' && <CheckCircle2 size={18} className='text-[#3ba264]' />}
          <span>{activeTab === 'Enquire' ? 'Enquire Now' : activeTab === 'Visit' ? 'Schedule a Visit' : 'Reserve Property'}</span>
        </h3>
        <p className='text-[11px] text-slate-500 dark:text-gray-400 mt-1 leading-relaxed'>
          {activeTab === 'Enquire' && 'Get details and a callback from our advisor.'}
          {activeTab === 'Visit' && 'Request a tour of the property at your convenience.'}
          {activeTab === 'Reserve' && 'Initiate the reservation process for this listing.'}
        </p>
      </div>

      {/* Input Fields */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label className='text-[10px] font-bold text-slate-500 dark:text-gray-400 block mb-1 uppercase tracking-wider'>Full Name <span className='text-red-500'>*</span></label>
          <input
            type="text"
            id="name"
            required
            placeholder="Your name"
            onChange={handleChange}
            value={formData.name}
            className='w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#3ba264] transition'
          />
        </div>

        <div>
          <label className='text-[10px] font-bold text-slate-500 dark:text-gray-400 block mb-1 uppercase tracking-wider'>Email <span className='text-red-500'>*</span></label>
          <input
            type="email"
            id="email"
            required
            placeholder="you@email.com"
            onChange={handleChange}
            value={formData.email}
            className='w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#3ba264] transition'
          />
        </div>

        <div>
          <label className='text-[10px] font-bold text-slate-500 dark:text-gray-400 block mb-1 uppercase tracking-wider'>Phone <span className='text-red-500'>*</span></label>
          <input
            type="tel"
            id="phone"
            required
            placeholder="9000000000"
            onChange={handleChange}
            value={formData.phone}
            className='w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#3ba264] transition'
          />
        </div>

        <div>
          <label className='text-[10px] font-bold text-slate-500 dark:text-gray-400 block mb-1 uppercase tracking-wider'>Message <span className='text-red-500'>*</span></label>
          <textarea
            id="message"
            required
            rows={3}
            placeholder="Enter your message..."
            onChange={handleChange}
            value={formData.message}
            className='w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-[#3ba264] transition resize-none'
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className='bg-[#1b4332] hover:bg-[#2d5a45] disabled:opacity-80 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition shadow-md w-full mt-2 cursor-pointer flex items-center justify-center gap-2 border border-[#2d5a45]'
        >
          <Send size={12} />
          <span>{sending ? 'Sending...' : activeTab === 'Enquire' ? 'Send Enquiry' : activeTab === 'Visit' ? 'Send Visit Request' : 'Submit Reservation'}</span>
        </button>
      </form>

    </div>
  );
}