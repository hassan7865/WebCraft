import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import logo from "@/assets/logo.svg";
import api from "@/api/serverapi";
import UserState from "@/utils/UserState";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [validatedEmail, setValidatedEmail] = useState("");

    const { setCurrentUser } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateFormData = () => {
        const { email, password, username } = formData;
        
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }
        
        if (!password.trim()) {
            toast.error("Password is required");
            return false;
        }
        
        if (!isLogin && !username.trim()) {
            toast.error("Username is required for signup");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Password validation
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        return true;
    };

    const checkExistingUser = async () => {
        try {
            const { email, username } = formData;

            const query = new URLSearchParams({ email, username }).toString();
            const userCheck = await api.get(`/auth/check-user?${query}`);
            
            if (isLogin) {
                // For login, user must exist
                if (!userCheck.data.exists) {
                    toast.error("No account found with this email address");
                    return false;
                }
            } else {
                // For signup, user should not exist
                if (userCheck.data.exists) {
                    toast.error("User with this email or username already exists");
                    return false;
                }
            }
            
            return true;
        } catch (error: any) {
            return false;
        }
    };

    const validateCredentials = async () => {
        try {
            const { email, password } = formData;
            const response = await api.post("/auth/validate-credentials", {
                email,
                password
            });
            
            if (!response.data.valid) {
                toast.error("Invalid email or password");
                return false;
            }
            
            return true;
        } catch (error: any) {
            return false;
        }
    };

    const handleOtpSend = async () => {
        if (!validateFormData()) {
            return;
        }

        setIsLoading(true);
        try {
            // Check existing user before sending OTP
            const userCheckPassed = await checkExistingUser();
            if (!userCheckPassed) {
                return;
            }

            // For login, validate credentials before sending OTP
            if (isLogin) {
                const credentialsValid = await validateCredentials();
                if (!credentialsValid) {
                    return;
                }
            }

            // Send OTP
            const response = await api.post("/otp/sendOTP", { 
                email: formData.email 
            });
            
            if (response.data.Status) {
                setIsOtpSent(true);
                setValidatedEmail(formData.email);
                toast.success("OTP sent to your email");
            } else {
                toast.error(response.data.message || "Failed to send OTP");
            }
        } catch (error: any) {
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerifyAndSubmit = async () => {
        if (!otp.trim()) {
            toast.error("Please enter the OTP sent to your email");
            return;
        }

      

        setIsLoading(true);
        try {
            // Validate OTP first
            const otpValidation = await api.post("/otp/validateOTP", {
                email: validatedEmail,
                otp: otp.trim(),
            });

            if (!otpValidation.data.Status) {
                toast.error("Invalid or expired OTP. Please try again.");
                return;
            }

            // Proceed with authentication after OTP validation
            const endpoint = isLogin ? "/auth/signin" : "/auth/signup";
            const authResponse = await api.post(endpoint, {
                ...formData,
                email: validatedEmail // Use the validated email
            });

            if (authResponse.data.success) {
                const user = authResponse.data.user;
                UserState.SetUserData(user);

                setCurrentUser({
                    username: user.username,
                    projectId: "",
                });

                toast.success(
                    isLogin 
                        ? "Signed in successfully!" 
                        : "Account created successfully!"
                );
                navigate("/dashboard");
            }
        } catch (error: any) {
            // Error handling is done by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (isOtpSent) {
            await handleOtpVerifyAndSubmit();
        } else {
            await handleOtpSend();
        }
    };

    const resetForm = () => {
        setFormData({
            email: "",
            password: "",
            username: "",
        });
        setOtp("");
        setIsOtpSent(false);
        setValidatedEmail("");
    };

    const handleModeSwitch = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-slate-200 opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-slate-200 opacity-30"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="mb-10 text-center">
                    <img src={logo} alt="Logo" className="w-full" />
                    <p className="text-lg font-light text-slate-500">
                        {isLogin
                            ? "Please sign in to your account"
                            : "Join thousands of professionals today"}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isOtpSent || isLoading}
                                    className="w-full rounded-lg border bg-slate-50 px-4 py-4 disabled:opacity-50"
                                    placeholder="Enter username"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isOtpSent || isLoading}
                                className="w-full rounded-lg border bg-slate-50 px-4 py-4 disabled:opacity-50"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isOtpSent || isLoading}
                                className="w-full rounded-lg border bg-slate-50 px-4 py-4 disabled:opacity-50"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {isOtpSent && (
                            <div>
                                <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full rounded-lg border bg-slate-50 px-4 py-4"
                                    placeholder="Enter the 4-digit OTP sent to your email"
                                    maxLength={4}
                                    disabled={isLoading}
                                />
                                <p className="mt-2 text-sm text-slate-600">
                                    OTP sent to: {validatedEmail}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-primary px-6 py-4 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    <span>
                                        {isOtpSent ? "Verifying OTP..." : "Sending OTP..."}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-lg">
                                    {isOtpSent
                                        ? isLogin
                                            ? "Verify & Sign In"
                                            : "Verify & Create Account"
                                        : isLogin
                                          ? "Login"
                                          : "Signup"}
                                </span>
                            )}
                        </button>

                        {isOtpSent && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isLoading}
                                className="w-full rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Back to Form
                            </button>
                        )}

                        <div className="pt-6 text-center">
                            <span className="text-slate-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </span>
                            <button
                                type="button"
                                onClick={handleModeSwitch}
                                disabled={isLoading}
                                className="ml-2 font-semibold text-slate-900 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isLogin ? "Create one now" : "Sign in instead"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-slate-500">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;