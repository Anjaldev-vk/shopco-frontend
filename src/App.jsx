import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAppDispatch } from "./hooks/reduxHooks";
import { restoreSession } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

import { Toaster } from 'react-hot-toast';
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        containerStyle={{
          top: 65,
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
