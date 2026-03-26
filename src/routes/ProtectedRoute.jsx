import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loginInfo = useSelector(state => state?.auth?.loginDetails);

  if (!loginInfo?.token) {
    return <Navigate to="/" replace />;  // redirect to login
  }

  return children;
};

export default ProtectedRoute;