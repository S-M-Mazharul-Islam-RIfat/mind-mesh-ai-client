import type { ReactNode } from "react";
import type { RootState } from "../redux/store";
import { useAppSelector } from "../redux/hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
   const user = useAppSelector((state: RootState) => state.auth.user);
   if (user) {
      return <Navigate to="/profile" replace />;
   }
   return children
};

export default ProtectedRoute;