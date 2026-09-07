"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { authClient } from "../../lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (isSignUp) {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? "ユーザー登録に失敗しました");
        return;
      }
    } else {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message ?? "ログインに失敗しました");
        return;
      }
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">{isSignUp ? "ユーザー登録" : "ログイン"}</h1>

        {isSignUp && (
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border p-2"
            required
          />
        )}

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded border p-2"
          required
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded border p-2"
          minLength={8}
          required
        />

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          {isSignUp ? "登録" : "ログイン"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage("");
          }}
          className="text-sm underline"
        >
          {isSignUp ? "すでにアカウントをお持ちの方" : "アカウントを新規作成"}
        </button>
      </form>
    </main>
  );
}
