import React, { useEffect, useState } from 'react';
import './Notification.css';

/**
 * Notification Component - Replaces alert() with a better UX
 *
 * Usage:
 * import { useNotification } from './Notification';
 *
 * const notify = useNotification();
 * notify.success("Operation completed!");
 * notify.error("Something went wrong");
 * notify.info("Here's some info");
 */

const NotificationContext = React.createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const notify = {
    success: (message) => addNotification(message, 'success'),
    error: (message) => addNotification(message, 'error'),
    info: (message) => addNotification(message, 'info'),
    warning: (message) => addNotification(message, 'warning'),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notification-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification notification-${type}`}>
            <span className="notification-icon">
              {type === 'success' && '✓'}
              {type === 'error' && '✕'}
              {type === 'info' && 'ℹ'}
              {type === 'warning' && '⚠'}
            </span>
            <span className="notification-message">{message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export default NotificationProvider;
