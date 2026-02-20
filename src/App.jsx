import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { restoreSession } from "./features/auth/authSlice";
import { selectAuthLoading } from "./features/auth/selectors";

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./utils/ScrollToTop";

/* =========================
   Auth Bootstrap Loader
========================= */
function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);

  // On first app load, restore session using refresh cookie
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  /* ---------- VERY IMPORTANT ----------
     Do not render routes until auth check completes
  ------------------------------------ */
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="text-gray-600 text-sm tracking-wide">
            Restoring session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{ top: 65 }}
      />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;