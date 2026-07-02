"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loginUser, registerUser } from "@/lib/api/authApi";

const labels = {
  title: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f",
  subtitle: "\u0421\u043e\u0437\u0434\u0430\u0439 \u0430\u043a\u043a\u0430\u0443\u043d\u0442 \u0434\u043b\u044f \u043b\u0438\u0447\u043d\u044b\u0445 \u043a\u043e\u043b\u043e\u0434, \u043f\u0430\u043f\u043e\u043a \u0438 \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441\u0430.",
  name: "\u0418\u043c\u044f",
  password: "\u041f\u0430\u0440\u043e\u043b\u044c \u043e\u0442 8 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
  create: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442",
  creating: "\u0421\u043e\u0437\u0434\u0430\u0451\u043c...",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f",
  showPassword: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
  hidePassword: "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u0430\u0440\u043e\u043b\u044c",
};

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
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
      await registerUser({ name: name || undefined, email, password });
      await loginUser({ email, password, callbackUrl: "/profile" });
      router.push("/profile");
      router.refresh();
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : labels.error);
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

        <input className="input" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder={labels.name} />
        <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />

        <div className="passwordInputWrap">
          <input
            className="input passwordInput"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={labels.password}
            minLength={8}
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
          {isPending ? labels.creating : labels.create}
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;