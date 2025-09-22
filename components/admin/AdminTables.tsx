'use client';

import { useEffect, useState } from 'react';

const statusOptions = ['OPEN', 'ACCEPTED', 'IN_PAYMENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];
const orderStatusOptions = ['PENDING_PAYMENT', 'PAID', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

export function AdminTables() {
  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    const [usersRes, tasksRes, ordersRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/admin/tasks'),
      fetch('/api/admin/orders')
    ]);
    setUsers(await usersRes.json());
    setTasks(await tasksRes.json());
    setOrders(await ordersRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const updateTaskStatus = async (taskId: string, status: string) => {
    await fetch(`/api/admin/tasks/${taskId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    load();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    load();
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-white">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="text-slate-300">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.roles.map((role: any) => role.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">Tasks</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tasks.map((task) => (
                <tr key={task.id} className="text-slate-300">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.owner?.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={task.status}
                      onChange={(event) => updateTaskStatus(task.id, event.target.value)}
                      className="bg-slate-900"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-white">Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Buyer</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="text-slate-300">
                  <td className="px-4 py-2">{order.task?.title}</td>
                  <td className="px-4 py-2">{order.buyer?.email}</td>
                  <td className="px-4 py-2">{order.seller?.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                      className="bg-slate-900"
                    >
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
