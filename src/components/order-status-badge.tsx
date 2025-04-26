import { Badge } from "@/components/ui/badge";

type OrderStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusVariant = () => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "DELIVERED":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "IN_PROGRESS":
        return "In Progress";
      case "DELIVERED":
        return "Delivered";
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusVariant() as any}>
      {getStatusText()}
    </Badge>
  );
}
