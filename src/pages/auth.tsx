import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect to home if already logged in
  React.useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          router.push('/');
        }
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          // Auto login after successful registration
          await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
          });
          router.push('/');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && !formData.name) {
      setError('Please provide your name');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Create Account'} | FreshHarvest</title>
      </Head>

      <div className="flex min-h-[80vh]">
        {/* Form Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold mb-6">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading
                  ? 'Processing...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Hero Column */}
        <div className="hidden md:block md:w-1/2 bg-green-50">
          <div className="flex flex-col justify-center items-center h-full p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Fresh Farm Produce</h2>
            <p className="text-center text-gray-600 max-w-md mb-6">
              Order fresh vegetables and fruits in bulk directly from our farms.
              Enjoy quality products at wholesale prices delivered right to your door.
            </p>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Wide selection of fresh produce</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Bulk ordering for better prices</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Convenient delivery options</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Farm to table freshness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}