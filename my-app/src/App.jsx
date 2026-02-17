import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import RegulatoryParams from "./pages/RegulatoryParams";
import GenerateReport from "./pages/GenerateReport";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AiModel from "./pages/aiModel";
import EnergyChargeEstimator from "./pages/ecrModel";
import CoalSlaggingForm from "./pages/CoalSlaggingForm";
import RegulatoryParams2 from "./Backup_19_05_2025/RegulatoryParams2";
import Welcome2 from "./Backup_19_05_2025/Welcome2";
import { GlobalProvider } from "./Tools/GlobalContext";
import GenerateReport2 from "./Backup_19_05_2025/GenerateReport2";
import Home from "./pages/Home";
import CardDetails from "./pages/CardDetails";
import ReportDetails from "./pages/reportDetails";
// Define routes
const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { path: "", element: <Welcome /> },
        { path: "RegulatoryParams", element: <RegulatoryParams /> },
        { path: "generateReport", element: <GenerateReport /> },
        { path: "ai", element: <AiModel /> },
        { path: "ecr", element: <EnergyChargeEstimator /> },
        { path: "coalSlagging", element: <CoalSlaggingForm /> },
        { path: "RegulatoryParams2", element: <RegulatoryParams2 /> },
        { path: "Welcome2", element: <Welcome2 /> },
        { path: "generateReport2", element: <GenerateReport2 /> },
        { path: "modDashboard", element: <Home /> },
        { path: "modCard/:id", element: <CardDetails /> },
        { path: "reportDetails", element: <ReportDetails /> }
      ]
    }
  ],
  {
    basename: "/merc"
  }
);

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <GlobalProvider>
        <RouterProvider router={router} />;
      </GlobalProvider>
    </>
  )
};

export const showToast = async (message, type = "default", promise = null) => {
  // if (promise) {
  // If a promise is passed, use toast.promise

  // return toast.promise(promise, {
  //   pending: message.pending || 'Processing...', // Message during pending state
  //   success: message.success || 'Operation successful!', // Success message
  //   error: message.error || 'Something went wrong!', // Error message
  // })
  if (promise) {
    // Show the pending toast and get its ID
    const pendingToastId = await toast(message.pending || 'Processing...', { isLoading: true });

    try {
      // Wait for the promise to resolve or reject
      const result = await promise;
      // Remove the pending toast and show success message
      toast.update(pendingToastId, {
        isLoading: false,
        render: message.success ? message.success(result) : 'Operation successful!',
        type: 'success',
        autoClose: 3000 // Duration to display the success message
      });

      return result; // Return the result if needed

    } catch (error) {
      // Remove the pending toast and show error message
      toast.update(pendingToastId, {
        isLoading: false,
        render: message.error ? message.error(error) : 'Something went wrong!',
        type: 'error',
        autoClose: 3000 // Duration to display the error message
      });

      throw error; // Re-throw the error if needed
    }
  }

  // Regular toast notifications when no promise is provided
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'info':
      toast.info(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    default:
      toast(message); // Default message
  }
};

export default App;
