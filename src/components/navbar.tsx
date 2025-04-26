import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth');
  };

  const isActive = (path: string) => {
    return router.pathname === path ? 'text-green-600' : 'text-gray-600 hover:text-green-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" legacyBehavior>
                <a className="text-2xl font-bold text-green-600">FreshHarvest</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" legacyBehavior>
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  router.pathname === '/' 
                    ? 'border-green-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}>
                  Products
                </a>
              </Link>
              
              {status === 'authenticated' && (
                <Link href="/orders" legacyBehavior>
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    router.pathname.startsWith('/orders') 
                      ? 'border-green-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}>
                    My Orders
                  </a>
                </Link>
              )}
              
              {status === 'authenticated' && session?.user?.role === 'ADMIN' && (
                <Link href="/admin" legacyBehavior>
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                    router.pathname.startsWith('/admin') 
                      ? 'border-green-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}>
                    Admin
                  </a>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'authenticated' ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm font-medium text-gray-700 hover:text-green-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth" legacyBehavior>
                <a className="text-sm font-medium text-gray-700 hover:text-green-600">
                  Sign In
                </a>
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${menuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" legacyBehavior>
            <a
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                router.pathname === '/'
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Products
            </a>
          </Link>
          
          {status === 'authenticated' && (
            <Link href="/orders" legacyBehavior>
              <a
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname.startsWith('/orders')
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </a>
            </Link>
          )}
          
          {status === 'authenticated' && session?.user?.role === 'ADMIN' && (
            <Link href="/admin" legacyBehavior>
              <a
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname.startsWith('/admin')
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </a>
            </Link>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {status === 'authenticated' ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-700 font-semibold">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {session.user.name || session.user.email}
                </div>
                <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Link href="/auth" legacyBehavior>
                <a
                  className="block text-center px-4 py-2 text-base font-medium text-green-600 hover:text-green-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </a>
              </Link>
            </div>
          )}
          
          {status === 'authenticated' && (
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}