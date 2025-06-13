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
import SelectorSucursal from "../empresa/SelectorSucursal";

export function Carrito() {
  const { cliente } = useAuth();
  const carritoCtx = useCarrito();
  const [currentStep, setCurrentStep] = useState(1);
  const [tipoEnvio, setTipoEnvio] = useState<'DELIVERY' | 'TAKEAWAY' | null>(null);
  const [domicilioSeleccionado, setDomicilioSeleccionado] = useState<Domicilio>();
  const [formaPago, setFormaPago] = useState<'EFECTIVO' | 'MERCADOPAGO' | null>(null);
  const [showDomicilioModal, setShowDomicilioModal] = useState(false);
  const [pedidoGuardado, setPedidoGuardado] = useState<Pedido | null>(null);
  const { sucursalActual } = useSucursalUsuario();

  if (!carritoCtx) return null;
  useEffect(()=>{
    if(formaPago == 'EFECTIVO'){
      pedido.formaPago = FormaPago.EFECTIVO
    }else{
      pedido.formaPago = FormaPago.MERCADO_PAGO;
    }
  },[formaPago]);

  useEffect(()=>{
    pedido.sucursal = sucursalActual!;
    console.log(pedido.sucursal)
  },[sucursalActual]);

  useEffect(()=>{
    pedido.cliente = cliente!;
  },[cliente]);

  useEffect(()=>{
    fetch("/localidades.json").then((res)=>res.json()).then((localidades)=>localidades.map((loc: any)=>{
      if(loc.nombre == domicilioSeleccionado?.localidad?.nombre && tipoEnvio != 'TAKEAWAY'){
        if (domicilioSeleccionado){
          pedido.domicilio = domicilioSeleccionado;
          console.log(domicilioSeleccionado)
          console.log(pedido)
        }
        console.log(pedido)
      }
    }))
  },[domicilioSeleccionado]);
  const {
    pedido,
    preferenceId,
    restarDelCarrito,
    agregarAlCarrito,
    quitarDelCarrito,
    limpiarCarrito,
    guardarPedidoYObtener,
  } = carritoCtx;

  const carrito = pedido.detalles;

  const handleProceedToStep2 = () => {
    setCurrentStep(2);
  };

  const handleTipoEnvioChange = (tipo: 'DELIVERY' | 'TAKEAWAY') => {
    setTipoEnvio(tipo);
    if (tipo === 'DELIVERY') {
      setShowDomicilioModal(true);
      pedido.tipoEnvio = TipoEnvio.DELIVERY;
    } else {
      pedido.tipoEnvio = TipoEnvio.TAKEAWAY;
    }
  };

  const handleDomicilioSelect = (domicilio: Domicilio) => {
    setDomicilioSeleccionado(domicilio);
    setShowDomicilioModal(false);
  };

  const handlePagarConMP = async () => {
    const pedidoFinal = await guardarPedidoYObtener();
    console.log(pedidoFinal)
    if (pedidoFinal) {
      setPedidoGuardado(pedidoFinal);
    }
    console.log("preference: ",preferenceId)
  };
  const canProceedToConfirm = tipoEnvio && formaPago && (tipoEnvio === 'TAKEAWAY' || domicilioSeleccionado);

  const renderStep1 = () => (
    <div className="p-4" style={{minHeight: "60vh"}}>
      <h4 className="mb-4">Carrito de Compras</h4>
      {carrito.length === 0 ? (
        <p className="text-muted">El carrito está vacío.</p>
      ) : (
        <>
          {carrito.map((item) => (
            <div key={item.articulo.id} className="d-flex align-items-center mb-3 border-bottom pb-2">
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
                    onClick={() => quitarDelCarrito(item.articulo.id ? item.articulo.id : 0)}
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
                      onClick={() => restarDelCarrito(item.articulo.id ? item.articulo.id : 0)}
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
          ))}
          <div className="mt-3 text-end">
            <strong>
              Total: $
              {carrito
                .reduce((acc, item) => acc + item.subTotal, 0)
                .toFixed(2)}
            </strong>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-warning" onClick={limpiarCarrito}>Limpiar carrito</button>
            <button className="btn btn-success" onClick={handleProceedToStep2}>Realizar pedido</button>
          </div>
        </>
      )}
    </div>
  );

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
                        className={`btn py-3 ${
                          tipoEnvio === 'DELIVERY' 
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
                        className={`btn py-3 ${
                          tipoEnvio === 'TAKEAWAY' 
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
                        className={`btn py-3 ${
                          formaPago === 'EFECTIVO' 
                            ? 'btn-primary' 
                            : 'btn-outline-primary'
                        }`}
                        disabled = {tipoEnvio == "DELIVERY" ? true : false}
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
                        className={`btn py-3 ${
                          formaPago === 'MERCADOPAGO' 
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
                {carrito.map((item) => (
                  <div key={item.articulo.id} className="d-flex justify-content-between mb-2">
                    <span>{item.cantidad}x {item.articulo.denominacion}</span>
                    <span>${item.subTotal.toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total: </strong>
                  <strong>
                    ${carrito.reduce((acc, item) => acc + item.subTotal, 0).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
            {tipoEnvio == 'TAKEAWAY' && 
              <SelectorSucursal tipoEnvio={tipoEnvio}/>
            }
            <div className="d-grid gap-2">
              {pedidoGuardado && 
                <CheckoutMP pedido={pedidoGuardado}/>
              }
              {preferenceId ? (
                <div>
                    <Wallet
                        initialization={{ preferenceId: preferenceId, redirectMode: "blank" }}
                        />
                </div>
                ):(
                  <button
                    className={`btn btn-lg ${
                      canProceedToConfirm
                        ? 'btn-success'
                        : 'btn-secondary'
                    }`}
                    onClick={handlePagarConMP}
                    disabled={!canProceedToConfirm}
                  >
                    Confirmar Pedido
                  </button>
                )
              }
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Domicilio</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDomicilioModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {cliente?.domicilios && cliente.domicilios.length > 0 ? (
                  <div className="row">
                    {cliente.domicilios
                      .filter(domicilio => !domicilio.eliminado)
                      .map((domicilio) => (
                        <div key={domicilio.id} className="col-md-6 mb-3">
                          <div
                            className={`card h-100 ${
                              domicilioSeleccionado?.id === domicilio.id 
                                ? 'border-success bg-success bg-opacity-10' 
                                : 'border-secondary'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDomicilioSelect(domicilio)}
                          >
                            <div className="card-body">
                              <h6 className="card-title">
                                {domicilio.calle} {domicilio.numero}
                              </h6>
                              <div className="card-text">
                                {domicilio.piso && `Piso ${domicilio.piso}`}
                                {domicilio.nroDepartamento && `, Depto ${domicilio.nroDepartamento}`}
                                <br />
                                {domicilio.localidad?.nombre}
                                <br />
                                CP: {domicilio.codigoPostal}
                                {domicilio.detalles && (
                                  <>
                                    <br />
                                    <small className="text-muted">{domicilio.detalles}</small>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">No tienes domicilios registrados.</p>
                    <button className="btn btn-primary">Agregar Domicilio</button>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDomicilioModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}