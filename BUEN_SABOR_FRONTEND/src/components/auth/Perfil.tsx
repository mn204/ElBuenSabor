import "../../styles/perfil.css";
import IconoEmpresa from '../../assets/IconoEmpresa.jpg';
import { useAuth } from "../../context/AuthContext";
import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "./firebase.ts";
import { actualizarDatosUsuario } from "../../services/UsuarioService.ts";
import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
//TODO impleamentar cambio de datos personales segun corresponda
//TODO implementar cambio de mail en usuarios password
//TODO implementar el apartado de domicilios de los clientes


function Perfil() {

    const [showModal, setShowModal] = useState(false);
    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

    const handleAbrirModal = () => setShowModal(true);
    const handleCerrarModal = () => setShowModal(false);

    const { cliente, empleado, usuario, user, logout } = useAuth();

    const esEmpleado = !!empleado;
    const esCliente = !!cliente;

    const nombre = esEmpleado ? empleado?.nombre : cliente?.nombre;
    const apellido = esEmpleado ? empleado?.apellido : cliente?.apellido;
    const telefono = esEmpleado ? empleado?.telefono : cliente?.telefono;
    const fechaNacimiento = esEmpleado ? empleado?.fechaNacimiento : cliente?.fechaNacimiento;
    const dni = usuario?.dni;
    const email = usuario?.email;
    const rol = usuario?.rol;
    const providerId = usuario?.providerId;

    const domicilio = esEmpleado ? empleado?.domicilio : null




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
        <div className="perfil d-flex flex-column justify-content-center align-items-center">
            <h2 className="perfilTitle d-flex align-items-center flex-column">Mi Perfil</h2>
            <div className="perfilContainer d-flex">
                <div className="perfilInfo text-start">
                    <p className="perfilInfoText">Nombre: {nombre} {apellido}</p>
                    <p className="perfilInfoText">DNI: {dni}</p>
                    <p className="perfilInfoText">Fecha de nacimiento: {new Date(fechaNacimiento).toLocaleDateString()}</p>
                    {esEmpleado && <p className="perfilInfoText">Rol: {rol}</p>}
                    <p className="perfilInfoText">Email: {email}</p>
                    <p className="perfilInfoText">Teléfono: {telefono}</p>
                    {esEmpleado && domicilio && (
                        <p className="perfilInfoText">
                            Domicilio: {domicilio.calle} {domicilio.numero}, {domicilio.localidad.nombre}, {domicilio.localidad.provincia.nombre}, {domicilio.localidad.provincia.pais.nombre}
                        </p>
                    )}
                </div>
                <div className="position-relative">
                    <img
                        src={user?.photoURL || usuario?.photoUrl || IconoEmpresa}
                        alt="Imagen de perfil"
                        className="perfilImagen w-auto rounded-circle"
                    />
                    {esCliente && providerId === "password" && (
                        <i
                            className="bi bi-pencil-fill position-absolute bottom-0 end-0 bg-white rounded-circle p-1"
                            role="button"
                            onClick={handleAbrirModal}
                            style={{ cursor: "pointer" }}
                        ></i>
                    )}
                </div>
            </div>

            <div className="buttons d-flex flex-column justify-content-center align-items-center">
                <button className="perfilButton">Cambiar datos personales</button>

                {/* Mostrar botón de Cambiar Email solo si:
                    - Cliente con providerId 'password'
                */}
                {esCliente && providerId === 'password' && (
                    <button className="perfilButton">Cambiar Email</button>
                )}

                {/* Mostrar botón de Cambiar Contraseña si:
                    - Cliente con providerId 'password'
                    - Empleado (siempre tiene 'password')
                */}
                {((esCliente && providerId === 'password') || esEmpleado) && (
                    <button className="perfilButton" onClick={handleCambiarContrasena}>Cambiar Contraseña</button>
                )}

                <button className="perfilButton" onClick={handleCerrarSesion}>Cerrar Sesión</button>
                <Modal show={showModal} onHide={handleCerrarModal}>
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
                        <Button variant="secondary" onClick={handleCerrarModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubirImagen}>
                            Subir Imagen
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>


        </div>
    );
}

export default Perfil;
