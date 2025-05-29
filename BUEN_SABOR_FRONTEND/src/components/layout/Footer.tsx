import '../../styles/footer.css';
import Twitter from '../../assets/Twiter.svg';
import Instragram from '../../assets/Instragram.svg';
import Facebook from '../../assets/Facebook.svg';
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className='fw-bold'>Nuestra Compañia</p>
        <p>Quienes Somos</p>
        <p>Terminos y Condiciones</p>
        <br />
        <p className='fw-bold'>Contacto</p>
        <p>Direccion:  Calle falsa 1234, Mendoza, Argentina</p>
        <p>Email: elbuensabor@gmail.com</p>
        <p>Teléfono: +54 261 126 4124</p>
      </div>
      <div>
        <p className='fw-bold'>&copy; 2025 El Buen Sabor. Todos los derechos reservados.</p>
      </div>
      <div className='tercerDiv'>
        <div className='RedesSociales'>
            <span className='fw-bold'>Redes Sociales</span>
            <a href=""><img src={Twitter} alt="" /></a>
            <a href=""><img src={Instragram} alt="" /></a>
            <a href=""><img src={Facebook} alt="" /></a>
        </div>
        <div className="DefensaAlConsumidor">
            <p className='fw-bold'>Defensa al consumidor</p>
            <p>Defensa a los consumidores ingresa acá</p>
            <p>Ley N° 24.240 de Defensa a Consumidor  Ver contratos de Adhesión</p>zzzz
        </div>
      </div>
    </footer>
  );
}

export default Footer;