import React from 'react'
import PropTypes from 'prop-types'
import { COLORS, FONTS, INPUTSIZE, SHADOWS } from '../../constants/styles'

const mapShadow = shadowType => {
    const shadowMapping = {
        large: SHADOWS.LARGE_BOX,
        small: SHADOWS.SMALL_BOX,
    }
    return shadowMapping[shadowType] || shadowType
}

const mapFontSize = size => {
    const fontSizeMapping = {
        title: FONTS.TITLE_SIZE,
        caption: FONTS.CAPTION_SIZE,
        text: FONTS.TEXT_SIZE,
        button: FONTS.BUTTON_SIZE
    }
    return fontSizeMapping[size] || size
}

const mapColor = color => {
    const colorMapping = {
        lightBlue: COLORS.LIGHT_BLUE,
        blue: COLORS.BLUE_MAIN,
        darkBlue: COLORS.DARK_BLUE,
        red: COLORS.RED_MAIN,
        green: COLORS.GREEN_MAIN,
    }
    return colorMapping[color] || color
}

function Button({width, height, shadow, fontSize, color, children, margin, onClick}) {
    const constantStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        color: 'white',
        fontFamily: FONTS.FAMILY,
    }

    const propBasedStyle = {
        width: width || "100%", // Ocupa toda a largura do contêiner pai
        maxWidth: "400px", // Limita a largura do botão
        height: height || "60px",
        boxShadow: mapShadow(shadow),
        fontSize: mapFontSize(fontSize),
        backgroundColor: mapColor(color),
        margin: margin || "10px auto", // Espaçamento e centralização
    };
    

    const combinedStyles = {...constantStyle, ...propBasedStyle}

    return (
        <button style={combinedStyles} onClick={onClick}>
            {children}
        </button>
    )
}

Button.defaultProps = {
    color: 'blue',
    fontSize: 'button',
    shadow: 'none',
    width: INPUTSIZE.INPUT_SIZE,
    height: '60px',
    margin: '0px auto',
}

Button.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    margin: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    shadow: PropTypes.oneOf(['none', 'small', 'large']),
    fontSize: PropTypes.oneOf(['title', 'caption', 'text', 'button']),
    color: PropTypes.oneOf(['lightBlue', 'blue', 'darkBlue', 'red', 'green']),
}

export default Button
