import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth');
  };

  // Check if the user is an admin
  const isAdmin = session?.user?.email === 'admin@example.com';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-600">FreshHarvest</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:space-x-8 sm:items-center">
            <Link href="/" className={`${router.pathname === '/' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-5 text-sm font-medium`}>
              Products
            </Link>
            
            {session && (
              <Link href="/orders" className={`${router.pathname.startsWith('/orders') ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-5 text-sm font-medium`}>
                My Orders
              </Link>
            )}

            {isAdmin && (
              <>
                <Link href="/admin" className={`${router.pathname === '/admin' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-5 text-sm font-medium`}>
                  Admin Dashboard
                </Link>
                <Link href="/admin/products" className={`${router.pathname === '/admin/products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-900'} px-3 py-5 text-sm font-medium`}>
                  Manage Products
                </Link>
              </>
            )}

            {status === 'loading' ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={`${router.pathname === '/' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 text-base font-medium`}>
              Products
            </Link>
            
            {session && (
              <Link href="/orders" className={`${router.pathname.startsWith('/orders') ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 text-base font-medium`}>
                My Orders
              </Link>
            )}

            {isAdmin && (
              <>
                <Link href="/admin" className={`${router.pathname === '/admin' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 text-base font-medium`}>
                  Admin Dashboard
                </Link>
                <Link href="/admin/products" className={`${router.pathname === '/admin/products' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 text-base font-medium`}>
                  Manage Products
                </Link>
              </>
            )}
          </div>

          {/* Mobile user menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {status === 'loading' ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
              </div>
            ) : session ? (
              <div className="space-y-3 px-4">
                <div className="flex items-center px-4">
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{session.user?.name || 'User'}</div>
                    <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3">
                <Link href="/auth" className="block text-center w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}