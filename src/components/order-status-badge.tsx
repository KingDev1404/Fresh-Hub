import * as React from 'react';

type OrderStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let badgeClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  let statusText = '';

  switch (status) {
    case 'PENDING':
      badgeClasses += ' bg-yellow-100 text-yellow-800';
      statusText = 'Pending';
      break;
    case 'IN_PROGRESS':
      badgeClasses += ' bg-blue-100 text-blue-800';
      statusText = 'In Progress';
      break;
    case 'DELIVERED':
      badgeClasses += ' bg-green-100 text-green-800';
      statusText = 'Delivered';
      break;
    default:
      badgeClasses += ' bg-gray-100 text-gray-800';
      statusText = 'Unknown';
  }

  return (
    <span className={badgeClasses}>
      <span className={`h-1.5 w-1.5 rounded-full ${
        status === 'PENDING' ? 'bg-yellow-400' :
        status === 'IN_PROGRESS' ? 'bg-blue-400' :
        status === 'DELIVERED' ? 'bg-green-400' : 'bg-gray-400'
      } mr-1.5`} aria-hidden="true"></span>
      {statusText}
    </span>
  );
}