import React from 'react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Pending Verifications',
      value: stats?.pendingDeviceVerifications || 0,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50'
    },
    {
      title: 'Total Deposits',
      value: `RWF ${(stats?.totalDeposits || 0).toLocaleString()}`,
      subtitle: `${stats?.depositCount || 0} transactions`,
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50'
    },
    {
      title: 'Total Withdrawals',
      value: `RWF ${(stats?.totalWithdrawals || 0).toLocaleString()}`,
      subtitle: `${stats?.withdrawalCount || 0} transactions`,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{card.title}</p>
              <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;