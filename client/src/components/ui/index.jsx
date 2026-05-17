import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20',
    outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
  };

  return (
    <button 
      className={twMerge(
        'px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export const Input = ({ className, icon: Icon, label, error, ...props }) => {
  return (
    <div className="space-y-2 w-full group">
      {label && <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 group-focus-within:text-primary-500 transition-colors">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />}
        <input 
          className={twMerge(
            'input-field',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold italic">{error}</p>}
    </div>
  );
};

export const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={twMerge(
        'glass-card p-6 rounded-3xl dark:bg-slate-900/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <svg size={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
