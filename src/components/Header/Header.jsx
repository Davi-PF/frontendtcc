// src/components/Header/Header.js

import React from 'react';
import { COLORS } from '../../constants/styles';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import zloLogo from "../../images/ZloLogoIcon.png";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const backgroundStyle = {
        backgroundColor: COLORS.BLUE_MAIN,
        width: '100%',
        display: "flex",
        justifyContent: "center"
    };

    const imgStyleLogo = {
        width: '60px',
        margin: "1vh 0",
        filter: 'brightness(0) invert(1)'
    };

    const iconHeaderStyle = {
        color: COLORS.WHITE,
        fontSize: '32px',
        cursor: 'pointer'
    };

    const headerStyle = {
        width: '100%', 
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center', 
    };

    // Define as rotas onde o botão de voltar NÃO deve ser exibido
    const hideBackButtonPaths = ["/home", "/loadingScreen"];

    // Determina se o botão de voltar deve ser exibido
    const showBackButton = !hideBackButtonPaths.includes(location.pathname);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div style={backgroundStyle}>
            {showBackButton ? (
                <div style={headerStyle}>
                    {/* Botão de voltar acessível */}
                    <button 
                        onClick={handleBack} 
                        style={{ background: 'none', border: 'none', padding: 0 }}
                        aria-label="Voltar"
                    >
                        <FontAwesomeIcon icon={faAngleLeft} style={iconHeaderStyle} />
                    </button>
                    <img
                        src={zloLogo}
                        style={imgStyleLogo}
                        alt="ZloLogo"
                    />
                    {/* Ícone de carrinho (ou qualquer outra ação) */}
                    <Link to="/emergencyPhone">
                        <FontAwesomeIcon icon={faBagShopping} style={iconHeaderStyle} />
                    </Link>
                </div>
            ) : (
                // Exibe apenas o logo quando o botão de voltar está oculto
                <img src={zloLogo} style={imgStyleLogo} alt="ZloLogo" />
            )}
        </div>
    );
}

export default Header;
