import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-600">FreshHarvest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link 
              href="/" 
              className={`${
                isActive('/') 
                  ? 'border-green-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Home
            </Link>

            {session && (
              <Link 
                href="/orders" 
                className={`${
                  isActive('/orders') 
                    ? 'border-green-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                My Orders
              </Link>
            )}

            {session?.user?.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                className={`${
                  isActive('/admin') 
                    ? 'border-green-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'loading' ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">
                  Hello, {session.user?.name || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="bg-green-600 text-white hover:bg-green-700 rounded-md px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu (hamburger) */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon for X (close) */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`${
              isActive('/')
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
          >
            Home
          </Link>

          {session && (
            <Link
              href="/orders"
              className={`${
                isActive('/orders')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              My Orders
            </Link>
          )}

          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`${
                isActive('/admin')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            >
              Admin
            </Link>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {status === 'loading' ? (
            <div className="flex items-center px-4">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-3 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : session ? (
            <div>
              <div className="flex items-center px-4">
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user?.name || 'User'}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center px-4 py-2">
              <Link
                href="/auth"
                className="bg-green-600 w-full text-center text-white hover:bg-green-700 rounded-md px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}