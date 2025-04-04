import { useState } from "react";
import Swal from "sweetalert2";
import api from "@/utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
        const response = await api.post(
            "/admin/login", 
            { email, password },
            { requiresToken: false } // THIS IS CRUCIAL
          );
      const { token, admin } = response.data.data;
  
      localStorage.setItem("token", token);
      localStorage.setItem("admin", JSON.stringify(admin));
      
    
      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Navigation triggered to:", "/dashboard/packages");
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="hidden lg:block w-1/2">
        {/* <img src={loginSvg} alt="Login Illustration" className="w-4/5 mx-auto" /> */}
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Sign In</h1>
          <p className="text-sm text-gray-600">Login to manage ViraShare</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-dark transition"
            disabled={loading}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;