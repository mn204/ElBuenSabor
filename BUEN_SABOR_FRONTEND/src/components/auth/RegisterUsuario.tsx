import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase"; // Ajustá según tu estructura


interface Props {
    onBackToLogin: () => void;
}

const RegisterUsuario = ({ onBackToLogin }: Props) => {
    const [step, setStep] = useState(1);

    // Primer paso
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    // Segundo paso
    const [dni, setDni] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pais, setPais] = useState("");
    const [provincia, setProvincia] = useState("");
    const [localidad, setLocalidad] = useState("");

    const [codigoPostal, setCodigoPostal] = useState("");
    const [calle, setCalle] = useState("");
    const [numero, setNumero] = useState("");
    const [piso, setPiso] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [detalles, setDetalles] = useState("");

    const handleRegister = async () => {
        if (contrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, contrasena);

            // Opcional: actualizar el nombre de usuario en Firebase
            await updateProfile(userCredential.user, {
                displayName: `${nombre} ${apellido}`
            });

            console.log("Usuario registrado con éxito:", userCredential.user);

            // Luego podés enviar los datos extra a tu backend si querés guardarlos
            // como usuario real en la base de datos

            alert("Registro exitoso!");
            onBackToLogin(); // Vuelve al login
        } catch (error: any) {
            console.error("Error al registrar:", error);
            alert(error.message);
        }
    };


    return (
        <div className="p-4">
            <h3 className="text-center fw-bold">Registrate !!!</h3>
            <hr style={{ width: "150px", borderTop: "3px solid orange", margin: "0 auto 20px" }} />

            <Form>
                {step === 1 && (
                    <>
                        <Form.Group controlId="nombre" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="apellido" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="contrasena" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="confirmarContrasena" className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Confirmar Contraseña"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2 mb-2">
                            <Button variant="dark" onClick={() => setStep(2)}>
                                Siguiente →
                            </Button>
                            <Button variant="dark" onClick={onBackToLogin}>
                                Salir
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Form.Group controlId="dni" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="DNI"
                                value={dni}
                                onChange={(e) => setDni(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="fechaNacimiento" className="mb-2">
                            <Form.Control
                                type="date"
                                value={fechaNacimiento}
                                onChange={(e) => setFechaNacimiento(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="telefono" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Teléfono"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="pais" className="mb-2">
                            <Form.Select
                                aria-label="Seleccione País"
                                value={pais}
                                onChange={(e) => setPais(e.target.value)}
                            >
                                <option value="">Seleccione País</option>
                                {/* {paises.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))} */}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex gap-2 mb-2">
                            <Form.Select
                                aria-label="Seleccione Provincia"
                                value={provincia}
                                onChange={(e) => setProvincia(e.target.value)}
                            >
                                <option value="">Provincia</option>
                                {/* {provincias.map(pv => (
                                    <option key={pv.id} value={pv.id}>{pv.nombre}</option>
                                ))} */}
                            </Form.Select>
                            <Form.Select
                                aria-label="Seleccione Localidad"
                                value={localidad}
                                onChange={(e) => setLocalidad(e.target.value)}
                            >
                                <option value="">Localidad</option>
                                {/* {localidades.map(l => (
                                    <option key={l.id} value={l.id}>{l.nombre}</option>
                                ))} */}
                            </Form.Select>
                        </div>


                        <Form.Group controlId="codigoPostal" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Código Postal"
                                value={codigoPostal}
                                onChange={(e) => setCodigoPostal(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="calle" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Calle"
                                value={calle}
                                onChange={(e) => setCalle(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2 mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Número"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Piso Departamento"
                                value={piso}
                                onChange={(e) => setPiso(e.target.value)}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Número Departamento"
                                value={departamento}
                                onChange={(e) => setDepartamento(e.target.value)}
                            />
                        </div>

                        <Form.Group controlId="detalles" className="mb-2">
                            <Form.Control
                                type="text"
                                placeholder="Detalles"
                                value={detalles}
                                onChange={(e) => setDetalles(e.target.value)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="dark" onClick={() => setStep(1)}>
                                ← Atrás
                            </Button>
                            <Button variant="dark" onClick={handleRegister}>
                                Registrarse
                            </Button>

                        </div>
                    </>
                )}
            </Form>

            <div className="text-center mt-3">
                <button onClick={onBackToLogin} className="btn btn-link">
                    ¿Ya tenés cuenta? Iniciar sesión
                </button>
            </div>
        </div>
    );
};

export default RegisterUsuario;
