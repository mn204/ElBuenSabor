import { useState } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useSucursalUsuario } from "../../context/SucursalContext";

function SelectorSucursal({ tipoEnvio }: { tipoEnvio: string }) {
  const { sucursalActual, sucursales, cambiarSucursal } = useSucursalUsuario();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCambiarSucursal = (sucursalId: number) => {
      const sucursalSeleccionada = sucursales.find(s => s.id === sucursalId);
      if (sucursalSeleccionada) {
          cambiarSucursal(sucursalSeleccionada);
      }
      handleCloseModal()
  };

  if (tipoEnvio !== "TAKEAWAY") return null;

  return (
    <>
      <div className="d-flex flex-column mb-3 p-3 rounded border">
        <h5>Sucursal actual</h5>
        {sucursalActual ? (
          <>
            <p><strong>{sucursalActual.nombre}</strong></p>
            <p>
              {sucursalActual.domicilio?.calle} {sucursalActual.domicilio?.numero}{" "}
              ({sucursalActual.domicilio?.codigoPostal})<br />
              {sucursalActual.domicilio?.localidad?.nombre}
            </p>
            <p>Horario: {sucursalActual.horarioApertura} - {sucursalActual.horarioCierre}</p>
          </>
        ) : (
          <p>No hay sucursal seleccionada</p>
        )}
        <Button variant="dark" onClick={handleOpenModal} className="mt-2">
          Cambiar sucursal
        </Button>
      </div>

      {/* Modal de selección */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar sucursal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {sucursales.map(sucursal => (
              <ListGroup.Item key={sucursal.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{sucursal.nombre}</strong><br />
                  {sucursal.domicilio?.calle} {sucursal.domicilio?.numero}, {sucursal.domicilio?.localidad?.nombre}<br />
                  Horario: {sucursal.horarioApertura} - {sucursal.horarioCierre}
                </div>
                <Button variant="primary" size="sm" onClick={() => handleCambiarSucursal(sucursal.id!)}>
                  Seleccionar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SelectorSucursal;
