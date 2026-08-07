import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  House,
  Globe 
} from 'lucide-react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  if (isAuthPage) return null;

  return (
    <footer className='bg-[#eae6e1] text-slate-700 border-t border-slate-300/40 dark:bg-[#1a1816] dark:text-gray-400 dark:border-[#2d2a26] py-12 px-6 sm:px-12 md:px-16 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
        
        {/* Left Column - Brand Info */}
        <div className='flex flex-col gap-4'>
          <Link to='/' className='flex items-center gap-2.5'>
            <div className='bg-[#1b4332] text-white p-2 rounded-lg'>
              <House size={20} />
            </div>
            <div className='flex flex-col leading-none'>
              <span className='font-bold text-slate-800 dark:text-white text-lg tracking-tight'>Anethix</span>
              <span className='text-[#3ba264] font-extrabold tracking-widest text-[9px] uppercase mt-0.5'>Real Estate</span>
            </div>
          </Link>
          <p className='text-sm leading-relaxed text-slate-600 dark:text-gray-400 max-w-xs mt-2'>
            A boutique property advisory helping families and investors find their next address across India's most sought-after cities.
          </p>
        </div>

        {/* Middle Column 1 - Explore */}
        <div className='flex flex-col gap-4'>
          <h3 className='text-sm font-bold tracking-wider text-slate-800 dark:text-white uppercase'>Explore</h3>
          <ul className='flex flex-col gap-2.5 text-sm font-medium'>
            <li><Link to='/search' className='hover:text-[#3ba264] transition'>All Listings</Link></li>
            <li><Link to='/search?type=rent' className='hover:text-[#3ba264] transition'>Apartments</Link></li>
            <li><Link to='/search?type=sale' className='hover:text-[#3ba264] transition'>Villas</Link></li>
            <li><Link to='/search?type=sale' className='hover:text-[#3ba264] transition'>Plots</Link></li>
            <li><Link to='/search' className='hover:text-[#3ba264] transition'>Commercial</Link></li>
            <li><Link to='/search?type=rent' className='hover:text-[#3ba264] transition'>Independent Houses</Link></li>
            <li><Link to='/search' className='hover:text-[#3ba264] transition'>Map Search</Link></li>
          </ul>
        </div>

        {/* Middle Column 2 - Company */}
        <div className='flex flex-col gap-4'>
          <h3 className='text-sm font-bold tracking-wider text-slate-800 dark:text-white uppercase'>Company</h3>
          <ul className='flex flex-col gap-2.5 text-sm font-medium'>
            <li><Link to='/about' className='hover:text-[#3ba264] transition'>About Us</Link></li>
            <li><Link to='/contact' className='hover:text-[#3ba264] transition'>Contact</Link></li>
            <li><Link to='/contact' className='hover:text-[#3ba264] transition'>Compare Properties</Link></li>
            <li><Link to='/about' className='hover:text-[#3ba264] transition'>Privacy Policy</Link></li>
            <li><Link to='/about' className='hover:text-[#3ba264] transition'>Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Right Column - Contact Details & Socials */}
        <div className='flex flex-col gap-4'>
          <h3 className='text-sm font-bold tracking-wider text-slate-800 dark:text-white uppercase'>Get in Touch</h3>
          <ul className='flex flex-col gap-3.5 text-sm font-medium'>
            <li className='flex items-start gap-3.5'>
              <MapPin size={18} className='text-slate-500 dark:text-[#3ba264] shrink-0 mt-0.5' />
              <span>Christian Basti, Guwahati, Assam 781005</span>
            </li>
            <li className='flex items-center gap-3.5'>
              <Phone size={18} className='text-slate-500 dark:text-[#3ba264] shrink-0' />
              <span>+91 6544357535</span>
            </li>
            <li className='flex items-center gap-3.5'>
              <Mail size={18} className='text-slate-500 dark:text-[#3ba264] shrink-0' />
              <span>info@anethixrealty.com</span>
            </li>
          </ul>

          {/* Social Outlined Icons */}
          <div className='flex gap-3 mt-3'>
            <a 
              href='https://linkedin.com' 
              target='_blank' 
              rel='noopener noreferrer'
              className='border border-slate-300 text-slate-600 hover:text-[#3ba264] hover:border-[#3ba264] dark:border-gray-800 dark:text-gray-400 dark:hover:text-[#3ba264] dark:hover:border-[#3ba264] p-2 rounded-full transition hover:scale-105'
            >
              <FaLinkedin size={16} />
            </a>
            <a 
              href='https://instagram.com' 
              target='_blank' 
              rel='noopener noreferrer'
              className='border border-slate-300 text-slate-600 hover:text-[#3ba264] hover:border-[#3ba264] dark:border-gray-800 dark:text-gray-400 dark:hover:text-[#3ba264] dark:hover:border-[#3ba264] p-2 rounded-full transition hover:scale-105'
            >
              <FaInstagram size={16} />
            </a>
            <a 
              href='https://google.com' 
              target='_blank' 
              rel='noopener noreferrer'
              className='border border-slate-300 text-slate-600 hover:text-[#3ba264] hover:border-[#3ba264] dark:border-gray-800 dark:text-gray-400 dark:hover:text-[#3ba264] dark:hover:border-[#3ba264] p-2 rounded-full transition hover:scale-105'
            >
              <Globe size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
