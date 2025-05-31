import Button from "react-bootstrap/Button";

interface BotonAltaProps {
  onClick?: () => void;
}

const BotonAlta: React.FC<BotonAltaProps> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            variant="success"
            size="sm"
        >
            Dar de alta
        </Button>

    );
}

export default BotonAlta;