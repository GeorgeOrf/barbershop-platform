"use client"

import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation";

export default function Login() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        setMessage("");

        const {error} = await authClient.signIn.email({
            email, password
        });

        setPending(false);

        if(error){
            setMessage(error.message || "Login failed");
            return;
        }

        setMessage("Login Successful");
        router.push("/admin");
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" disabled={pending}>
                {pending ? "Logging in..." : "Login"}
            </button>
            {message && <p>{message}</p>}
        </form>
        </>
    )
}

