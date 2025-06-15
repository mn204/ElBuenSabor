import { useEffect, useState } from "react";
import ArticuloManufacturadoService from "../../../services/ArticuloManufacturadoService.ts";
import DetalleArticulosTable from "../DetalleArticulosTable.tsx";
import "../../../styles/ArticuloManufacturado.css";
import Button from "react-bootstrap/Button";
import ImagenArticulo from "../../../models/ImagenArticulo.ts";
import { subirACloudinary } from "../../../funciones/funciones.tsx";
import TipoPromocion from "../../../models/enums/TipoPromocion.ts";
import DetallePromocion from "../../../models/DetallePromocion.ts";
import type Articulo from "../../../models/Articulo.ts";
import Promocion from "../../../models/Promocion.ts";
import type ImagenPromocion from "../../../models/ImagenPromocion.ts";
import { useSearchParams } from "react-router-dom";
import PromocionService from "../../../services/PromocionService.ts";
import ModalAgregarArticulo from "../../articulos/ModalAgregarArticulo.tsx";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService.ts";
import { useSucursal } from "../../../context/SucursalContextEmpleado.tsx";

function FormPromocion() {
    const { sucursalActual } = useSucursal();
    const [showModal, setShowModal] = useState(false);
    const [articulos, setArticulos] = useState<Articulo[]>([]);

    // Estados principales
    const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
    const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);
    const [denominacion, setDenominacion] = useState<string>("");
    const [descripcion, setDescripcion] = useState<string>("");
    const [fechaDesde, setFechaDesde] = useState<Date>(new Date());
    const [fechaHasta, setFechaHasta] = useState<Date>(new Date());
    const [horaDesde, setHoraDesde] = useState<string>("");
    const [horaHasta, setHoraHasta] = useState<string>("");
    const [precio, setPrecio] = useState<number>(0);
    const [activa, setActiva] = useState<boolean>(true);
    const [tipo, setTipo] = useState<TipoPromocion>(TipoPromocion.PROMOCION);
    const [detalles, setDetalles] = useState<DetallePromocion[]>([]);
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [imagenesExistentes, setImagenesExistentes] = useState<ImagenPromocion[]>([]);
    const [searchParams] = useSearchParams();
    const idFromUrl = searchParams.get("id");

    useEffect(() => {
        if (showModal) {
            cargarArticulos();
        }
    }, [showModal]);

    const cargarArticulos = () => {
        ArticuloInsumoService.getAllNoParaElaborar().then(setArticulos);
        ArticuloManufacturadoService.getAll().then((art) => setArticulos(prev => [...prev, ...art]));
    }
    const limpiarFormulario = () => {
        setArticuloSeleccionado(null)
        setCantidadInsumo(0)
        setDenominacion("")
        setDescripcion("")
        setFechaDesde(new Date())
        setFechaHasta(new Date())
        setPrecio(0)
        setTipo(TipoPromocion.PROMOCION)
        setDetalles([])
        setImagenes([])
    }
    // Utilidades
    const totalArticulos = detalles!.reduce((acc, det) => {
        const precio = det.articulo?.precioVenta ?? 0;
        return acc + precio * det.cantidad;
    }, 0);

    // Handlers
    const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const nuevosArchivos = Array.from(e.target.files as FileList);

            // Filtra para evitar duplicados por nombre y tamaño
            const archivosFiltrados = nuevosArchivos.filter(nuevo =>
                !imagenes!.some(img => img.name === nuevo.name && img.size === nuevo.size)
            );

            if (archivosFiltrados.length < nuevosArchivos.length) {
                alert("Algunas imágenes ya fueron seleccionadas y no se agregarán de nuevo.");
            }

            setImagenes(prev => [...prev, ...archivosFiltrados]);
        }
    };

    const AgregarInsumo = () => {
        if (articuloSeleccionado) {
            setDetalles(prev => {
                const index = prev.findIndex(
                    det => det.articulo?.id === articuloSeleccionado.id
                );
                if (index !== -1) {
                    // Si ya existe, suma la cantidad
                    const nuevosDetalles = [...prev];
                    nuevosDetalles[index] = {
                        ...nuevosDetalles[index],
                        cantidad: nuevosDetalles[index].cantidad + cantidadInsumo,
                    };
                    return nuevosDetalles;
                } else {
                    // Si no existe, lo agrega
                    const detallePromocion = new DetallePromocion();
                    detallePromocion.cantidad = cantidadInsumo;
                    detallePromocion.articulo = articuloSeleccionado;
                    detallePromocion.eliminado = false;
                    return [
                        ...prev, detallePromocion
                    ];
                }
            });
            setShowModal(false);
            setArticuloSeleccionado(null);
            setCantidadInsumo(1);
        }
    };
    useEffect(() => {
        if (idFromUrl) {
            const fetchPromocion = async () => {
                try {
                    const promocion = await PromocionService.getById(Number(idFromUrl));
                    console.log(promocion)
                    setDenominacion(promocion.denominacion);
                    setDescripcion(promocion.descripcionDescuento);
                    setFechaDesde(new Date(promocion.fechaDesde));
                    setFechaHasta(new Date(promocion.fechaHasta));
                    setHoraDesde(promocion.horaDesde);
                    setHoraHasta(promocion.horaHasta);
                    setPrecio(promocion.precioPromocional);
                    setTipo(promocion.tipoPromocion);
                    setActiva(promocion.activa);
                    setDetalles(promocion.detalles || []);
                    setImagenesExistentes(promocion.imagenes || []);
                } catch (error) {
                    console.error("Error al cargar la promoción:", error);
                }
            };

            fetchPromocion();
        }
    }, [idFromUrl]);

    // Factoriza la creación del objeto manufacturado
    const buildPromocion = async (): Promise<Promocion | null> => {
        const promocion = new Promocion();
        promocion.denominacion = denominacion;
        promocion.descripcionDescuento = descripcion;
        promocion.fechaDesde = fechaDesde;
        promocion.fechaHasta = fechaHasta;
        promocion.horaDesde = horaDesde;
        promocion.horaHasta = horaHasta;
        promocion.precioPromocional = precio;
        promocion.tipoPromocion = tipo;
        promocion.activa = activa;
        promocion.sucursal = sucursalActual!;
        promocion.detalles = detalles.map(det => ({
            id: det.id ?? undefined,
            cantidad: det.cantidad,
            articulo: det.articulo,
            eliminado: false,
        }));

        // 🔄 Subir imágenes nuevas a Cloudinary
        const nuevasImagenes = await Promise.all(
            imagenes.map(async (file) => {
                const url = await subirACloudinary(file);
                const imagen = new ImagenArticulo();
                imagen.denominacion = url; // Usamos URL en lugar de base64
                imagen.eliminado = false;
                return imagen;
            })
        );

        const imagenesNoEliminadas = imagenesExistentes.filter(img => !img.eliminado);

        promocion.imagenes = [
            ...imagenesNoEliminadas,
            ...nuevasImagenes,
        ];

        return promocion;
    };


    const guardarOModificar = async () => {
        try {
            const promocion = await buildPromocion();
            if (!promocion) return;
            console.log(promocion.detalles)
            if (idFromUrl) {
                await PromocionService.update(Number(idFromUrl), promocion);
                alert("Promocion actualizada correctamente");
            } else {
                await PromocionService.create(promocion);
                alert("Promocion creada correctamente");
            }
            limpiarFormulario();
            window.location.href = "/empleado/promociones";
        } catch (error) {
            console.error(error);
            alert("Error al guardar o actualizar la promocion");
        }
    };
    const EliminarDetalle = (index: number) => {
        setDetalles(prev => prev.filter((_, i) => i !== index));
    };

    const CambiarCantidadDetalle = (index: number, cantidad: number) => {
        setDetalles(prev =>
            prev.map((det, i) =>
                i === index ? { ...det, cantidad } : det
            )
        );
    };
    const eliminarImagenExistente = (idx: number) => {
        setImagenesExistentes(prev =>
            prev.map((img, i) => (i === idx ? { ...img, eliminado: true } : img))
        );
    };

    const eliminarImagenNueva = (idx: number) => {
        setImagenes(prev => prev.filter((_, i) => i !== idx));
    };
    return (
        <div className="formArticuloManufacturado container text-start d-flex flex-column gap-3 w-100" style={{ maxWidth: 500 }}>
            <h2>Formulario Promocion</h2>
            <div className="d-flex flex-column">
                <label>Denominación:</label>
                <input
                    type="text"
                    onChange={e => setDenominacion(e.target.value)}
                    className="form-control"
                    required
                    value={denominacion}
                />
            </div>
            <div className="d-flex flex-column">
                <label>Descripción:</label>
                <textarea
                    onChange={e => setDescripcion(e.target.value)}
                    className="form-control"
                    required
                    value={descripcion}
                />
            </div>
            <div className="d-flex gap-3">
                <div className="desde">
                    <span>Fecha Desde</span>
                    <input type="date" name="fechaDesde" id="fechaDesde"
                        value={fechaDesde.toISOString().split("T")[0]} // formato YYYY-MM-DD
                        onChange={(e) => setFechaDesde(new Date(e.target.value))} />
                </div>
                <div className="hasta">
                    <span>Fecha Hasta</span>
                    <input type="date" name="fechaHasta" id="fechaHasta"
                        value={fechaHasta.toISOString().split("T")[0]} // formato YYYY-MM-DD
                        onChange={(e) => setFechaHasta(new Date(e.target.value))} />
                </div>
            </div>
            <div className="d-flex gap-3">
                <div className="desde w-100">
                    <span>Hora Desde</span>
                    <input type="time" name="horaDesde" id="horaDesde" value={horaDesde} onChange={e => setHoraDesde(e.target.value)} />
                </div>
                <div className="hasta w-100">
                    <span>Hora Hasta</span>
                    <input type="time" name="horaHasta" id="horaHasta" value={horaHasta} onChange={e => setHoraHasta(e.target.value)} />
                </div>
            </div>
            <div className="d-flex flex-column">
                <label>Imágenes:</label>
                {/* Imágenes existentes */}
                {imagenesExistentes.length > 0 && (
                    <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                        {imagenesExistentes.map((img, idx) =>
                            !img.eliminado && (
                                <div key={img.id || idx} style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={img.denominacion}
                                        alt={`img-existente-${idx}`}
                                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => eliminarImagenExistente(idx)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 20,
                                            height: 20,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}
                {/* Imágenes nuevas */}
                <div className="preview-imagenes mt-2 d-flex gap-2 flex-wrap">
                    {imagenes.map((img, idx) => (
                        <div key={idx} style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                            />
                            <button
                                type="button"
                                onClick={() => eliminarImagenNueva(idx)}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: 20,
                                    height: 20,
                                    cursor: "pointer",
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImagenesChange}
                />
            </div>
            <div className="tipoPromocion">
                <span>Tipo de Promocion</span>
                <select
                    name="tipo"
                    value={tipo}
                    onChange={e => setTipo(e.target.value as TipoPromocion)}
                >

                    <option value="PROMOCION">PROMOCION</option>
                    <option value="HAPPYHOUR">HAPPYHOUR</option>
                </select>
            </div>
            <Button className="agregarInsumo" variant="primary" onClick={() => setShowModal(true)}>
                Agregar Articulo
            </Button>
            <ModalAgregarArticulo
                show={showModal}
                onHide={() => setShowModal(false)}
                articulos={
                    articulos.filter(
                        articulo => !detalles.some(det => det.articulo?.id === articulo.id)
                    )
                }
                articuloSeleccionado={articuloSeleccionado}
                setArticuloSeleccionado={setArticuloSeleccionado}
                cantidadInsumo={cantidadInsumo}
                setCantidadInsumo={setCantidadInsumo}
                onAgregar={AgregarInsumo}
            />
            <DetalleArticulosTable
                detalles={detalles}
                onEliminar={EliminarDetalle}
                onCantidadChange={CambiarCantidadDetalle}
                totalInsumos={totalArticulos}
            />
            <div className="d-flex align-items-center gap-3">
                <label><b>Precio:</b></label>
                <input
                    type="text"
                    value={precio}
                    onChange={e => setPrecio(Number(e.target.value))}
                    style={{ width: 120, fontWeight: "bold" }}
                />
            </div>
            <Button
                variant={idFromUrl ? "warning" : "success"}
                className="mt-3"
                onClick={guardarOModificar}
                disabled={
                    !denominacion ||
                    !descripcion ||
                    detalles.length === 0
                }
            >
                {idFromUrl ? "Actualizar Promocion" : "Guardar Promocion"}
            </Button>
        </div>
    );
}

export default FormPromocion;