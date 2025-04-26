import * as React from 'react';

type OrderStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let badgeClasses = '';
  let statusText = '';

  switch (status) {
    case 'PENDING':
      badgeClasses = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      statusText = 'Pending';
      break;
    case 'IN_PROGRESS':
      badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200';
      statusText = 'In Progress';
      break;
    case 'DELIVERED':
      badgeClasses = 'bg-green-100 text-green-800 border-green-200';
      statusText = 'Delivered';
      break;
    default:
      badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200';
      statusText = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClasses}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${status === 'DELIVERED' ? 'bg-green-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
      {statusText}
    </span>
  );
}