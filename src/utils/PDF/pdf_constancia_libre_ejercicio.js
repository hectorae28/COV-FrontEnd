const pdf_nro_documento = "WO-010279"
const pdf_nombre_persona = "RICARDO JESÚS BRUZUAL HERRERA";
const pdf_ci_persona = "21.073.816";
const pdf_member = "16.348";
const pdf_consultorios = '"UEFA", WERTYERTYERTYERTYER';

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
                text: 'Constancia de Libre Ejercicio',
                fontSize: 21.5,
                alignment: 'center',
                bold: true,
                width: 'auto',
                marginTop: 10
            },
            { text: '', width: '*'},
        ],
        marginTop: 10,
    },
    {
      text: [
        {
          text: '        El suscrito, '
        },
        { text: 'Dr. PABLO QUINTERO, C.I. Nº 13.303.357, Presidente del Colegio de Odontólogos de Venezuela', bold: true },
        ' según consta en Documento Inscrito por ante la ',
        { text: 'Oficina Subalterna de Registro Publico del Primer Circuito del Municipio Libertador del Distrito Capital Caracas,', bold: true },
        ' bajo el ',
		{ text: 'numero 51 Tomo 5 Protocolo 1 de fecha 08/02/1954. Electos en Acto de Votación celebrado a Nivel Nacional en fecha 29 de Noviembre del 2005, cuyos resultados fueron transcritos en Acta de Totalización, Adjudicación y Proclamación y Adjuntados al Acta de Sección de fecha 07/12/2005, y aprobado por el Directorio del Consejo Nacional Electoral y por la Sala Electoral del Tribunal Supremo de Justicia;', bold: true },
        ' Certificamos, que: el ',
        { text: 'Dr. (a) '+pdf_nombre_persona, bold: true },
        ', portador(a) de la ',
        { text: 'C.I. '+pdf_ci_persona, bold: true },
        ', inscrita bajo el Nº de ',
        { text: 'COV '+pdf_member, bold: true },
        ', ha venido ejerciendo libremente en forma continua, su profesión, como ODONTOLOGO GENERAL, en los consultorios que se nombran a continuación: ',
        { text: pdf_consultorios, bold: true },
        ', desde hace 0 años continuamente hasta la presente fecha, por sus propios medios y con equipo de su propiedad teniendo en ese entonces un sueldo de aproximadamente ciento veintitrÉs bolívares soberanos (123,00). la misma no se encuentra inhabilitado (a) para ejercer su profesión como odontólogo con pleno derecho a desplazarse como odontólogo (a) en todo el territorio nacional sin ninguna restricción.',
      ],
	  lineHeight: 1.5,
	  fontSize: 11,
      alignment: 'justify',
      margin: [60, 20, 60, 0]
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
	title: 'Constancia de Libre Ejercicio - Ricardo Bruzual',
	author: 'COLEGIO DE ODONTÓLOGOS DE VENEZUELA',
	subject: 'Constancia de Libre Ejercicio',
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