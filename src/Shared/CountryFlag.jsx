import React from 'react';

/**
 * Componente de bandera que utiliza un servicio de CDN de banderas
 * 
 * @param {string} countryCode - Código ISO del país (2 caracteres)
 * @param {number} width - Ancho de la bandera (por defecto: 24)
 * @param {number} height - Alto de la bandera (por defecto: 16)
 * @param {object} props - Propiedades adicionales para la imagen
 */
const CountryFlag = ({
    countryCode,
    width = 52,
    height = 16,
    ...props
}) => {
    // Normaliza el código de país
    const normalizedCode = React.useMemo(() =>
        countryCode?.toLowerCase() || '',
        [countryCode]
    );

    // Si no hay código, muestra un placeholder
    if (!normalizedCode) {
        return (
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: '#DDDDDD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${height * 0.6}px`,
                    color: '#666666',
                    overflow: 'hidden',
                    borderRadius: '1px',
                    ...props.style
                }}
                className={props.className}
            >
                ?
            </div>
        );
    }

    // Usa flagcdn.com que es un servicio confiable para banderas
    // Si necesitas un tamaño específico, puedes usar diferentes tamaños: w20, w40, w80, w160, w320, w640, w1280, w2560
    // Por ejemplo: https://flagcdn.com/w80/us.png
    const flagUrl = `https://flagcdn.com/${normalizedCode}.svg`;

    return (
        <img
            src={flagUrl}
            alt={`Bandera de ${countryCode.toUpperCase()}`}
            width={width}
            height={height}
            style={{
                border: '0.5px solid rgba(0,0,0,0.1)',
                borderRadius: '1px',
                objectFit: 'cover',
                ...props.style
            }}
            className={props.className}
            onError={(e) => {
                // Si hay error de carga, muestra un fallback con el código
                e.target.onError = null;
                // Creamos un SVG inline con el tamaño adecuado
                const encodedSvg = encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
             <rect width="${width}" height="${height}" fill="#DDDDDD"/>
             <text x="${width / 2}" y="${height / 2 + height * 0.1}" 
                   font-size="${height * 0.5}" text-anchor="middle" fill="#666666">
               ${normalizedCode.toUpperCase()}
             </text>
           </svg>`
                );
                e.target.src = `data:image/svg+xml;utf8,${encodedSvg}`;
            }}
        />
    );
};

export default CountryFlag;