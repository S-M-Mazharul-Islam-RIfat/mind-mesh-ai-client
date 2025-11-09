import { useState, useEffect } from "react";
import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllNotificationByUserQuery } from "../../redux/features/notification/notificationApi";
import { useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";

const Notification = () => {
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const { data, isLoading } = useGetAllNotificationByUserQuery(currentUser?.id);
   const notifications = data?.data;
   console.log(notifications);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-[60vh] text-gray-500">
            Loading notifications...
         </div>
      );
   }

   if (notifications?.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <Bell size={48} className="mb-2 text-gray-400" />
            <p>No notifications yet</p>
         </div>
      );
   }

   return (
      <div className="max-w-3xl mx-auto p-4">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
               <Bell className="text-blue-500" /> Notifications
            </h2>
         </div>

         <div className="space-y-4">
            {
               notifications.map(notification =>
                  <Link
                     key={notification._id}
                     to={`/thread/${notification.threadId}`}
                     className={`block p-4 rounded-xl border transition-all duration-200 hover:shadow-md 
                     }`}
                  >
                     <div className="flex items-start gap-3">
                        <MessageCircle
                           className={`mt-1 ${notification.type === "reply" ? "text-green-500" : "text-blue-500"
                              }`}
                           size={20}
                        />
                        <div className="flex flex-col">
                           <p className="text-gray-800 font-medium">{notification.message}</p>
                           <p className="text-sm text-gray-600 mt-1">
                              Thread:{" "}
                              <span className="font-semibold text-blue-600 hover:underline">
                                 {notification.threadTitle}
                              </span>
                           </p>
                           <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                           </p>
                        </div>
                     </div>
                  </Link>
               )
            }
         </div>
      </div>
   );
};

export default Notification;
