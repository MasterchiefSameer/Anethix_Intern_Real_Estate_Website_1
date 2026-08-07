import React, { useState } from 'react';
import { useTheme } from '../pages/Additional/Theme';
import { toast } from 'sonner';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send 
} from 'lucide-react';

const Contact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate API delivery
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent successfully! Our advisors will contact you shortly.");
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className='min-h-screen py-16 px-6 sm:px-12 lg:px-16 transition-colors duration-250 bg-slate-50 text-slate-800 dark:bg-[#181614] dark:text-white relative'>
      
      {/* Header Description */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest text-[#3ba264] uppercase block mb-3">Get in Touch</span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-serif text-slate-900 dark:text-white">
          We'd love to hear from you
        </h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
          Whether you're buying, selling, or just exploring — our advisors are here to help.
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:items-start">
        
        {/* Left Column - Send us a Message */}
        <form 
          onSubmit={handleSendMessage}
          className="lg:w-7/12 w-full bg-white dark:bg-[#24211e]/90 border border-slate-200 dark:border-[#302d29] shadow-md dark:shadow-xl rounded-2xl p-8 flex flex-col gap-5 transition-colors duration-250"
        >
          <div>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white font-serif'>Send us a message</h2>
            <p className='text-xs text-slate-600 dark:text-gray-400 mt-1'>Fill out the form and we'll respond within one business day.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                id="name"
                placeholder="John Doe" 
                required 
                onChange={handleChange}
                value={formData.name}
                className="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:border-[#3ba264] outline-none transition" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1.5">
                Phone <span className="text-rose-500">*</span>
              </label>
              <input 
                type="tel" 
                id="phone"
                placeholder="+91 9000000000" 
                required 
                onChange={handleChange}
                value={formData.phone}
                className="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:border-[#3ba264] outline-none transition" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1.5">
              Email <span className="text-rose-500">*</span>
            </label>
            <input 
              type="email" 
              id="email"
              placeholder="you@email.com" 
              required 
              onChange={handleChange}
              value={formData.email}
              className="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:border-[#3ba264] outline-none transition" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1.5">
              Subject
            </label>
            <input 
              type="text" 
              id="subject"
              placeholder="What can we help with?" 
              onChange={handleChange}
              value={formData.subject}
              className="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:border-[#3ba264] outline-none transition" 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-gray-400 block mb-1.5">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea 
              rows={5} 
              id="message"
              placeholder="Tell us a bit more..." 
              required 
              onChange={handleChange}
              value={formData.message}
              className="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-4 py-3 text-sm focus:border-[#3ba264] outline-none transition resize-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={sending}
            className="flex items-center justify-center gap-2 bg-[#1b4332] hover:bg-[#2d5a45] disabled:opacity-80 text-white font-semibold text-sm px-6 py-3 rounded-lg transition shadow-md border border-[#2d5a45] cursor-pointer mt-2 w-fit"
          >
            <Send size={16} />
            <span>{sending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>

        {/* Right Column - Office Info & Map */}
        <div className="lg:w-5/12 w-full flex flex-col gap-8">
          
          {/* Contact Details Card */}
          <div className="bg-white dark:bg-[#24211e]/90 border border-slate-200 dark:border-[#302d29] shadow-md dark:shadow-xl rounded-2xl p-8 flex flex-col gap-6 transition-colors duration-250">
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white font-serif'>Visit our office</h2>
            
            <div className="flex flex-col gap-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1b4332]/10 text-[#3ba264] dark:bg-[#1b4332]/40 p-2.5 rounded-xl border border-[#1b4332]/30 dark:border-[#1b4332]/60 mt-0.5 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Address</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1 leading-relaxed">
                    3rd Floor, Ganesh Guwahati Tower, GS Road, Christian Basti, Guwahati, Assam 781005
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1b4332]/10 text-[#3ba264] dark:bg-[#1b4332]/40 p-2.5 rounded-xl border border-[#1b4332]/30 dark:border-[#1b4332]/60 mt-0.5 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Phone</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    +91 6544357535
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1b4332]/10 text-[#3ba264] dark:bg-[#1b4332]/40 p-2.5 rounded-xl border border-[#1b4332]/30 dark:border-[#1b4332]/60 mt-0.5 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    info@anethixrealty.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1b4332]/10 text-[#3ba264] dark:bg-[#1b4332]/40 p-2.5 rounded-xl border border-[#1b4332]/30 dark:border-[#1b4332]/60 mt-0.5 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hours</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                    Mon – Sat: 9:30 AM – 7:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="bg-white dark:bg-[#24211e]/90 border border-slate-200 dark:border-[#302d29] shadow-md dark:shadow-xl rounded-2xl p-2.5 h-[320px] overflow-hidden transition-colors duration-250">
            <iframe 
              title="office map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428678502324!2d91.77660601502758!3d26.1500366834614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a59336d3c26ab%3A0xc3fde9b8e88849ad!2sGS%20Rd%2C%20Guwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
              className={`w-full h-full rounded-xl border-0 transition duration-300 ${
                theme === 'dark' ? 'opacity-85 invert contrast-125 filter grayscale' : 'opacity-90'
              }`}
              allowFullScreen="" 
              loading="lazy"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;