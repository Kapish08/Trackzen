import React from 'react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Input, Button } from '../ui';

const LoginForm = ({ email, password, onChange, onSubmit, isLoading, isError, message }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input 
        label="Work Email"
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        icon={Mail}
        placeholder="name@company.com"
        required
      />

      <Input 
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        icon={Lock}
        placeholder="••••••••"
        required
      />

      {isError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{message}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
