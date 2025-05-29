import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import type Cliente from "../../models/Cliente.ts"; // Ajustá según tu estructura

//TODO implementar Validaciones de los campos.
//TODO agregar boton a campos contraseña para ver.
interface Props {
    onBackToLogin: () => void;
}
// === Datos hardcodeados ===
const paises = [
    { nombre: "Argentina", id: 1 }
];

const provincias = [
    { nombre: "Buenos Aires" },
    { nombre: "Catamarca" },
    { nombre: "Chaco" },
    { nombre: "Chubut" },
    { nombre: "Córdoba" },
    { nombre: "Corrientes" },
    { nombre: "Entre Ríos" },
    { nombre: "Formosa" },
    { nombre: "Jujuy" },
    { nombre: "La Pampa" },
    { nombre: "La Rioja" },
    { nombre: "Mendoza" },
    { nombre: "Misiones" },
    { nombre: "Neuquén" },
    { nombre: "Río Negro" },
    { nombre: "Salta" },
    { nombre: "San Juan" },
    { nombre: "San Luis" },
    { nombre: "Santa Cruz" },
    { nombre: "Santa Fe" },
    { nombre: "Santiago del Estero" },
    { nombre: "Tierra del Fuego" },
    { nombre: "Tucumán" },
    { nombre: "CABA" }
];

const localidadesPorProvincia: { [provincia: string]: string[] } = {
    "Mendoza": [
        "Mendoza",
        "Godoy Cruz",
        "Guaymallén",
        "Maipú",
        "Las Heras",
        "Luján de Cuyo",
        "San Rafael",
        "General Alvear",
        "Malargüe",
        "Rivadavia",
        "San Martín",
        "Tunuyán",
        "Tupungato",
        "San Carlos",
        "Lavalle",
        "Santa Rosa",
        "La Paz"
    ],
    // Puedes agregar localidades hardcodeadas para otras provincias si es necesario...
};


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
    const [localidades, setLocalidades] = useState<string[]>([]);
    const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prov = e.target.value;
        setProvincia(prov);
        setLocalidad(""); // reset
        setLocalidades(localidadesPorProvincia[prov] || []);
    };

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

            console.log("Usuario registrado en firebases con éxito:");

            console.log(JSON.stringify(userCredential.user, null, 2));

            const cliente: Cliente = {
                nombre: nombre,
                apellido: apellido,
                telefono: telefono,
                email: email,
                dni: parseInt(dni),
                fechaNacimiento: new Date(fechaNacimiento),
                eliminado: false,
                domicilios: [
                    {
                        calle: calle,
                        numero: parseInt(numero),
                        codigoPostal: codigoPostal,
                        piso: piso,
                        departamento: departamento,
                        detalles: detalles,
                        eliminado: false,
                        localidad: {
                            nombre: localidad,
                            eliminado: false,
                            provincia: {
                                nombre: provincia,
                                eliminado: false,
                                pais: {
                                    nombre: pais,
                                    eliminado: false
                                }
                            }
                        }
                    }
                ],
                usuarioCliente: {
                    email: email,
                    firebaseUid: userCredential.user.uid,
                    eliminado: false
                },
                pedidos: [] // si tu clase no lo requiere aún, podés omitir este campo
            };
            console.log("Cliente a enviar:", JSON.stringify(cliente, null, 2));

            // Enviar a backend
            /*
            const response = await fetch("http://localhost:8080/auth/cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await userCredential.user.getIdToken()}`
                },
                body: JSON.stringify(cliente)
            });

            if (!response.ok) {
                // Si falla el backend, eliminar el usuario de Firebase
                await userCredential.user.delete();
                throw new Error("Error al registrar cliente en el backend. Usuario Firebase eliminado.");
              }

            if (!response.ok) throw new Error("Error al registrar cliente en el backend");

            */

            alert("Registro exitoso!");
            onBackToLogin(); // Vuelve al login
        } catch (error: any) {
            console.error("Error al registrar:", error);

            // Eliminar usuario si ya fue creado pero el backend no estaba corriendo
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    await currentUser.delete();
                    console.log("Usuario Firebase eliminado por error en el proceso.");
                } catch (deleteError) {
                    console.error("Error al eliminar usuario de Firebase:", deleteError);
                }
            }

            alert(error.message || "Error desconocido durante el registro.");
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
                                type="number"
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
                                value={pais}
                                onChange={e => setPais(e.target.value)}
                            >
                                <option value="">Seleccioná un país...</option>
                                {paises.map((p) => (
                                    <option key={p.id} value={p.nombre}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        <Form.Group controlId="provincia" className="mb-2">
                            <Form.Select
                                value={provincia}
                                onChange={handleProvinciaChange}
                            >
                                <option value="">Seleccioná una provincia...</option>
                                {provincias.map((prov, idx) => (
                                    <option key={idx} value={prov.nombre}>{prov.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="localidad" className="mb-2">
                            <Form.Select
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                                disabled={!localidades.length}
                            >
                                <option value="">Seleccioná una localidad...</option>
                                {localidades.map((loc, idx) => (
                                    <option key={idx} value={loc}>{loc}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>



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
                                placeholder="Detalles Direccion"
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
