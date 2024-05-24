import React from 'react'

import '@fortawesome/fontawesome-svg-core/styles.css'; //importing font awesome css
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FontAwesome = ({ icon, size }: any) => {
    return (
        <FontAwesomeIcon icon={icon} size={size} />
    )
}

export default FontAwesome