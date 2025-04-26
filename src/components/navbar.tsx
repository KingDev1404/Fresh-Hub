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
    <header className="bg-white border-b border-gray-200">
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a className="text-lg font-bold text-green-600">FreshHarvest</a>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 ml-10">
            <Link href="/" legacyBehavior>
              <a className={`px-2 py-1 text-sm font-medium ${router.pathname === '/' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Products
              </a>
            </Link>
            
            {session && (
              <Link href="/orders" legacyBehavior>
                <a className={`px-2 py-1 text-sm font-medium ${router.pathname.startsWith('/orders') ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}>
                  My Orders
                </a>
              </Link>
            )}

            {isAdmin && (
              <>
                <Link href="/admin" legacyBehavior>
                  <a className={`px-2 py-1 text-sm font-medium ${router.pathname === '/admin' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}>
                    Admin
                  </a>
                </Link>
                <Link href="/admin/products" legacyBehavior>
                  <a className={`px-2 py-1 text-sm font-medium ${router.pathname === '/admin/products' ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'}`}>
                    Products
                  </a>
                </Link>
              </>
            )}
          </div>

          {/* Right side: Auth controls */}
          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
            ) : session ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-gray-600">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth" legacyBehavior>
                <a className="hidden md:block bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium">
                  Sign in
                </a>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden ml-2 p-1 rounded-md text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-gray-200">
            <div className="space-y-1">
              <Link href="/" legacyBehavior>
                <a className={`block px-3 py-2 text-sm ${router.pathname === '/' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  Products
                </a>
              </Link>
              
              {session && (
                <Link href="/orders" legacyBehavior>
                  <a className={`block px-3 py-2 text-sm ${router.pathname.startsWith('/orders') ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    My Orders
                  </a>
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link href="/admin" legacyBehavior>
                    <a className={`block px-3 py-2 text-sm ${router.pathname === '/admin' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      Admin Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/products" legacyBehavior>
                    <a className={`block px-3 py-2 text-sm ${router.pathname === '/admin/products' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      Manage Products
                    </a>
                  </Link>
                </>
              )}

              {/* Mobile auth controls */}
              {session ? (
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <div className="flex items-center px-3">
                    <span className="text-sm font-medium text-gray-800">{session.user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block mt-2 w-full text-left px-3 py-2 text-sm text-gray-500"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="pt-2 pb-2 border-t border-gray-200">
                  <Link href="/auth" legacyBehavior>
                    <a className="block w-full text-center mt-2 mx-3 bg-green-600 text-white px-3 py-1 rounded text-sm">
                      Sign in
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}