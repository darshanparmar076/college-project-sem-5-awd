import { Button } from "./index";
import { changePassword } from "../api";
import toast from "react-hot-toast";
import { useState } from "react";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (field, value) => {
    const errors = {};

    switch (field) {
      case "currentPassword":
        if (!value || !value.trim()) {
          errors.currentPassword = "Current password is required";
        }
        break;
      case "newPassword":
        if (!value || !value.trim()) {
          errors.newPassword = "New password is required";
        } else if (value.length < 8) {
          errors.newPassword = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.newPassword = "Password must contain uppercase, lowercase, and number";
        }
        break;
      case "confirmPassword":
        if (!value || !value.trim()) {
          errors.confirmPassword = "Please confirm your password";
        } else if (value !== newPassword) {
          errors.confirmPassword = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const validateAllFields = () => {
    const errors = {};

    Object.assign(errors, validateField("currentPassword", currentPassword));
    Object.assign(errors, validateField("newPassword", newPassword));
    Object.assign(errors, validateField("confirmPassword", confirmPassword));

    return errors;
  };

  const submit = async () => {
    const errors = validateAllFields();
    setFieldErrors(errors);
    setError("");

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    const changePasswordToast = toast.loading("Changing password...");

    try {
      const response = await changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      console.log("🚀 ~ submit ~ response:", response);

      // Handle successful response based on backend ApiResponse format
      if (response && response.statusCode === 200) {
        // Clear form fields on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setFieldErrors({});
        setError("");

        toast.success(response.message || "Password changed successfully.", {
          id: changePasswordToast,
        });
      } else {
        const errorMessage = response?.message || "Failed to change password";
        setError(errorMessage);
        toast.error(errorMessage, {
          id: changePasswordToast,
        });
      }
    } catch (error) {
      console.log("🚀 ~ submit ~ error:", error);
      const message =
        error.response?.data?.message || 
        error.response?.data ||
        error.message ||
        "Error changing password";
      setError(message);
      toast.error(message, {
        id: changePasswordToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Change Password
      </h2>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="currentPassword"
            className="text-base font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="••••••••"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              fieldErrors.currentPassword
                ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-300"
            }`}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (fieldErrors.currentPassword) {
                setFieldErrors((prev) => ({
                  ...prev,
                  currentPassword: undefined,
                }));
              }
            }}
            onBlur={(e) => {
              const errors = validateField("currentPassword", e.target.value);
              setFieldErrors((prev) => ({ ...prev, ...errors }));
            }}
          />
          {fieldErrors.currentPassword && (
            <p
              id="currentPassword-error"
              className="text-xs font-medium text-red-400"
            >
              {fieldErrors.currentPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-base font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              fieldErrors.newPassword
                ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-300"
            }`}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.newPassword) {
                setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
              }
              if (
                fieldErrors.confirmPassword &&
                e.target.value === confirmPassword
              ) {
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }
            }}
            onBlur={(e) => {
              const errors = validateField("newPassword", e.target.value);
              setFieldErrors((prev) => ({ ...prev, ...errors }));
            }}
          />
          {fieldErrors.newPassword && (
            <p
              id="newPassword-error"
              className="text-xs font-medium text-red-400"
            >
              {fieldErrors.newPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-base font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              fieldErrors.confirmPassword
                ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-300"
            }`}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }
            }}
            onBlur={(e) => {
              const errors = validateField("confirmPassword", e.target.value);
              setFieldErrors((prev) => ({ ...prev, ...errors }));
            }}
          />
          {fieldErrors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-xs font-medium text-red-400"
            >
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {error && (
          <div
            className="rounded-xl border border-red-500/40 bg-red-500/15 px-5 py-3 text-sm text-red-600"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button
          disabled={loading}
          type="submit"
          className="flex w-full items-center justify-center"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </Button>
      </form>
    </>
  );
}

export default ChangePassword;
