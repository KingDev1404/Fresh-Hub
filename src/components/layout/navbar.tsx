'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await fetcher('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <div className="flex items-center cursor-pointer">
                <ShoppingCart className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">FreshBulk</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" passHref>
              <span className="text-gray-700 hover:text-green-600 font-medium">Home</span>
            </Link>
            {user && (
              <Link href="/orders" passHref>
                <span className="text-gray-700 hover:text-green-600 font-medium">My Orders</span>
              </Link>
            )}
            {user && user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <span className="text-gray-700 hover:text-green-600 font-medium">Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => router.push('/auth')} variant="default" size="sm">
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Open main menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" passHref>
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                Home
              </span>
            </Link>
            {user && (
              <Link href="/orders" passHref>
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  My Orders
                </span>
              </Link>
            )}
            {user && user.role === 'ADMIN' && (
              <Link href="/admin" passHref>
                <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                  Admin Dashboard
                </span>
              </Link>
            )}
            {user ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="w-full mt-2"
              >
                Logout
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/auth')} 
                variant="default" 
                className="w-full mt-2"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
