import { useState, FormEvent } from "react"
import { toast } from "react-hot-toast"
import logo from "@/assets/logo.svg"
import api from "@/api/serverapi"
import UserState from "@/utils/UserState"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "@/context/AppContext"

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const {setCurrentUser} = useAppContext()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
    })

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const { email, password, username } = formData

        if (!email || !password || (!isLogin && !username)) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsLoading(true)

        try {
            const endpoint = isLogin ? "/auth/signin" : "/auth/signup"
            const res = await api.post(endpoint, formData)

            const user = res.data.user
            UserState.SetUserData(user)
            setCurrentUser({
                username,
                projectId:""
            })


            toast.success(
                isLogin
                    ? "Signed in successfully!"
                    : "Account created successfully!",
            )
            navigate("/")
        } catch {
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-slate-200 opacity-30"></div>
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-slate-200 opacity-30"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-md">
                {/* Logo/Brand Area */}
                <div className="mb-10 text-center">
                    <img src={logo} alt="Logo" className="w-full" />

                    <p className="text-lg font-light text-slate-500">
                        {isLogin
                            ? "Please sign in to your account"
                            : "Join thousands of professionals today"}
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                    {/* Form */}
                    <div className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-slate-900"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-slate-900"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-slate-900"
                                placeholder="Enter your password"
                            />
                        </div>

                       

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full transform rounded-lg  bg-primary px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    <span>
                                        {isLogin
                                            ? "Signing you in..."
                                            : "Creating account..."}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-lg">
                                    {isLogin ? "Sign In" : "Create Account"}
                                </span>
                            )}
                        </button>

                        {/* Toggle Auth Mode */}
                        <div className="pt-6 text-center">
                            <span className="text-slate-600">
                                {isLogin
                                    ? "Don't have an account?"
                                    : "Already have an account?"}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-semibold text-slate-900 transition-colors duration-200 hover:text-slate-600"
                            >
                                {isLogin ? "Create one now" : "Sign in instead"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-slate-500">
                        By continuing, you agree to our Terms of Service and
                        Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthPage
