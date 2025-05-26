const pdf_nro_documento = "WO-010279"
const pdf_nombre_persona = "RICARDO JESÚS BRUZUAL HERRERA";
const pdf_ci_persona = "21.073.816";
const pdf_member = "16.348";
const pdf_profesion = "DENTIST";
const pdf_dia_expedicion = '15th';
const pdf_mes_expedicion = 'May';
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
                                text: 'DENTAL ASSOCIATION OF VENEZUELA',
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
                text: 'Certificate of Professional Ethics in Dentistry',
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
          text: '        The undersigned President of the Dental Association of Venezuela hereby certifies that '
        },
        { text: 'Dr. '+pdf_nombre_persona, bold: true },
        ', holder of ',
        { text: 'Identity Card No. '+pdf_ci_persona, bold: true },
        ' member ',
        { text: 'No. '+pdf_member, bold: true },
        ', has duly complied with the Code of Ethics required by this Association from the beginning of her membership to date, and therefore she has the right to practise as a ',
        { text: pdf_profesion, bold: true },
        ' throughout the national territory without any restriction whatsoever.'
      ],
	  lineHeight: 2,
	  fontSize: 11,
      alignment: 'justify',
      margin: [60, 40, 60, 0]
    },
    {
      text: [
        {
          text: '        The present certificate was issued at the request of the interested party, in Caracas, on '
        },
        { text: pdf_mes_expedicion, bold: true },
        { text: ' ',},
        { text: pdf_dia_expedicion, bold: true },
        { text: ', ',},
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
							{text: 'YOURS SINCERELY', fontSize: 12, alignment: 'center', bold: true},
							{text: 'THE BOARD OF DIRECTORS OF THE', fontSize: 12, alignment: 'center', bold: true},
							{text: 'DENTAL ASSOCIATION OF VENEZUELA', fontSize: 12, alignment: 'center', bold: true}
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
							{text: 'President', fontSize: 12, alignment: 'center', bold: true},
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
	title: 'Certificate of Professional Ethics - Ricardo Bruzual',
	author: 'DENTAL ASSOCIATION OF VENEZUELA',
	subject: 'Certificate of Professional Ethics',
	keywords: 'Certificate',
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