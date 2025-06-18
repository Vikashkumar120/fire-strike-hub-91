
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Trophy, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Check for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = () => {
    try {
      // Load from localStorage for now (can be replaced with Supabase later)
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const userNotifications = allNotifications.filter((notif: any) => notif.userId === user?.id);
      
      // Sort by newest first
      userNotifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = allNotifications.map((notif: any) => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = () => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = allNotifications.map((notif: any) => 
        notif.userId === user?.id ? { ...notif, read: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      loadNotifications();
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const updatedNotifications = allNotifications.filter((notif: any) => notif.id !== notificationId);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      loadNotifications();
      toast({
        title: "Success",
        description: "Notification deleted"
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Trophy className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Bell className="w-6 h-6 mr-2 text-cyan-400" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500/20 text-red-400">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No notifications yet</p>
              <p className="text-gray-500">You'll receive notifications about tournaments and matches here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`bg-black/20 border-l-4 ${
                    notification.read 
                      ? 'border-l-gray-600 opacity-70' 
                      : notification.type === 'success' 
                        ? 'border-l-green-500' 
                        : notification.type === 'warning'
                          ? 'border-l-yellow-500'
                          : notification.type === 'error'
                            ? 'border-l-red-500'
                            : 'border-l-blue-500'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <Badge className={getBadgeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge className="bg-cyan-500/20 text-cyan-400">New</Badge>
                            )}
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-gray-300'} mb-2`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-400 hover:bg-green-500/20"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
