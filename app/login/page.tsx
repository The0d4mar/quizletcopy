"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginUser } from "@/lib/api/authApi";

const labels = {
  title: "\u0412\u0445\u043e\u0434",
  subtitle: "\u0412\u043e\u0439\u0434\u0438, \u0447\u0442\u043e\u0431\u044b \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0432\u043e\u0438 \u043a\u043e\u043b\u043e\u0434\u044b \u0438 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441.",
  password: "\u041f\u0430\u0440\u043e\u043b\u044c",
  login: "\u0412\u043e\u0439\u0442\u0438",
  loggingIn: "\u0412\u0445\u043e\u0434\u0438\u043c...",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0432\u043e\u0439\u0442\u0438",
  showPassword: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
  hidePassword: "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
};

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const url = await loginUser({ email, password, callbackUrl });
      router.push(url);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : labels.error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="mainSection authPage">
      <form onSubmit={handleSubmit} className="authCard">
        <div>
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>

        <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />

        <div className="passwordInputWrap">
          <input
            className="input passwordInput"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={labels.password}
            required
          />
          <button
            className="passwordVisibilityButton"
            type="button"
            aria-label={isPasswordVisible ? labels.hidePassword : labels.showPassword}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((value) => !value)}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="appError">{error}</p>}

        <button className="button" type="submit" disabled={isPending}>
          {isPending ? labels.loggingIn : labels.login}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;