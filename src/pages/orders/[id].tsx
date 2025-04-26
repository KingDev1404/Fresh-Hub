import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  // Fetch order when authenticated and ID is available
  React.useEffect(() => {
    if (status === 'authenticated' && id) {
      fetchOrder();
    }
  }, [status, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <>
        <Head>
          <title>Order Not Found | FreshHarvest</title>
        </Head>

        <div className="min-vh-100 bg-light">
          <Navbar />

          <main className="container py-5">
            <div className="text-center p-5 bg-danger-subtle rounded-3 animate-fade-in">
              <p className="text-danger mb-4 fs-5">
                {error || 'Order not found'}
              </p>
              <Link href="/orders" legacyBehavior>
                <a className="btn btn-success animate-pulse">
                  <i className="bi bi-arrow-left me-2"></i>
                  Return to Orders
                </a>
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{order.id} | FreshHarvest</title>
      </Head>

      <div className="min-vh-100 bg-light">
        <Navbar />

        <main className="container py-5 animate-fade-in">
          <div className="mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
            <div>
              <div className="d-flex align-items-center">
                <h1 className="fs-2 fw-bold text-dark me-3">
                  Order #{order.id}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-muted mt-1">
                <i className="bi bi-calendar3 me-2"></i>
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <Link href="/orders" legacyBehavior>
                <a className="btn btn-outline-success btn-sm">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to orders
                </a>
              </Link>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4 animate-fade-in">
            <div className="card-header bg-success bg-opacity-10 py-3">
              <h3 className="fs-5 fw-semibold text-success m-0">
                <i className="bi bi-info-circle me-2"></i>
                Order Summary
              </h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <tbody>
                    <tr>
                      <th className="ps-4 py-3 text-muted" style={{ width: "25%" }}>Status</th>
                      <td className="py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-4 py-3 text-muted">Total Amount</th>
                      <td className="py-3 fw-bold text-success">
                        {formatCurrency(order.totalAmount)}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-4 py-3 text-muted">Delivery Name</th>
                      <td className="py-3">
                        {order.deliveryName}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-4 py-3 text-muted">Contact Number</th>
                      <td className="py-3">
                        {order.deliveryPhone}
                      </td>
                    </tr>
                    <tr>
                      <th className="ps-4 py-3 text-muted">Delivery Address</th>
                      <td className="py-3">
                        {order.deliveryAddress}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="fs-4 fw-bold text-dark mb-3">
              <i className="bi bi-basket me-2"></i>
              Order Items
            </h2>
            
            <div className="row row-cols-1 g-4">
              {order.orderItems.map((item: any) => (
                <div key={item.id} className="col animate-fade-in delay-100">
                  <div className="card h-100 border-0 shadow-sm hover-lift">
                    <div className="row g-0">
                      <div className="col-md-3 col-lg-2">
                        <div className="position-relative" style={{ height: "100%" }}>
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="img-fluid rounded-start h-100 w-100"
                              style={{ 
                                objectFit: "cover", 
                                aspectRatio: "1/1",
                                transition: "all 0.5s ease"
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                          )}
                          <div className="position-absolute top-0 end-0 p-2">
                            <span className="badge bg-warning rounded-pill">
                              {item.quantity} kg
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 col-lg-10">
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                          <div>
                            <div className="d-flex justify-content-between align-items-start">
                              <h4 className="card-title fw-semibold mb-1">
                                {item.product.name}
                              </h4>
                              <span className="fs-5 fw-bold text-success">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                            <p className="card-text text-muted mb-0">
                              Unit Price: {formatCurrency(item.price)} per kg
                            </p>
                          </div>
                          
                          <div className="mt-3">
                            <div className="progress" style={{ height: "8px" }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: "100%" }}
                                role="progressbar" 
                                aria-valuenow={100} 
                                aria-valuemin={0} 
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <p className="text-muted mt-2 mb-0 small">
                              <i className="bi bi-check-circle-fill text-success me-1"></i>
                              Included in your order
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-5 text-center">
            <Link href="/" legacyBehavior>
              <a className="btn btn-success">
                <i className="bi bi-cart-plus me-2"></i>
                Continue Shopping
              </a>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}