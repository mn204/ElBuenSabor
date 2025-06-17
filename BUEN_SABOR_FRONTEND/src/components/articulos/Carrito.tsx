import { useEffect, useState } from "react";
import { useCarrito } from "../../hooks/useCarrito";
import { useAuth } from "../../context/AuthContext";
import TipoEnvio from "../../models/enums/TipoEnvio";
import FormaPago from "../../models/enums/FormaPago";
import type Domicilio from "../../models/Domicilio";
import CheckoutMP from "./CheckoutMP";
import type Pedido from "../../models/Pedido";
import { Wallet } from "@mercadopago/sdk-react";
import { useSucursalUsuario } from "../../context/SucursalContext";
import PedidoService from "../../services/PedidoService";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import ModalDomicilio from "../clientes/ModalDomicilio";

export function Carrito() {
  const { cliente, setCliente } = useAuth();
  const carritoCtx = useCarrito();
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoEnvio, setTipoEnvio] = useState<'DELIVERY' | 'TAKEAWAY' | null>(null);
  const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio | null>();
  const [formaPago, setFormaPago] = useState<'EFECTIVO' | 'MERCADOPAGO' | null>(null);
  const [showDomicilioModal, setShowDomicilioModal] = useState(false);
  const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [verificandoStock, setVerificandoStock] = useState(false);
  const { sucursalActualUsuario } = useSucursalUsuario();
  const [modalVisible, setModalVisible] = useState(false);

  if (!carritoCtx) return null;
  const handleModalSubmit = (clienteActualizado: any) => {
    setCliente(clienteActualizado);
  };
  useEffect(() => {
    if (formaPago == 'EFECTIVO') {
      pedido.formaPago = FormaPago.EFECTIVO
    } else {
      pedido.formaPago = FormaPago.MERCADO_PAGO;
    }
  }, [formaPago]);

  useEffect(() => {
    pedido.sucursal = sucursalActualUsuario!;
  }, [sucursalActualUsuario]);

  useEffect(() => {
    pedido.cliente = cliente!;
  }, [cliente]);

  useEffect(() => {
    fetch("/localidades.json").then((res) => res.json()).then((localidades) => localidades.map((loc: any) => {
      if (loc.nombre == domicilioSeleccionado?.localidad?.nombre && tipoEnvio != 'TAKEAWAY') {
        if (domicilioSeleccionado) {
          pedido.domicilio = domicilioSeleccionado;
        }
      }
    }))
  }, [domicilioSeleccionado]);

  const {
    pedido,
    preferenceId,
    restarDelCarrito,
    agregarAlCarrito,
    quitarPromocionCompleta,
    quitarDelCarrito,
    limpiarCarrito,
    guardarPedidoYObtener,
    agregarPromocionAlCarrito,
  } = carritoCtx;
  const handleAgregar = () => {
    setDomicilioSeleccionado(null);
    setModalVisible(true);
  };
  const carrito = pedido.detalles;

  const verificarStock = async () => {
    setVerificandoStock(true);
    setStockError(null);

    try {
      const stockDisponible = await PedidoService.consultarStock(pedido)
      if (!stockDisponible) {
        setStockError("No hay stock suficiente para algunos productos en la sucursal seleccionada.");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verificando stock:', error);
      setStockError("Error al verificar el stock. Intenta nuevamente.");
      return false;
    } finally {
      setVerificandoStock(false);
    }
  };

  const handleProceedToStep2 = async () => {
    if (!cliente) {
      setStockError("Debe Iniciar Secion para continuar")
    } else {
      const stockOk = await verificarStock();
      if (stockOk) {
        setCurrentStep(2);
        setTipoEnvio(null);
        setFormaPago(null);
      }
    }
  };

  const handleTipoEnvioChange = (tipo: 'DELIVERY' | 'TAKEAWAY') => {
    setTipoEnvio(tipo);
    if (tipo === 'DELIVERY') {
      setShowDomicilioModal(true);
      pedido.tipoEnvio = TipoEnvio.DELIVERY;
    } else {
      pedido.tipoEnvio = TipoEnvio.TAKEAWAY;
      setDomicilioSeleccionado(undefined)
    }
  };

  const handleDomicilioSelect = (domicilio: Domicilio) => {
    setDomicilioSeleccionado(domicilio);
    setShowDomicilioModal(false);
  };

  const guardarPedidoTakeAway = async () => {
    // Verificar stock nuevamente antes de confirmar
    const stockOk = await verificarStock();
    if (!stockOk) {
      return;
    }
    const pedidoFinal = await guardarPedidoYObtener();
    if(pedidoFinal){
      limpiarCarrito()
    }
    window.location.href = `/pedidoConfirmado/${pedidoFinal!.id}`;
  }

  const handlePagarConMP = async () => {
    // Verificar stock nuevamente antes de confirmar
    const stockOk = await verificarStock();
    if (!stockOk) {
      return;
    }
    const pedidoFinal = await guardarPedidoYObtener();
    if (pedidoFinal) {
      limpiarCarrito()
      setPedidoGuardado(pedidoFinal);
    }
  };
  // Opción 2: Limpiar preferenceId al agregar productos al carrito
  useEffect(() => {
    if (carrito.length > 0 && preferenceId) {
      // Si hay productos en el carrito y existe un preferenceId de un pedido anterior, limpiarlo
      carritoCtx.limpiarPreferenceId();
      setPedidoGuardado(null);
    }
  }, [carrito.length]);

  // Opción 3: Limpiar preferenceId al cambiar de step
  useEffect(() => {
    if (currentStep === 1) {
      // Limpiar estados relacionados con pagos anteriores
      carritoCtx.limpiarPreferenceId();
      setPedidoGuardado(null);
    }
  }, [currentStep]);
  // Opción 4: Detectar cuando el usuario regresa de MercadoPago
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && preferenceId && carrito.length === 0) {
        // El usuario regresó a la página y el carrito está vacío
        // Limpiar el preferenceId para resetear el estado
        carritoCtx.limpiarPreferenceId();
        setPedidoGuardado(null);
        setCurrentStep(1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [preferenceId, carrito.length]);
  const renderStep1 = () => {
    return (
      <>
        {carrito.length === 0 ? (
          <div style={{ minHeight: "60vh" }} className="d-flex align-items-center justify-content-center">No hay artículos en el carrito</div>
        ) : (
          <>
            {stockError && (
              <div className="alert alert-danger m-5" role="alert">
                {stockError}
              </div>
            )}
            <div style={{ margin: "20px 250px" }}>
              {carrito.map((item) =>
                item.promocion ? (
                  <div key={`promo-${item.promocion.id}`} className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img
                      src={item.promocion.imagenes[0]?.denominacion}
                      alt="Imagen del artículo"
                      className="rounded"
                      style={{ width: "200px", height: "200px", objectFit: "cover", marginRight: "10px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2 pb-2">
                        <strong>{item.promocion.denominacion}</strong>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => quitarPromocionCompleta(item.promocion.id)}
                        >
                          X
                        </button>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <small>Precio: ${item.promocion.precioPromocional.toFixed(2)}</small>
                        <div className="d-flex align-items-center mx-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ background: "white", color: "black" }}
                            onClick={() => restarDelCarrito(item.promocion.id)}
                          >
                            <strong>-</strong>
                          </button>
                          <span className="mx-2">{item.cantidad}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ background: "white", color: "black" }}
                            onClick={() => agregarPromocionAlCarrito(item.promocion!)}
                          >
                            <strong>+</strong>
                          </button>
                        </div>
                      </div>
                      <div className="text-end mt-4">Subtotal: ${item.subTotal.toFixed(2)}</div>
                    </div>
                  </div>
                ) : (
                  <div key={`articulo-${item.articulo.id}`} className="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img
                      src={item.articulo.imagenes[0]?.denominacion}
                      alt="Imagen del artículo"
                      className="rounded"
                      style={{ width: "200px", height: "200px", objectFit: "cover", marginRight: "10px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between mb-2 pb-2">
                        <strong>{item.articulo.denominacion}</strong>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => quitarDelCarrito(item.articulo.id)}
                        >
                          X
                        </button>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <small>Precio: ${item.articulo.precioVenta.toFixed(2)}</small>
                        <div className="d-flex align-items-center mx-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ background: "white", color: "black" }}
                            onClick={() => restarDelCarrito(item.articulo.id)}
                          >
                            <strong>-</strong>
                          </button>
                          <span className="mx-2">{item.cantidad}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            style={{ background: "white", color: "black" }}
                            onClick={() => agregarAlCarrito(item.articulo, 1)}
                          >
                            <strong>+</strong>
                          </button>
                        </div>
                      </div>
                      <div className="text-end mt-4">Subtotal: ${item.subTotal.toFixed(2)}</div>
                    </div>
                  </div>
                )
              )}

              <div className="mt-3 text-end">
                <strong>
                  Total: $
                  {carrito.reduce((acc, item) => acc + item.subTotal, 0).toFixed(2)}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-warning" onClick={limpiarCarrito}>Limpiar carrito</button>
                <button
                  className="btn btn-success"
                  onClick={handleProceedToStep2}
                  disabled={verificandoStock}
                >
                  {verificandoStock ? 'Verificando stock...' : 'Realizar pedido'}
                </button>
              </div>
            </div>
          </>
        )}
      </>

    );
  };


  const renderStep2 = () => (
    <div className="p-4">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-link p-0 me-3 text-decoration-none"
          onClick={() => setCurrentStep(1)}
        >
          ← Volver
        </button>
        <h4>Datos de Entrega y Pago</h4>
      </div>
      {stockError && (
        <div className="alert alert-danger" role="alert">
          {stockError}
        </div>
      )}

      <div className="container-fluid justify-content-center">
        <div className="row">
          {/* Columna izquierda - Opciones (70%) */}
          <div className="col-lg-8 pe-4">
            {/* Forma de Entrega */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Forma de Entrega</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <button
                        className={`btn py-3 ${tipoEnvio === 'DELIVERY'
                          ? 'btn-success'
                          : 'btn-outline-success'
                          }`}
                        onClick={() => handleTipoEnvioChange('DELIVERY')}
                      >
                        <div>
                          <strong>🚚 Envío a Domicilio</strong>
                          <br />
                          <small>Recibí tu pedido en tu casa</small>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <button
                        className={`btn py-3 ${tipoEnvio === 'TAKEAWAY'
                          ? 'btn-success'
                          : 'btn-outline-success'
                          }`}
                        onClick={() => handleTipoEnvioChange('TAKEAWAY')}
                      >
                        <div>
                          <strong>🏪 Retiro en Local</strong>
                          <br />
                          <small>Retirá tu pedido en nuestro local</small>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {tipoEnvio === 'DELIVERY' && domicilioSeleccionado && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <strong>Domicilio seleccionado:</strong>
                    <p className="mb-0">
                      {domicilioSeleccionado.calle} {domicilioSeleccionado.numero}
                      {domicilioSeleccionado.piso && `, Piso ${domicilioSeleccionado.piso}`}
                      {domicilioSeleccionado.nroDepartamento && `, Depto ${domicilioSeleccionado.nroDepartamento}`}
                      <br />
                      {domicilioSeleccionado.localidad?.nombre} - CP: {domicilioSeleccionado.codigoPostal}
                    </p>
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => setShowDomicilioModal(true)}
                    >
                      Cambiar domicilio
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Forma de Pago */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Forma de Pago</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <button
                        className={`btn py-3 ${formaPago === 'EFECTIVO'
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                          }`}
                        disabled={tipoEnvio == "DELIVERY" ? true : false}
                        onClick={() => setFormaPago('EFECTIVO')}
                      >
                        <div>
                          <strong>💵 Efectivo</strong>
                          <br />
                          <small>Pagá al recibir tu pedido</small>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-grid gap-2">
                      <button
                        className={`btn py-3 ${formaPago === 'MERCADOPAGO'
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                          }`}
                        onClick={() => setFormaPago('MERCADOPAGO')}
                      >
                        <div>
                          <strong>💳 Mercado Pago</strong>
                          <br />
                          <small>Pagá online de forma segura</small>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen y botón (30%) */}
          <div className="col-lg-4 ps-3">
            {/* Resumen del Pedido */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                {/* Usar carrito si tiene items, sino usar pedidoGuardado */}
                {(carrito && carrito.length > 0 ? carrito : pedidoGuardado?.detalles || []).map((item) => (
                  <div key={item.articulo?.id || item.id} className="d-flex justify-content-between mb-2">
                    <span>
                      {item.cantidad}x {item.articulo?.denominacion}
                    </span>
                    <span>
                      ${(item.subTotal || (item.cantidad * item.articulo.precioVenta)).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Mostrar mensaje si no hay items en ninguno */}
                {(!carrito || carrito.length === 0) && (!pedidoGuardado?.detalles || pedidoGuardado.detalles.length === 0) && (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No hay productos en el pedido</p>
                  </div>
                )}

                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total: </strong>
                  <strong>
                    ${(() => {
                      const items = carrito && carrito.length > 0 ? carrito : pedidoGuardado?.detalles || [];
                      return items.reduce((acc, item) => {
                        return acc + (item.subTotal || (item.cantidad * item.articulo.precioVenta));
                      }, 0).toFixed(2);
                    })()}
                  </strong>
                </div>
              </div>
            </div>
            <div className="d-grid gap-2">
              {pedidoGuardado && (preferenceId != undefined) &&
                <CheckoutMP pedido={pedidoGuardado} />
              }
              {preferenceId != undefined ? (
                <div>
                  <Wallet
                    initialization={{ preferenceId: preferenceId, redirectMode: "blank" }}
                  />
                </div>
              ) : (
                <button
                  className={`btn btn-lg ${!stockError
                    ? 'btn-success'
                    : 'btn-secondary'
                    }`}
                  onClick={tipoEnvio == 'DELIVERY' ? handlePagarConMP : guardarPedidoTakeAway}
                  disabled={stockError !== null || verificandoStock}
                >
                  {verificandoStock ? 'Verificando...' : 'Confirmar Pedido'}
                </button>
              )
              }
            </div>
            {/* Información de Sucursal */}
            <div className="card mb-4 mt-2">
              <div className="card-header">
                <h5>Sucursal Seleccionada</h5>
              </div>
              <div className="card-body">
                <div className="p-3 bg-light rounded">
                  <strong>{sucursalActualUsuario?.nombre}</strong>
                  <p className="mb-0 text-muted">
                    {sucursalActualUsuario?.domicilio?.calle} {sucursalActualUsuario?.domicilio?.numero}
                    <br />
                    {sucursalActualUsuario?.domicilio?.localidad?.nombre}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === 1 ? renderStep1() : renderStep2()}

      {/* Modal para seleccionar domicilio */}
      {showDomicilioModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-0 pb-2">
                <div>
                  <h4 className="modal-title fw-bold text-dark mb-1">Seleccionar Domicilio</h4>
                  <p className="text-muted mb-0 small">Elige la dirección para tu pedido</p>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white bg-light rounded-circle p-2"
                  style={{ opacity: 0.8 }}
                  onClick={() => setShowDomicilioModal(false)}
                ></button>
              </div>

              <div className="modal-body px-4 py-3">
                {cliente?.domicilios && cliente.domicilios.length > 0 ? (
                  <div className="row g-3">
                    {cliente.domicilios
                      .filter(domicilio => !domicilio.eliminado)
                      .map((domicilio) => (
                        <div key={domicilio.id} className="col-12 col-md-6">
                          <div
                            className={`card h-100 border-2 transition-all ${domicilioSeleccionado?.id === domicilio.id
                              ? 'border-success shadow-sm bg-success bg-opacity-10'
                              : 'border-light-subtle hover-shadow'
                              }`}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                              borderRadius: '12px'
                            }}
                            onClick={() => handleDomicilioSelect(domicilio)}
                            onMouseEnter={(e) => {
                              if (domicilioSeleccionado?.id !== domicilio.id) {
                                e.target.classList.add('shadow-sm', 'border-primary', 'border-opacity-50');
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (domicilioSeleccionado?.id !== domicilio.id) {
                                e.target.classList.remove('shadow-sm', 'border-primary', 'border-opacity-50');
                              }
                            }}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-center align-items-start mb-2">
                                <h6 className="card-title fw-semibold text-dark mb-0">
                                  <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                  {domicilio.calle} {domicilio.numero}
                                </h6>
                                {domicilioSeleccionado?.id === domicilio.id && (
                                  <i className="fas fa-check-circle text-success"></i>
                                )}
                              </div>

                              <div className="card-text">
                                <div className="d-flex flex-column gap-1 text-muted small">
                                  {domicilio.piso && (
                                    <span>
                                      <i className="fas fa-building me-1"></i>
                                      Piso {domicilio.piso}
                                      {domicilio.nroDepartamento && `, Depto ${domicilio.nroDepartamento}`}
                                    </span>
                                  )}

                                  <span>
                                    <i className="fas fa-city me-1"></i>
                                    {domicilio.localidad?.nombre}
                                  </span>

                                  <span>
                                    <i className="fas fa-mail-bulk me-1"></i>
                                    CP: {domicilio.codigoPostal}
                                  </span>

                                  {domicilio.detalles && (
                                    <div className="mt-2 pt-2 border-top border-light">
                                      <span className="text-info small">
                                        <i className="fas fa-info-circle me-1"></i>
                                        {domicilio.detalles}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="fas fa-home fa-3x text-muted opacity-50"></i>
                    </div>
                    <h5 className="text-muted mb-2">No tienes domicilios registrados</h5>
                    <p className="text-muted small mb-0">Agrega tu primera dirección para continuar</p>
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light bg-opacity-50 border-0 rounded-bottom-4 px-4 py-3">
                <div className="d-flex justify-content-between w-100 gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 rounded-pill"
                    onClick={() => setShowDomicilioModal(false)}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                  </button>

                  <Button
                    variant="dark"
                    className="px-4 rounded-pill shadow-sm"
                    onClick={handleAgregar}
                    style={{
                      background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)',
                      border: 'none'
                    }}
                  >
                    <FaPlus className="me-2" />
                    Agregar dirección
                  </Button>
                </div>
              </div>

              <ModalDomicilio
                show={modalVisible}
                onHide={() => setModalVisible(false)}
                onSubmit={handleModalSubmit}
                domicilioActual={domicilioSeleccionado!}
                cliente={cliente!}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}