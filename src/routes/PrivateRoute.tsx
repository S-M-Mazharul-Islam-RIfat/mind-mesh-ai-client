import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/features/auth/authSlice";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../redux/store";

type TProtectedRoute = {
   children: ReactNode;
   role: string | undefined;
};

const PrivateRoute = ({ children, role }: TProtectedRoute) => {
   const dispatch = useAppDispatch();
   const location = useLocation();
   const user = useAppSelector((state: RootState) => state.auth.user);

   if (!user) {
      dispatch(logout());
      return <Navigate to="/login" state={{ from: location }} replace={true} />;
   }

   if (role && user?.role !== role) {
      dispatch(logout());
      return <Navigate to="/login" state={{ from: location }} replace={true} />;
   }

   return children;
};

export default PrivateRoute;