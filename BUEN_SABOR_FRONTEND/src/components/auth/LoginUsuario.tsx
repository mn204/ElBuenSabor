// LoginUsuario.tsx
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider } from "./firebase.ts"; // Asegurate de usar la ruta correcta
import { useState } from "react";
import {Form, Button, InputGroup} from "react-bootstrap";
import {Eye, EyeSlash} from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext.tsx";

// TODO boton de ver la contraseña
interface Props {
    onRegisterClick: () => void;
    onClose?: () => void;
}

const LoginUsuario = ({ onRegisterClick , onClose}: Props) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const { login } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 1) return;

        if (!email || !password) {
            setError("Por favor completá todos los campos.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            setMessage("¡Inicio de sesión exitoso!");
            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);
        } catch (err: any) {
            console.error("Error en login:", err);
            setError("Credenciales incorrectas. Verificá tu email y contraseña.");
        } finally {
            setLoading(false);
        }
    };

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
    const handlePasswordReset = async () => {
        if (!email || !confirmEmail) {
            setError("Por favor completá ambos campos.");
            return;
        }

        if (email !== confirmEmail) {
            setError("Los emails no coinciden.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Te enviamos un correo para restablecer tu contraseña.");
            setError(null);
        } catch (error) {
            setError("No se pudo enviar el correo. Verificá que el email esté registrado.");
            setMessage(null);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {step === 1 && (
                <>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                disabled={loading}
                            >
                                {showPassword ? <EyeSlash /> : <Eye />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <Button
                        type="submit"
                        variant="dark"
                        className="w-100 mb-2"
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>


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
            {message && <div className="text-success text-center mt-2">{message}</div>}
                    <div className="text-center mt-2">
                        <Button variant="link" size="sm" onClick={() => setStep(2)}>
                            ¿Olvidaste tu contraseña?
                        </Button>
                    </div>

                    <hr />

                    <div className="text-center mt-3">
                        <span>¿No tenés cuenta?</span><br />
                        <Button variant="link" onClick={onRegisterClick}>
                            Registrate
                        </Button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h5 className="text-center mb-3">Recuperar Contraseña</h5>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="dark" onClick={handlePasswordReset}>
                            Enviar correo de recuperación
                        </Button>
                        <Button variant="secondary" onClick={() => setStep(1)}>
                            ← Volver al login
                        </Button>
                    </div>

                    {error && <div className="text-danger text-center mt-2">{error}</div>}
                    {message && <div className="text-success text-center mt-2">{message}</div>}
                </>
            )}
        </Form>
    );
};

export default LoginUsuario;
