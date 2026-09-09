"use client";

import { useState } from "react";
import { LogIn, LockKeyhole, User } from "lucide-react";

import { iniciarSesion } from "@/actions/auth";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setCargando(true);

    const resultado = await iniciarSesion(usuario, password);

    if (!resultado.success) {
      setError(resultado.error);
      setCargando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 px-4">

      {/* Decoración de fondo */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      {/* Tarjeta */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-7 shadow-2xl backdrop-blur sm:p-9">

        {/* Marca */}
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <span className="text-2xl font-extrabold text-white">
              LB
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            LAUNDRY
          </h1>

          <p className="mt-1 text-[11px] font-bold tracking-[0.35em] text-blue-600">
            BURBUJAS
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Usuario */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Usuario
            </label>

            <div className="relative">
              <User
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoComplete="username"
                placeholder="Tu usuario"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3.5
                  pl-11
                  pr-4
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3.5
                  pl-11
                  pr-4
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={cargando}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-3.5
              font-semibold
              text-white
              shadow-lg
              shadow-blue-600/25
              transition
              hover:bg-blue-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <LogIn size={19} />

            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

        {/* Pie */}
        <p className="mt-7 text-center text-xs text-slate-400">
          Sistema de administración
        </p>

      </div>
    </main>
  );
}