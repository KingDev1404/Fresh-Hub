import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { CartDropdown } from '@/components/cart/CartDropdown';

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

  React.useEffect(() => {
    // Add animation class to navbar on scroll
    const handleScroll = () => {
      const navbar = document.getElementById('main-navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('navbar-scrolled', 'shadow-sm');
        } else {
          navbar.classList.remove('navbar-scrolled', 'shadow-sm');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white animate-fade-in" id="main-navbar">
      <div className="container">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand fw-bold text-success animate-pulse">
            FreshHarvest
          </a>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navbarContent" 
          aria-expanded={isMenuOpen ? "true" : "false"} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className={`nav-link ${router.pathname === '/' ? 'active fw-semibold text-success' : ''}`}>
                  Products
                </a>
              </Link>
            </li>
            
            {session && (
              <li className="nav-item">
                <Link href="/orders" legacyBehavior>
                  <a className={`nav-link ${router.pathname.startsWith('/orders') ? 'active fw-semibold text-success' : ''}`}>
                    My Orders
                  </a>
                </Link>
              </li>
            )}
            
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link href="/admin" legacyBehavior>
                    <a className={`nav-link ${router.pathname === '/admin' ? 'active fw-semibold text-success' : ''}`}>
                      Admin
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/products" legacyBehavior>
                    <a className={`nav-link ${router.pathname === '/admin/products' ? 'active fw-semibold text-success' : ''}`}>
                      Manage Products
                    </a>
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <CartDropdown />
            
            {status === 'loading' ? (
              <div className="spinner-border spinner-border-sm text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : session ? (
              <div className="d-flex align-items-center">
                <span className="text-muted me-2 small">{session.user?.name || session.user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="btn btn-sm btn-outline-success"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth" legacyBehavior>
                <a className="btn btn-sm btn-success animate-pulse">
                  Sign in
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}