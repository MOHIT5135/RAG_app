import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ==========================================================
 * Protected Route
 * ==========================================================
 *
 * Only authenticated users can access child routes.
 *
 * If:
 *      loading  -> show loading screen
 *
 *      authenticated -> render child route
 *
 *      not authenticated -> redirect to login
 * ==========================================================
 */

const ProtectedRoute = () => {

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  /**
   * ----------------------------------------------------------
   * Checking Authentication
   * ----------------------------------------------------------
   */

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center bg-zinc-950">

        <p className="text-lg text-zinc-400">

          Checking authentication...

        </p>

      </div>

    );

  }

  /**
   * ----------------------------------------------------------
   * User Not Logged In
   * ----------------------------------------------------------
   */

  if (!isAuthenticated) {

    return <Navigate to="/login" replace />;

  }

  /**
   * ----------------------------------------------------------
   * User Logged In
   * ----------------------------------------------------------
   */

  return <Outlet />;

};

export default ProtectedRoute;