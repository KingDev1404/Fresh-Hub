import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (path === '/' && router.pathname !== '/') {
      return false;
    }
    return router.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" legacyBehavior>
                <a className="text-xl font-bold text-green-600">FreshHarvest</a>
              </Link>
            </div>
            
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" legacyBehavior>
                <a
                  className={`${
                    isActive('/') && !isActive('/orders') && !isActive('/admin')
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Products
                </a>
              </Link>
              
              {status === 'authenticated' && (
                <Link href="/orders" legacyBehavior>
                  <a
                    className={`${
                      isActive('/orders')
                        ? 'border-green-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    My Orders
                  </a>
                </Link>
              )}
              
              {isAdmin && (
                <Link href="/admin" legacyBehavior>
                  <a
                    className={`${
                      isActive('/admin')
                        ? 'border-green-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Admin
                  </a>
                </Link>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === 'authenticated' ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    id="user-menu-button"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {session.user?.name ? (
                        <span className="text-sm font-medium text-gray-700">
                          {session.user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-700">U</span>
                      )}
                    </div>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{session.user?.name || 'User'}</div>
                      <div className="text-gray-500 truncate">{session.user?.email}</div>
                    </div>
                    
                    <Link href="/orders" legacyBehavior>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-0"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </a>
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/admin" legacyBehavior>
                        <a
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </a>
                      </Link>
                    )}
                    
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/auth" legacyBehavior>
                  <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                    Sign in
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
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
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
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
                  strokeWidth="2"
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
          <Link href="/" legacyBehavior>
            <a
              className={`${
                isActive('/') && !isActive('/orders') && !isActive('/admin')
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </a>
          </Link>
          
          {status === 'authenticated' && (
            <Link href="/orders" legacyBehavior>
              <a
                className={`${
                  isActive('/orders')
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </a>
            </Link>
          )}
          
          {isAdmin && (
            <Link href="/admin" legacyBehavior>
              <a
                className={`${
                  isActive('/admin')
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </a>
            </Link>
          )}
        </div>
        
        {status === 'authenticated' ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {session.user?.name ? (
                    <span className="text-sm font-medium text-gray-700">
                      {session.user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-700">U</span>
                  )}
                </div>
              </div>
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
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4">
              <Link href="/auth" legacyBehavior>
                <a 
                  className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}