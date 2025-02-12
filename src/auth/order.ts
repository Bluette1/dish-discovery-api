const canViewOrder = (
  user: UserPayload | undefined,
  order: { user: { _id: { toString: () => any } } }
) => {
  return (
    user &&
    (user.role === 'admin' || user.id.toString() === order.user._id.toString())
  );
};

const scopedOrders = (user: UserPayload | undefined, orders: any[]) => {
  if (user && user.role === 'admin') {
    return orders;
  }

  return orders.filter(
    (order: { user: { _id: { toString: () => any } } }) =>
      user && order.user._id.toString() === user.id.toString()
  );
};

export { canViewOrder, scopedOrders };
