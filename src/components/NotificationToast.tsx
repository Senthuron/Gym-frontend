'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '@/lib/SocketContext';
import { Bell, X } from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    type?: string;
}

export const NotificationToast: React.FC = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!socket) return;

        const handleNewFeedback = (data: any) => {
            const newNotification = {
                id: Math.random().toString(36).substr(2, 9),
                message: data.message,
                type: data.type,
            };
            setNotifications((prev) => [...prev, newNotification]);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, 5000);
        };

        socket.on('new_feedback', handleNewFeedback);
        socket.on('new_class_feedback', handleNewFeedback);
        socket.on('new_diet_plan', handleNewFeedback);
        socket.on('update_diet_plan', handleNewFeedback);
        socket.on('new_workout_plan', handleNewFeedback);
        socket.on('update_workout_plan', handleNewFeedback);

        return () => {
            socket.off('new_feedback', handleNewFeedback);
            socket.off('new_class_feedback', handleNewFeedback);
            socket.off('new_diet_plan', handleNewFeedback);
            socket.off('update_diet_plan', handleNewFeedback);
            socket.off('new_workout_plan', handleNewFeedback);
            socket.off('update_workout_plan', handleNewFeedback);
        };
    }, [socket]);

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[300px] animate-in slide-in-from-right-full duration-300"
                >
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{notification.message}</p>
                        {notification.type && (
                            <p className="text-xs text-slate-500 mt-1">Type: {notification.type}</p>
                        )}
                    </div>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
