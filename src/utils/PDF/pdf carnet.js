const carnet_universidad = "Universidad Central de Venezuela"
const carnet_cov = "874444";
const carnet_mpps = "547744";
const carnet_apellidos = "BRUZUAL HERRERA";
const carnet_nombre = "RICARDO BRUZUAL";
const carnet_ci = "21073816";

const carnet_fecha_emision = "12-05-2025";
const carnet_fecha_vencimiento = "12-05-2026";
const carnet_profesion = "ODONTÓLOGO";
const carnet_url = "https://colegiadoscov.sistemasjrpm.com/searchs";

const carnet_foto = "http://localhost:3000/carnet.png";


const initialContent = [
    {
        columns: [
            { text: '', width: '*'},
            { image: 'escudo', width: 100},
            { text: '', width: '*'}
        ],
        marginTop: 25,
    },
    {
        columns: [
            { text: '', width: '*'},
            {   
                stack: [
                    { 
                        text: 'COLEGIO DE ODONTOLOGOS DE VENEZUELA',
                        fontSize: 20,
                        alignment: 'left',
                        bold: true
                    },
                    { 
                        text: 'RIF J-00041277-4'
                    }
                ],
                width: 'auto'
            },
            { text: '', width: '*'},
        ],
        marginTop: 10,
    },
    {
        table: {
            widths: [1,'*', 'auto', '*', 40, 1],

            body: [
                [{ text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}],
                [{ text: ''}, {colSpan: 4, text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA', fontSize: 6, bold: true , alignment: 'center', fillColor: '#522D8A', color: '#FFFFFF' }, { text: '' }, { text: '' }, { text: ''}, { text: ''}],
                [{ text: ''}, {colSpan: 4, text: 'COLEGIO DE ODONTÓLOGOS DE VENEZUELA', fontSize: 7, bold: true , alignment: 'center', fillColor: '#522D8A', color: '#FFFFFF'}, { text: '' }, { text: ''}, { text: ''}, { text: ''}],
                [{ text: ''}, {colSpan: 4, text: carnet_universidad, fontSize: 4, bold: true , alignment: 'center', fillColor: '#522D8A', color: '#FFFFFF'}, { text: '' }, { text: ''}, { text: ''}, { text: ''}],
                [{ text: ''},{ colSpan: 3,
                    columns: [
                        {   
                            stack: [
                                { image: 'carnet', fit: [50,60], marginLeft: 4},
                                { columns: [{ text: 'C.O.V', bold: true, color: '#522D8A', fontSize: 7}, { text: carnet_cov, bold: true}], marginTop: 3, fontSize: 7, alignment: 'center'},
                                { columns: [{ text: 'M.P.P.S', bold: true, color: '#522D8A', fontSize: 7}, { text: carnet_mpps, bold: true}], marginTop: 3, fontSize: 7, alignment: 'center'}
                            ],
                            width: 'auto',
                            paddingLeft: 10
                        },
                        {   
                            stack: [
                                { text: carnet_apellidos, bold: true, marginTop: 2, fontSize: 7},
                                { text: 'Apellidos', bold: true, color: '#522D8A', marginTop: 1, marginBottom: 1, fontSize: 7},
                                { text: carnet_nombre, bold: true, marginTop: 2, fontSize: 7},
                                { text: 'Nombres', bold: true, color: '#522D8A', marginTop: 1, marginBottom: 1, fontSize: 7},
                                { text: carnet_ci, bold: true, marginTop: 2, fontSize: 7},
                                { text: 'Cédula de Identidad', bold: true, color: '#522D8A', marginTop: 2, marginBottom: 1, fontSize: 7},
                                { columns: [{ text: 'F. Emisión:', bold: true, color: '#522D8A'}, { text: carnet_fecha_emision, bold: true}], marginTop: 3, fontSize: 7},
                                { columns: [{ text: 'Válido Hasta:', bold: true, color: '#522D8A'}, { text: carnet_fecha_vencimiento, bold: true}], marginTop: 3, fontSize: 7},
                                {   
                                    columns: [
                                        {
                                            stack: [
                                                { image: 'escudo', fit: [20, 10], alignment: 'center'},
                                                { text: 'Dr. Pablo Quintero', bold: true, color: '#522D8A', fontSize: 4},
                                                { text: 'Presidente', bold: true, color: '#522D8A', fontSize: 4},
                                            ]
                                        },
                                        {
                                            stack: [
                                                { image: 'escudo', fit: [20, 10], alignment: 'center'},
                                                { text: 'Dra. Doyi S. Hernandez', bold: true, color: '#522D8A', fontSize: 4},
                                                { text: 'Sec. de Organización', bold: true, color: '#522D8A', fontSize: 4},
                                            ]
                                        }
                                    ],
                                    marginTop: 3, fontSize: 7
                                },
                            ],
                            width: 'auto',
                            marginLeft: 20
                        }
                    ]
                },{ text: ''},{ text: '' },
                { columns: [
                        { image: 'escudo_borde', width: 75, marginLeft: -39.5, marginTop: 20.5, marginBottom: -23},
                    ],
                    fillColor: '#522D8A'
                }, { text: ''}],
                [{ text: ''}, {colSpan: 2, text: carnet_profesion, fontSize: 10, bold: true, marginTop: 3 , alignment: 'right', fillColor: '#522D8A', color: '#FFFFFF'}, { text: '' },
                    {
                        colSpan: 2,
                        svg: `  <svg viewBox="0 0 115.3 20" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <defs>
                                        <path d="M16 4.588l2.833 8.719H28l-7.416 5.387 2.832 8.719L16 22.023l-7.417 5.389 2.833-8.719L4 13.307h9.167L16 4.588z" fill="#ffffff" id="d"/>
                                    </defs>
                                    <path d="M0 0 L0 0 L0 20 L45 20 L65 0" fill="#522D8A" stroke="#522D8A"/>
                                    <path d="M74 0 L74 0 L55 20 L115.3 20 L115.3 0" fill="#cf142b" stroke="#cf142b"/>
                                    <path d="M67.4 6.67 L67.4 6.67 L61.4 13.27 L115.3 13.27 L115.3 6.67" fill="#00247d" stroke="#00247d"/>
                                    <path d="M74 0 L74 0 L67.4 6.67 L115.3 6.67 L115.3 0" fill="#fc0" stroke="#fc0"/>
                                    <use xlink:href="#d" transform="scale(0.15) translate(480,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(510,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(540,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(570,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(600,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(630,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(660,50)" />
                                    <use xlink:href="#d" transform="scale(0.15) translate(690,50)" />
                                </svg>` , padding: [0,0,0,0], margin: [-1,-1,-1,-1]},
                    { text: ''}, { text: ''}],
                [{ text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}]
            ]
        },
        layout: 'dashedBorderLayout',
        margin: [162, 40, 162, 0]
    },
    {
        table: {
            widths: [1,'*', 'auto', '*', 'auto', 1],
            body: [
                [{ text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}, { text: ''}],
                [{ text: ''},{ colSpan: 4,
                    columns: [
                        {   
                            stack: [
                                { qr: carnet_url, fit: '70', marginTop: 2, alignment:'center'},
                                { text: 'Verifique la validez de este', alignment: 'center', bold: true, marginTop: 8, fontSize: 5},
                                { text: 'carnet escaneando el codigo', alignment: 'center', bold: true, fontSize: 5},
                                { text: 'QR', alignment: 'center', bold: true, fontSize: 5},
                            ],
                            width: 'auto',
                        },
                        {   
                            stack: [
                                { text: 'Asegúrate de ser atendido', bold: true, italics: true, marginTop: 4, fontSize: 10},
                                { text: 'por un Profesional', bold: true, italics: true, marginTop: 2, fontSize: 10},
                                { text: 'Acreditado por el Colegio', bold: true, italics: true, marginTop: 2, fontSize: 10},
                                { text: 'de Odontólogos de', bold: true, italics: true, marginTop: 2, fontSize: 10},
                                { text: 'Venezuela', bold: true, italics: true, marginTop: 2, fontSize: 10},
                                { image: 'escudoBW', width: 50, alignment: 'right', marginTop: 2},
                            ],
                            width: '*',
                            marginLeft: 20
                        }
                    ]
                },{ text: ''},{ text: '' },{ text: ''}, { text: ''}]
            ]
        },
        layout: 'dashedBorderLayoutSecond',
        margin: [162, 10, 162, 0]
    }
];

const pageMarginsDefault = [ 20, 30, 20, 30 ];

const info_document = {
	title: 'Carnet - Ricardo Bruzual',
	author: 'COLEGIO DE ODONTÓLOGOS DE VENEZUELA',
	subject: 'Carnet - Odontología',
	keywords: 'carnet',
};

DocumentDefinition = {
        pageOrientation: 'portrait',
        pageSize: 'FOLIO',
        pageMargins: pageMarginsDefault,
        info: info_document,
        content: initialContent,
        styles: {
            header: {
                fontSize: 18,
                fontWeight: 'bold',
            }
        },
        defaultStyle: {
            font: 'Tinos'
        },
        images: {
            escudo: 'http://localhost:3000/escudo.png',    //Logo de COV
            escudoBW: 'http://localhost:3000/escudo_bw.png', //Logo de COV Blanco y Negro
            escudo_borde: 'http://localhost:3000/escudo_borde.png', //Logo de COV con borde Blanco
            carnet: carnet_foto // Foto tipo carne
        },
        patterns: {
            stripe45d: {
                boundingBox: [1, 1, 4, 4],
                xStep: 3,
                yStep: 3,
                pattern: "1 w 0 1 m 4 5 l s 2 0 m 5 3 l s",
            },
        }
    };