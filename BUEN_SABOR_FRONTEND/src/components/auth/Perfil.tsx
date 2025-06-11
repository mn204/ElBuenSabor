import "../../styles/perfil.css";
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import { useAuth } from "../../context/AuthContext";
import { sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential  } from 'firebase/auth';
import {auth} from "./firebase.ts";
import {
    actualizarDatosUsuario, actualizarEmailEnUsuario,
    actualizarEmailPorFirebaseUid,
    obtenerUsuarioPorEmail
} from "../../services/UsuarioService.ts";
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {useState} from "react";
import FormDatosCliente from "../clientes/FormDatosCliente.tsx";
import FormDatosEmpleado from "../empleados/FormDatosEmpleado.tsx";

function Perfil() {

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showImagenModal, setShowImagenModal] = useState(false);
    const [showFormDatos, setShowFormDatos] = useState(false);

    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

    const handleAbrirModalImagen = () => setShowImagenModal(true);
    const handleCerrarModalImagen = () => setShowImagenModal(false);

    const handleAbrirModalEmail = () => setShowEmailModal(true);
    const handleCerrarModalEmail = () => setShowEmailModal(false);



    const [newEmail1, setNewEmail1] = useState('');
    const [newEmail2, setNewEmail2] = useState('');

    const [email1Error, setEmail1Error] = useState('');
    const [email2Error, setEmail2Error] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')

    // Agregar setCliente y setEmpleado del contexto
    const { cliente, empleado, usuario, user, logout, setCliente, setEmpleado } = useAuth();

    const esEmpleado = !!empleado;
    const esCliente = !!cliente;

    const nombre = esEmpleado ? empleado?.nombre : cliente?.nombre;
    const apellido = esEmpleado ? empleado?.apellido : cliente?.apellido;
    const telefono = esEmpleado ? empleado?.telefono : cliente?.telefono;
    const fechaNacimiento = esEmpleado ? empleado?.fechaNacimiento : cliente?.fechaNacimiento;
    // @ts-ignore
    const fechaFormateada = fechaNacimiento?.split('-').reverse().join('/');
    const dni = usuario?.dni;
    const email = usuario?.email;
    const rol = usuario?.rol;
    const providerId = usuario?.providerId;

    const domicilio = esEmpleado ? empleado?.domicilio : null
    const esEmailValido = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    const handleNewEmail1Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewEmail1(value);
        setEmail1Error('');

        if (!esEmailValido(value)) {
            setEmail1Error('Ingresá un email válido');
            return;
        }

        if (value === usuario?.email) {
            setEmail1Error('Este ya es tu email actual');
            return;
        }

        try {
            const usuarioExistente = await obtenerUsuarioPorEmail(value);
            if (usuarioExistente) {
                setEmail1Error('El email ya está en uso');
            }
        } catch (err) {
            console.error("Error verificando email:", err);
        }
    };
    const handleNewEmail2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewEmail2(value);
        setEmail2Error('');

        if (newEmail1 && value !== newEmail1) {
            setEmail2Error('Los emails no coinciden');
        }
    };
    const handleEmailChange = async () => {
        setError('');
        setSuccess('');

        // Validaciones básicas
        if (!newEmail1 || !newEmail2) {
            setError('Completá ambos campos de email.');
            return;
        }

        if (!esEmailValido(newEmail1)) {
            setEmail1Error('Ingresá un email válido');
            return;
        }

        if (newEmail1 !== newEmail2) {
            setEmail2Error('Los emails no coinciden');
            return;
        }

        if (email1Error || email2Error) {
            setError('Revisá los campos con error.');
            return;
        }

        const user = auth.currentUser;

        if (user && password && usuario) {
            try {
                const email = user.email ?? '';
                const credential = EmailAuthProvider.credential(email, password);

                // Reautenticación en Firebase
                await reauthenticateWithCredential(user, credential);

                // Actualizar email en backend (Firebase UID)
                const ok1 = await actualizarEmailPorFirebaseUid(usuario.firebaseUid, newEmail1);
                if (!ok1) {
                    setError("No se pudo actualizar el email en Firebase.");
                    return;
                }

                // Actualizar email en entidad Usuario (por ID)
                const usuarioActualizado = await actualizarEmailEnUsuario(usuario, newEmail1);
                if (!usuarioActualizado) {
                    setError("No se pudo actualizar el email en la base de datos.");
                    return;
                }

                setSuccess("Email actualizado correctamente.");
                window.location.reload();
            } catch (err: any) {
                console.error('Error en reautenticación:', err);
                setError(err.message || 'Error al reautenticar.');
            }
        }
    };
    const handleCambiarContrasena = async () => {
        if (window.confirm('¿Deseas cambiar tu contraseña? Se enviará un mail para continuar el proceso.')) {
            if (usuario?.email) {
                try {
                    await sendPasswordResetEmail(auth, usuario.email);
                    alert('Se ha enviado un correo para restablecer tu contraseña.');
                } catch (error: any) {
                    alert('Error al enviar el correo: ' + error.message);
                }
            }
        }
    }
    const handleCerrarSesion = async () => {
        if (window.confirm("¿Seguro que quieres cerrar sesión?")){
            await logout();
            window.location.href = '/'; // Redirige al home después del logout
        }
    };
    const handleSubirImagen = async () => {
        if (!nuevaImagen || !usuario) return;

        const data = new FormData();
        data.append("file", nuevaImagen);
        data.append("upload_preset", "buen_sabor");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dvyjtb1ns/image/upload", {
                method: "POST",
                body: data,
            });

            const file = await res.json();
            const nuevaUrl = file.secure_url;

            // Actualizar el usuario
            const usuarioActualizado = { ...usuario, photoUrl: nuevaUrl };
            await actualizarDatosUsuario(usuario.id, usuarioActualizado);

            // Actualizá el contexto o recargá la página si es necesario
            window.location.reload();
        } catch (error) {
            console.error("Error al subir imagen:", error);
        }
    };


    return (
        <div>
            <Container className="perfil text-center">
                <h2 className="perfilTitle">Mi Perfil</h2>

                <Row className="perfilContainer justify-content-center align-items-center">
                    {/* DATOS */}
                    <Col xs={12} md={6} className="text-md-start text-center">
                        <div className="perfilInfo">
                            <p className="perfilInfoText">Nombre: {nombre} {apellido}</p>
                            <p className="perfilInfoText">DNI: {dni}</p>
                            <p className="perfilInfoText">Fecha de nacimiento: {fechaFormateada}</p>
                            {esEmpleado && <p className="perfilInfoText">Rol: {rol}</p>}
                            {esEmpleado && <p className="perfilInfoText">Sucursal: {empleado?.sucursal?.nombre}</p>}
                            <p className="perfilInfoText">Email: {email}</p>
                            <p className="perfilInfoText">Teléfono: {telefono}</p>
                            {esEmpleado && domicilio && (
                                <p className="perfilInfoText">
                                    Domicilio: {domicilio.calle} {domicilio.numero}, {domicilio.localidad.nombre}, {domicilio.localidad.provincia.nombre}, {domicilio.localidad.provincia.pais.nombre}
                                </p>
                            )}
                        </div>
                    </Col>

                    {/* IMAGEN */}
                    <Col xs={12} md="auto" className="text-center mt-4 mt-md-0">
                        <div className="perfilImagenContainer position-relative mx-auto">
                            <img
                                src={user?.photoURL || usuario?.photoUrl || IconoEmpresa}
                                alt="Imagen de perfil"
                                className="perfilImagen rounded-circle"
                            />
                            {esCliente && providerId === "password" && (
                                <i
                                    className="bi bi-pencil-fill position-absolute bottom-0 end-0 bg-white rounded-circle p-1"
                                    role="button"
                                    onClick={handleAbrirModalImagen}
                                    style={{ cursor: "pointer" }}
                                ></i>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* BOTONES */}
                <div className="buttons d-flex flex-column justify-content-center align-items-center">
                    {/* Mostrar botón para cualquier usuario autenticado */}
                    <button className="perfilButton" onClick={() => setShowFormDatos(true)}>Cambiar datos personales</button>
                    {esCliente && providerId === 'password' && (
                        <button className="perfilButton" onClick={handleAbrirModalEmail}>Cambiar el Mail</button>
                    )}
                    {((esCliente && providerId === 'password') || esEmpleado) && (
                        <button className="perfilButton" onClick={handleCambiarContrasena}>Cambiar Contraseña</button>
                    )}
                    <button className="perfilButton" onClick={handleCerrarSesion}>Cerrar Sesión</button>
                </div>
            </Container>

            {/* Modal FormDatosCliente - Solo para clientes */}
            {esCliente && cliente && (
                <FormDatosCliente
                    show={showFormDatos}
                    onHide={() => setShowFormDatos(false)}
                    cliente={cliente}
                    onClienteActualizado={(clienteActualizado) => {
                        setCliente(clienteActualizado);
                        setShowFormDatos(false);
                        window.location.reload();
                    }}
                />
            )}

            {/* Modal FormDatosEmpleado - Solo para empleados */}
            {esEmpleado && empleado && (
                <FormDatosEmpleado
                    show={showFormDatos}
                    onHide={() => setShowFormDatos(false)}
                    empleado={empleado}
                    onEmpleadoActualizado={(empleadoActualizado) => {
                        setEmpleado(empleadoActualizado);
                        setShowFormDatos(false);
                        window.location.reload();
                    }}
                />
            )}

            {/* modal email */ }
            <Modal show={showEmailModal} onHide={handleCerrarModalEmail} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cambiar Email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Cambiar el mail te pedira que vuelvas a loguearte a la pagina.</p>

                    <Form>
                        <Form.Group>
                            <Form.Label>Nuevo Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail1}
                                onChange={handleNewEmail1Change}
                                placeholder="Ingresá tu nuevo email"
                                isInvalid={!!email1Error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {email1Error}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Repetir Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={newEmail2}
                                onChange={handleNewEmail2Change}
                                placeholder="Repetí tu nuevo email"
                                isInvalid={!!email2Error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {email2Error}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>Contraseña actual</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresá tu contraseña"
                            />
                        </Form.Group>
                        {error && <p className="text-danger mt-2">{error}</p>}
                        {success && <p className="text-success mt-2">{success}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModalEmail}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleEmailChange}>
                        Cambiar Email
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* modal imagen */}
            <Modal show={showImagenModal} onHide={handleCerrarModalImagen}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar imagen de perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNuevaImagen(e.target.files?.[0] || null)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModalImagen}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubirImagen}>
                        Subir Imagen
                    </Button>
                </Modal.Footer>
            </Modal>

            </div>
    );
}

export default Perfil;