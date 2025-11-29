import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice";
import {
  Button,
  ChangePassword,
  Container,
  UpdateAvatar,
} from "../components/index";
import { updateUser } from "../api/index";

function EditUser() {
  const authData = useSelector((state) => state.auth.data);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "MALE",
  });

  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🚀 ~ EditUser ~ authData:", authData);
    if (authData) {
      console.log("🚀 ~ EditUser ~ authData.userName:", authData.userName);
      console.log("🚀 ~ EditUser ~ authData.username:", authData.username);
      console.log("🚀 ~ EditUser ~ All authData keys:", Object.keys(authData));
      
      // Map backend field names to frontend field names
      const mappedData = {
        name: authData.name || "",
        username: authData.userName || authData.username || "", // Try both field names
        email: authData.email || "",
        gender: authData.gender || "MALE",
        // Keep other fields as well
        id: authData.id,
        avtar: authData.avtar,
        role: authData.role,
        createdAt: authData.createdAt,
        updatedAt: authData.updatedAt,
      };
      console.log("🚀 ~ EditUser ~ mappedData:", mappedData);
      setUserData(mappedData);
    }
  }, [authData]);

  const validateField = (field, value) => {
    const errors = {};

    switch (field) {
      case "name":
        if (!value || !value.trim()) {
          errors.name = "Name is required";
        } else if (value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        }
        break;
      case "username":
        if (!value || !value.trim()) {
          errors.username = "Username is required";
        } else if (value.trim().length < 3) {
          errors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          errors.username =
            "Username can only contain letters, numbers, and underscores";
        }
        break;
      case "email":
        if (!value || !value.trim()) {
          errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          errors.email = "Please enter a valid email address";
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const validateAllFields = () => {
    const errors = {};

    Object.assign(errors, validateField("name", userData.name));
    Object.assign(errors, validateField("username", userData.username));
    Object.assign(errors, validateField("email", userData.email));

    return errors;
  };

  const submit = async () => {
    const errors = validateAllFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    setIsError("");
    const updateUserToast = toast.loading("Updating your details...");

    try {
      // Map frontend field names to backend expected field names
      const requestData = {
        name: userData.name,
        username: userData.username, // Frontend username maps to backend username field in DTO
        email: userData.email,
        gender: userData.gender,
      };
      
      console.log("🚀 ~ updateUser ~ userData:", userData);
      console.log("🚀 ~ updateUser ~ userData.username:", userData.username);
      console.log("🚀 ~ updateUser ~ requestData:", requestData);
      
      const response = await updateUser(requestData);
      console.log("🚀 ~ updateUser ~ response:", response);

      // Handle successful response based on backend ApiResponse format
      if (response && response.statusCode === 200) {
        // Update Redux state with new user data from response.data
        dispatch(login(response.data));
        
        toast.success(response.message || "User details updated successfully.", {
          id: updateUserToast,
        });
        
        // Map backend field names to frontend field names for local state
        const mappedResponseData = {
          ...response.data,
          username: response.data.userName, // Map userName to username for frontend
        };
        setUserData(mappedResponseData);
      } else {
        toast.error(response?.message || "Failed to update profile", {
          id: updateUserToast,
        });
      }
    } catch (error) {
      console.log("🚀 ~ updateUser ~ error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error while updating user information.";
      setIsError(message);
      toast.error(`${message}`, {
        id: updateUserToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10">
      <Container>
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Edit Profile</h1>

        {!authData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="row-span-2 rounded-xl border border-gray-200 bg-white p-7 backdrop-blur-md md:col-span-2">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Personal Information
              </h2>

              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      fieldErrors.name
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                        : "border-gray-300"
                    }`}
                    value={userData.name || ""}
                    onChange={(e) => {
                      setUserData({ ...userData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          name: undefined,
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const errors = validateField("name", e.target.value);
                      setFieldErrors((prev) => ({ ...prev, ...errors }));
                    }}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={
                      fieldErrors.name ? "name-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.name && (
                    <p
                      id="name-error"
                      className="text-xs font-medium text-red-400"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="text-base font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      fieldErrors.username
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                        : "border-gray-300"
                    }`}
                    value={userData.username || ""}
                    onChange={(e) => {
                      setUserData({ ...userData, username: e.target.value });
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          username: undefined,
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const errors = validateField("username", e.target.value);
                      setFieldErrors((prev) => ({ ...prev, ...errors }));
                    }}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={
                      fieldErrors.username ? "username-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.username && (
                    <p
                      id="username-error"
                      className="text-xs font-medium text-red-400"
                    >
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      fieldErrors.email
                        ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/30"
                        : "border-gray-300"
                    }`}
                    value={userData.email || ""}
                    onChange={(e) => {
                      setUserData({ ...userData, email: e.target.value });
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    onBlur={(e) => {
                      const errors = validateField("email", e.target.value);
                      setFieldErrors((prev) => ({ ...prev, ...errors }));
                    }}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    required
                  />
                  {fieldErrors.email && (
                    <p
                      id="email-error"
                      className="text-xs font-medium text-red-400"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="gender"
                    className="text-base font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    value={userData.gender || "MALE"}
                    onChange={(e) =>
                      setUserData({ ...userData, gender: e.target.value })
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {isError && (
                  <div
                    className="rounded-xl border border-red-500/40 bg-red-500/15 px-5 py-3 text-sm text-red-600"
                    role="alert"
                  >
                    {isError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 backdrop-blur-md md:col-span-1">
              <UpdateAvatar userData={userData} setUserData={setUserData} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 backdrop-blur-md md:col-span-1">
              <ChangePassword />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default EditUser;
