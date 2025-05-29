// LoginUsuario.tsx
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase.ts"; // Asegurate de usar la ruta correcta
import { useState } from "react";
// TODO boton de ver la contraseña
interface Props {
    onRegisterClick: () => void;
}

const LoginUsuario = ({ onRegisterClick }: Props) => {
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log(JSON.stringify(user));
           // const token = await user.getIdToken();

            //verificamos el cliente en el backend
           // const res = await fetch(`http://localhost:8080/auth/cliente/uid/${user.uid}`, {
            //    headers: { Authorization: `Bearer ${token}` }
           // });

            if (false) {
             //   const cliente = await res.json();
               // console.log("Cliente ya existe:", cliente);
                localStorage.removeItem('requiresGoogleRegistration');
                // Redirigir al home o dashboard si querés
            } else if (true) {
                console.log("Cliente nuevo, redirigir a formulario");
                localStorage.setItem('requiresGoogleRegistration', 'true');
                window.location.href = "/";
                // App.tsx se encargará de mostrar el modal
            } else {
                throw new Error("Error al verificar el cliente");
            }

        } catch (err: any) {
            console.error("Error con Google login", err);
            setError("Error al iniciar sesión con Google");
        }
    };


    return (
        <form>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" />
            </div>

            <button type="submit" className="btn btn-dark w-100 mb-2">Iniciar Sesión</button>

            <button
                type="button"
                className="btn btn-outline-dark w-100 mb-2"
                onClick={handleGoogleLogin}
            >
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    width="20"
                    className="me-2"
                />
                Ingresa con Google
            </button>

            {error && <div className="text-danger text-center mt-2">{error}</div>}

            <div className="text-center mt-2">
                <a href="#" className="text-primary small">¿Olvidaste tu contraseña?</a>
            </div>

            <hr />

            <div className="text-center mt-3">
                <span>¿No tenés cuenta?</span><br />
                <button type="button" onClick={onRegisterClick} className="btn btn-link">
                    Registrate
                </button>
            </div>
        </form>
    );
};

export default LoginUsuario;
