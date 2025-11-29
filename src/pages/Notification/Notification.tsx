import { useState } from "react";
import { Bell, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetAllNotificationByUserQuery } from "../../redux/features/notification/notificationApi";
import { useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import CommonLoader from "../../shared/CommonLoader";
import type { TNotification } from "../../types/notification.type";

const Notification = () => {
   const currentUser = useAppSelector((state: RootState) => state.auth.user);
   const [page, setPage] = useState(1);
   const limit = 5;
   const { data, isLoading, isFetching } = useGetAllNotificationByUserQuery({ userId: currentUser?.id, page, limit });
   const notifications = data?.data || [];
   const totalPages = data?.meta?.totalPages;

   const handlePageChange = (page: number) => {
      setPage(page);
   }

   if (isLoading || isFetching) {
      return <CommonLoader />;
   }

   if (notifications.length === 0) {
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
            {notifications.map((notification: TNotification) => (
               <Link
                  key={notification._id}
                  to={`/thread/${notification.threadId}`}
                  className="block p-4 rounded-xl border transition-all duration-300 hover:shadow-md bg-white animate-fade-in"
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
            ))}
         </div>
         <div className="flex justify-center items-center gap-2 mt-6">
            <button
               className="flex items-center gap-1 px-3 py-1 rounded-md border hover:bg-gray-100 transition cursor-pointer"
               onClick={() => handlePageChange(page - 1)}
               disabled={page === 1}
            >
               <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((currentPage) => (
               <button
                  key={currentPage}
                  className={`px-3 py-1 rounded-md border transition ${currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-100 cursor-pointer"
                     }`}
                  onClick={() => handlePageChange(currentPage)}
               >
                  {currentPage}
               </button>
            ))}
            <button
               className="flex items-center gap-1 px-3 py-1 rounded-md border hover:bg-gray-100 transition cursor-pointer"
               onClick={() => handlePageChange(page + 1)}
               disabled={page === totalPages}
            >
               <ChevronRight size={16} />
            </button>
         </div>
      </div>
   );
};

export default Notification;
