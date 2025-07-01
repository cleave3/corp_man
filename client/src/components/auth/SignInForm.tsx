import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { LoginUserRequest } from "../../api/types";
import { useLoginUser } from "../../hooks/useApiHooks";
import { ROUTES } from "../../utils";

export default function SignInForm() {
    const [data, setData] = useState<LoginUserRequest>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useLoginUser();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(data);
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Sign In</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email/phone and password to sign in!</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} autoComplete="on">
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email or Phone <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        placeholder="info@gmail.com or 081XXXXXXX"
                                        value={data.email}
                                        name="email"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            placeholder="Enter your password"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link
                                        to={ROUTES.FORGOT_PASSWORD}
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div>
                                    <Button disabled={isPending} className="w-full" size="sm">
                                        {isPending ? "Logging in..." : "Sign in"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
