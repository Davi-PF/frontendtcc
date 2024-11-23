import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/styles';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faBagShopping } from '@fortawesome/free-solid-svg-icons';

function Header({ homeStyle }) {

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
        fontSize: '32px'
    };

    const headerStyle = {
        width: '100%', 
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center', 
    };

    return (
        <div style={backgroundStyle}>
            {homeStyle &&
                <img src="/img/ZloLogoIcon.png" style={imgStyleLogo} alt="ZloLogo" />
            }
            {!homeStyle &&
                <div style={headerStyle}>
                    <Link to="/emergencyPhone">
                        <FontAwesomeIcon icon={faAngleLeft} style={iconHeaderStyle} />
                    </Link>
                    <img
                        src="/img/ZloLogoIcon.png"
                        style={imgStyleLogo}
                        alt="ZloLogo"
                    />
                    <Link to="/emergencyPhone">
                        <FontAwesomeIcon icon={faBagShopping} style={iconHeaderStyle} />
                    </Link>
                </div>
            }
        </div>
    );
}

Header.propTypes = {
    homeStyle: PropTypes.bool.isRequired,
};

export default Header;
