import { useState } from "react";
import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useForgotPassword } from "../../hooks/useApiHooks";
import { ROUTES } from "../../utils";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState<string>("");

    const { mutate, isPending } = useForgotPassword();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ email });
    };

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enter a valid email to proceed</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} autoComplete="on">
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        placeholder="Enter your email"
                                        value={email}
                                        type="email"
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-end">
                                    <Link to={ROUTES.SIGNIN} className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                                        Back to Login
                                    </Link>
                                </div>
                                <div>
                                    <Button disabled={isPending} className="w-full" size="sm">
                                        {isPending ? "Submitting..." : "Reset Password"}
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
