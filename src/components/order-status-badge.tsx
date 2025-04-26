import * as React from 'react';

type OrderStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let badgeClass = '';
  let statusText = '';
  let animation = '';
  let icon = null;

  switch (status) {
    case 'PENDING':
      badgeClass = 'bg-warning text-dark';
      statusText = 'Pending';
      animation = 'animate-pulse';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-clock me-1" viewBox="0 0 16 16">
          <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
        </svg>
      );
      break;
    case 'IN_PROGRESS':
      badgeClass = 'bg-info text-dark';
      statusText = 'In Progress';
      animation = 'animate-shimmer';
      icon = (
        <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" style={{ width: '8px', height: '8px' }}></span>
      );
      break;
    case 'DELIVERED':
      badgeClass = 'bg-success text-white';
      statusText = 'Delivered';
      animation = 'animate-fade-in';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-check-circle-fill me-1" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      );
      break;
    default:
      badgeClass = 'bg-secondary text-white';
      statusText = String(status);
      icon = null;
  }

  return (
    <span 
      className={`badge ${badgeClass} ${animation}`}
      style={{ 
        padding: '0.4em 0.6em',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {icon}
      {statusText}
    </span>
  );
}