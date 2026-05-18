import React, { useEffect, useState } from 'react';

import { Bell, Loader2 } from 'lucide-react';

import api from '../utils/api';

const Notification = () => {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {

    try {

      const res = await api.get(
        '/api/notifications'
      );

      setNotifications(res.data || []);

    } catch (err) {

      console.error(
        'Notification fetch error:',
        err.response?.data || err.message
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Notifications
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Escalations, approvals and updates.
        </p>
      </div>

      {loading ? (

        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-primary-500"
            size={40}
          />
        </div>

      ) : notifications.length === 0 ? (

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">

          <Bell
            className="mx-auto text-slate-300 mb-4"
            size={50}
          />

          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
            No Notifications
          </h3>

        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((notification) => (

            <div
              key={notification._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {notification.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {notification.message}
                  </p>

                </div>

                <span className="text-xs text-slate-400">
                  {new Date(
                    notification.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Notifications;