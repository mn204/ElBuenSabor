
// TODO boton de ver la contraseña


const LoginEmpleado = ( ) => {


    return (
        <form style={{ width: "300px", margin: "0 auto"}}>
            <h2 className="m-4">Iniciar Sesión</h2>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" />
            </div>

            <button type="submit" className="btn btn-dark w-100 mb-2">Iniciar Sesión</button>


            <div className="text-center mt-2">
                <a href="#" className="text-primary small">¿Olvidaste tu contraseña?</a>
            </div>

            <hr />

        </form>
    );
};

export default LoginEmpleado;
