'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

// Mock data
const MOCK_USERS = [
  { id: '1', username: 'johndoe', email: 'john@example.com', joinDate: 'Jan 15, 2023', currentPath: 'Frontend', totalXp: 2500, lastActive: '2 hours ago' },
  { id: '2', username: 'janedoe', email: 'jane@example.com', joinDate: 'Feb 02, 2023', currentPath: 'Backend', totalXp: 3100, lastActive: '1 day ago' },
  { id: '3', username: 'bobsmith', email: 'bob@example.com', joinDate: 'Mar 10, 2023', currentPath: 'Fullstack', totalXp: 1500, lastActive: '3 days ago' },
  { id: '4', username: 'alicewonder', email: 'alice@example.com', joinDate: 'Apr 05, 2023', currentPath: 'Data Science', totalXp: 4200, lastActive: '5 mins ago' },
];

const PATH_COLORS: Record<string, string> = {
  Frontend: 'bg-primary-fixed text-primary',
  Backend: 'bg-tertiary-fixed text-tertiary',
  Fullstack: 'bg-secondary-container text-secondary',
  'Data Science': 'bg-surface-container-highest text-on-surface-variant',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-body-sm">
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        <span className="text-on-surface-variant">/</span>
        <span className="text-on-surface">Users</span>
      </div>

      {/* Header */}
      <h1 className="text-h1 font-heading text-on-surface">User Manager</h1>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Username
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Join Date
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Current Path
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Total XP
              </th>
              <th className="text-left px-4 py-4 text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-4 py-5">
                  <span className="text-body-md font-semibold text-on-surface">
                    {user.username}
                  </span>
                </td>
                <td className="px-4 py-5 text-body-md text-on-surface-variant">
                  {user.email}
                </td>
                <td className="px-4 py-5 text-body-md text-on-surface-variant">
                  {user.joinDate}
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold ${PATH_COLORS[user.currentPath] || 'bg-surface-container text-on-surface-variant'}`}
                  >
                    {user.currentPath}
                  </span>
                </td>
                <td className="px-4 py-5">
                  <span className="text-body-md font-bold text-primary">
                    {user.totalXp.toLocaleString()} XP
                  </span>
                </td>
                <td className="px-4 py-5 text-body-md text-on-surface-variant">
                  {user.lastActive}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-body-md text-on-surface-variant"
                >
                  No users found matching &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
