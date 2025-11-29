import { Toaster } from "react-hot-toast";

function ThemedToaster() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        className: '',
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#111827',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #10b981',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #3b82f6',
          },
        },
      }}
    />
  );
}

export default ThemedToaster;