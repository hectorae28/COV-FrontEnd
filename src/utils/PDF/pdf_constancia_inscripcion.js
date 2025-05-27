const pdf_nro_documento = "WO-010279"
const pdf_nombre_persona = "RICARDO JESÚS BRUZUAL HERRERA";
const pdf_ci_persona = "21.073.816";
const pdf_member = "16.348";
const pdf_profesion = "ODONTOLOGO";
const pdf_book = "4"
const pdf_folio = "144"
const pdf_fecha_ingreso = "09 DE JULIO 2011"
const pdf_dia_expedicion = '15';
const pdf_mes_expedicion = '05';
const pdf_anho_expedicion = '2025';

const pdf_codigo_documento = '682620076d233';


const initialContent = [
    {
        table: {
            widths: [10, 50, '*'],
            body: [
                [
                    { text: ''},
                    { image: 'escudo', width: 60 },
                    {  
                        stack: [
                            { 
                                text: 'COLEGIO DE ODONTOLOGOS DE VENEZUELA',
                                fontSize: 18.5,
                                alignment: 'center',
                                bold: true
                            },
                            { 
                                text: 'RIF J-00041277-4',
                                fontSize: 10,
                                alignment: 'center',
                                bold: true
                            }
                        ]
                    }
                ],
                [
                    { text: ''},
                    {
                        columns: [
                            { text: 'Nº ', fontSize: 12, alignment: 'center', fillColor: '#522D8A', width: 'auto', marginRight: 5},
                            { text: pdf_nro_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
                        ]
                    },
                    { text: ''},
                ]
            ]
        },
        layout: 'noBorders',
        margin: [30, 40, 30, 0]
    },
    {
        columns: [
            { text: '', width: '*'},
            { 
                text: 'Constancia de Inscripción',
                fontSize: 21.5,
                alignment: 'center',
                bold: true,
                width: 'auto',
                marginTop: 20
            },
            { text: '', width: '*'},
        ],
        marginTop: 10,
    },
    {
      text: [
        {
          text: '        El suscrito Presidente del Colegio de Odontologos de Venezuela, por medio de la presente hace constar que el ciudadano(a)'
        },
        { text: pdf_nombre_persona, bold: true },
        ', titular de la ',
        { text: 'C.I. '+pdf_ci_persona, bold: true },
        ', se encuentra inscrito en esta institución como ',
		{ text: pdf_profesion, bold: true },
        ', bajo el número de ',
        { text: 'COV. '+pdf_member, bold: true },
        ', del libro N° ',
        { text: pdf_book, bold: true },
        ' y del folio N° ',
        { text: pdf_folio, bold: true },
        ', desde la fecha ',
        { text: pdf_fecha_ingreso, bold: true },
      ],
	  lineHeight: 2,
	  fontSize: 11,
      alignment: 'justify',
      margin: [60, 40, 60, 0]
    },
    {
      text: [
        {
          text: '        Constancia que se expide a petición de la parte interesada, en Caracas a los '
        },
        { text: pdf_dia_expedicion, bold: true },
        ' días del mes ',
        { text: pdf_mes_expedicion, bold: true },
        ' del año ',
        { text: pdf_anho_expedicion, bold: true },
        '.'
      ],
	  lineHeight: 2,
	  fontSize: 11,
      alignment: 'justify',
      margin: [60, 10, 60, 0]
    },
	{
        table: {
            widths: ['*', 'auto', '*'],
            body: [
                [
                    { text: ''},
					{
						stack: [
							{text: 'ATENTAMENTE', fontSize: 12, alignment: 'center', bold: true},
							{text: 'POR LA JUNTA DIRECTIVA DEL', fontSize: 12, alignment: 'center', bold: true},
							{text: 'COLEGIO DE ODONTOLOGOS DE VENEZUELA', fontSize: 12, alignment: 'center', bold: true}
						]
					},
                    { text: ''},
                ]
            ]
        },
        layout: 'noBorders',
        margin: [30, 20, 30, 0]
    },
	{
        table: {
            widths: ['*',60,'auto',60, '*'],
            body: [
                [
                    { text: ''},
                    { text: ''},
					{
						stack: [
							{ image: 'firma_presidente', width: 100, alignment: 'center', bold: true},
							{text: '       Dr. Pablo Quintero       ', fontSize: 12, alignment: 'center', decoration: ['overline'], bold: true},
							{text: 'Presidente', fontSize: 12, alignment: 'center', bold: true},
							{text: 'M.P.P.S. No. 18.520', fontSize: 12, alignment: 'center', bold: true},
							{text: 'C.O.V. No. 18.990', fontSize: 12, alignment: 'center', bold: true},
							{text: 'Identity Card No. 13.303.357', fontSize: 12, alignment: 'center', bold: true}
						],
						alignment: 'right'
					},
                    { image: 'sello_cov', width: 60, marginTop:20, marginLeft: 20},
                    { text: ''},
                ]
            ]
        },
        layout: 'noBorders',
        margin: [30, 10, 30, 0]
    }
];

const footer = {
    table: {
        widths: ['*',63,'auto',63, '*'],
		body: [
			[
				{ text: ''},
				{ text: ''},
				{
					stack: [
						{
							text: [
								{text: 'El documento podrá ser validado en '},
								{text: 'https://colegiadoselcov.com/verificar-documentos', link: 'https://colegiadoselcov.com/'+pdf_codigo_documento, decoration: ['underline'], color: '#0000EE'},
							],
							alignment: 'center',
							fontSize: 7.5
						},
						{text: 'Av. Guanare, Urbanización Las Palmas, Quinta Colegio De Odontólogos, Caracas - Venezuela.', fontSize: 7.5, alignment: 'center'},
						{
							text: [
								{text: 'Telfs: (0212) 781-22 67 / (0212) 793-56 87 '},
								{text: 'www.elcov.com.ve', link: 'https://www.elcov.com.ve', bold: true},
							],
							alignment: 'center',
							fontSize: 7.5
						},
					],
					marginTop: 20
				},
				{
					stack: [
						{text: pdf_codigo_documento, fontSize: 7.5, alignment: 'center'},
						{ qr: pdf_codigo_documento, fit: '65', alignment: 'center'}
					],
					marginLeft: 10
				},
				{ text: ''}
			]
		]
	},
    layout: 'noBorders',
}

const pageMarginsDefault = [ 20, 30, 20, 100 ];

const info_document = {
	title: 'Constancia de Inscripción - Ricardo Bruzual',
	author: 'COLEGIO DE ODONTÓLOGOS DE VENEZUELA',
	subject: 'Constancia de Inscripción',
	keywords: 'constancia',
};

DocumentDefinition = {
        pageOrientation: 'portrait',
        pageSize: 'A4',
        pageMargins: pageMarginsDefault,
        info: info_document,
        content: initialContent,
        footer: footer,
        defaultStyle: {
            font: 'Tinos'
        },
        images: {
            escudo: 'http://localhost:3000/escudo.png',
			firma_presidente: 'http://localhost:3000/FirmaPablo.png',
			sello_cov: 'http://localhost:3000/sello_colegio.png'
        }
    };