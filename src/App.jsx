
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./app/router/AppRouter";
import { queryClient } from "./lib/react-query/queryClient";
import { Slide, ToastContainer } from 'react-toastify';
import { AuthInitializer } from "./app/provider/Authinitializer";
function App() {

  return (
    <>
      {/*  enable app to use common queryClient */}
      <QueryClientProvider client={queryClient}>

        <AuthInitializer>

          {/* toast messaging in app */}
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            limit={3}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />

          {/* manges routing */}
          <AppRouter />
        </AuthInitializer>
      </QueryClientProvider>
    </>
  );
}

export default App;