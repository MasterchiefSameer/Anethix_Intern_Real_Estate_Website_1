import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

const EMICalculator = ({ initialAmount }) => {
  const [loanAmount, setLoanAmount] = useState(initialAmount || 5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20); // in years

  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Sync initialAmount if it updates
  useEffect(() => {
    if (initialAmount) {
      setLoanAmount(initialAmount);
    }
  }, [initialAmount]);

  useEffect(() => {
    const P = loanAmount;
    const annualRate = interestRate;
    const N = loanTenure * 12; // months

    if (P <= 0 || annualRate <= 0 || N <= 0) {
      setMonthlyEMI(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const r = annualRate / 12 / 100; // monthly interest rate
    
    // EMI Formula: P * r * (1 + r)^N / ((1 + r)^N - 1)
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    
    const totalPayable = emi * N;
    const totalInt = totalPayable - P;

    setMonthlyEMI(Math.round(emi));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPayable));
  }, [loanAmount, interestRate, loanTenure]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className='bg-white dark:bg-[#1a1816] border border-slate-200 dark:border-[#2d2a26] shadow-lg rounded-2xl p-6 w-full flex flex-col gap-6 text-slate-800 dark:text-gray-200 transition-colors duration-250'>
      
      {/* Title */}
      <div className='flex items-center gap-3 border-b border-slate-100 dark:border-[#2d2a26] pb-3'>
        <div className='bg-[#1b4332] text-white p-2.5 rounded-xl'>
          <Calculator size={20} />
        </div>
        <div>
          <h3 className='font-bold text-lg text-slate-900 dark:text-white font-serif'>EMI Calculator</h3>
          <p className='text-xs text-slate-500 dark:text-gray-400 mt-0.5'>Estimate your monthly home loan payment</p>
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        {/* Loan Amount */}
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center text-sm font-semibold'>
            <span className='text-slate-700 dark:text-gray-300'>Loan Amount</span>
            <span className='text-[#3ba264] text-base font-extrabold'>{formatCurrency(loanAmount)}</span>
          </div>
          <input 
            type="range"
            min={100000} // 1 Lakh
            max={100000000} // 10 Crores
            step={50000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className='w-full accent-[#3ba264] cursor-pointer h-1.5 bg-slate-200 dark:bg-[#2d2a26] rounded-lg'
          />
          <div className='flex justify-between text-[10px] text-slate-400 dark:text-gray-500 font-semibold'>
            <span>₹1 L</span>
            <span>₹10 Cr</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center text-sm font-semibold'>
            <span className='text-slate-700 dark:text-gray-300'>Interest Rate (% p.a.)</span>
            <span className='text-[#3ba264] text-base font-extrabold'>{interestRate}%</span>
          </div>
          <input 
            type="range"
            min={5}
            max={15}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className='w-full accent-[#3ba264] cursor-pointer h-1.5 bg-slate-200 dark:bg-[#2d2a26] rounded-lg'
          />
          <div className='flex justify-between text-[10px] text-slate-400 dark:text-gray-500 font-semibold'>
            <span>5%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between items-center text-sm font-semibold'>
            <span className='text-slate-700 dark:text-gray-300'>Loan Tenure</span>
            <span className='text-[#3ba264] text-base font-extrabold'>{loanTenure} years</span>
          </div>
          <input 
            type="range"
            min={5}
            max={30}
            step={1}
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
            className='w-full accent-[#3ba264] cursor-pointer h-1.5 bg-slate-200 dark:bg-[#2d2a26] rounded-lg'
          />
          <div className='flex justify-between text-[10px] text-slate-400 dark:text-gray-500 font-semibold'>
            <span>5 years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Result Area */}
        <div className='bg-slate-50 dark:bg-[#24211e] border border-slate-100 dark:border-[#2d2a26] rounded-xl p-5 flex flex-col gap-4'>
          <div className='flex flex-col'>
            <span className='text-xs text-slate-500 dark:text-gray-400 font-semibold'>Monthly EMI</span>
            <span className='text-2xl font-extrabold text-[#3ba264] font-serif mt-1'>{formatCurrency(monthlyEMI)}</span>
          </div>
          
          <div className='h-[1px] bg-slate-200 dark:bg-[#2d2a26]' />

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <span className='text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider'>Total Interest</span>
              <span className='font-bold text-slate-900 dark:text-white text-sm mt-0.5'>{formatCurrency(totalInterest)}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-[10px] text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider'>Total Payment</span>
              <span className='font-bold text-slate-900 dark:text-white text-sm mt-0.5'>{formatCurrency(totalPayment)}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className='text-[10px] text-slate-400 dark:text-gray-500 leading-relaxed italic'>
          * Indicative only. Actual EMI depends on your bank, eligibility, interest rates, and processing fees.
        </p>

      </div>

    </div>
  );
};

export default EMICalculator;
