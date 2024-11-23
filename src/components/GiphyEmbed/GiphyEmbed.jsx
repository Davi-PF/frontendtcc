import React from "react";
import PropTypes from "prop-types";

const GiphyEmbed = ({ src, width, height, title }) => {
    return (
        <iframe
            src={src}
            title={title}
            width={width}
            height={height}
            allowFullScreen
            style={{ pointerEvents: "none" }}
            frameBorder="0"
        ></iframe>
    );
};

GiphyEmbed.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
};

GiphyEmbed.defaultProps = {
    width: "100%",
    height: "300px",
};

export default GiphyEmbed;
