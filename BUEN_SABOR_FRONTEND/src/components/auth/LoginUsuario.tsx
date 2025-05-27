// LoginUsuario.tsx

const LoginUsuario = () => (
  <form>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input type="email" className="form-control" id="email" />
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">Contraseña</label>
      <input type="password" className="form-control" id="password" />
    </div>
    <button type="submit" className="btn btn-primary">Ingresar</button>
  </form>
);

export default LoginUsuario;