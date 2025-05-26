// Importación dinámica para evitar problemas de SSR
import pdfMake from 'pdfmake/build/pdfmake';

import pdfFonts from 'pdfmake/build/vfs_fonts';


const initializePdfMake = async () => {
  if (typeof window !== 'undefined' && !pdfMake) {
    pdfMake.vfs = pdfFonts.default.pdfMake.vfs;
  }
  return pdfMake;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return { day, month, year };
};

const getConstanciaInscripcionContent = (data) => {
  const fechaIngreso = formatDate(data.colegiado_fecha_de_inscripcion);
  const fechaExpedicion = formatDate(new Date());
  
  return [
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
                { text: data.codigo_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
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
          text: '        El suscrito Presidente del Colegio de Odontologos de Venezuela, por medio de la presente hace constar que el ciudadano(a) '
        },
        { text: `${data.colegiado_nombre} ${data.colegiado_primer_apellido} ${data.colegiado_segundo_apellido || ''}`.trim(), bold: true },
        ', titular de la ',
        { text: `C.I. ${data.colegiado_identificacion}`, bold: true },
        ', se encuentra inscrito en esta institución como ',
        { text: 'ODONTOLOGO', bold: true },
        ', bajo el número de ',
        { text: `COV. ${data.colegiado_numero}`, bold: true },
        ', del libro N° ',
        { text: data.colegiado_libro, bold: true },
        ' y del folio N° ',
        { text: data.colegiado_folio, bold: true },
        ', desde la fecha ',
        { text: `${fechaIngreso.day} DE ${fechaIngreso.month} ${fechaIngreso.year}`, bold: true },
      ],
      lineHeight: 2,
      fontSize: 11,
      alignment: 'justify',
      margin: [60, 40, 60, 0]
    },
    {
      text: [
        {
          text: '        Constancia que se expide a petición de la parte interesada, en Caracas a los '
        },
        { text: fechaExpedicion.day, bold: true },
        ' días del mes ',
        { text: fechaExpedicion.month, bold: true },
        ' del año ',
        { text: fechaExpedicion.year.toString(), bold: true },
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
                { text: '       Dr. Pablo Quintero       ', fontSize: 12, alignment: 'center', decoration: ['overline'], bold: true},
                {text: 'Presidente', fontSize: 12, alignment: 'center', bold: true},
                {text: 'M.P.P.S. No. 18.520', fontSize: 12, alignment: 'center', bold: true},
                {text: 'C.O.V. No. 18.990', fontSize: 12, alignment: 'center', bold: true},
                {text: 'Identity Card No. 13.303.357', fontSize: 12, alignment: 'center', bold: true}
              ],
              alignment: 'right'
            },
            { text: ''},
            { text: ''},
          ]
        ]
      },
      layout: 'noBorders',
      margin: [30, 10, 30, 0]
    }
  ];
};

const getConstanciaContinuidadLaboralContent = (data) => {
  const fechaExpedicion = formatDate(new Date());
  
  return [
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
                { text: data.codigo_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
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
          text: 'Constancia de Continuidad Laboral',
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
          text: '        El suscrito Presidente del Colegio de Odontologos de Venezuela, por medio de la presente hace constar que el ciudadano(a) '
        },
        { text: `${data.colegiado_nombre} ${data.colegiado_primer_apellido} ${data.colegiado_segundo_apellido || ''}`.trim(), bold: true },
        ', titular de la ',
        { text: `C.I. ${data.colegiado_identificacion}`, bold: true },
        ', inscrito en esta institución como ',
        { text: 'ODONTOLOGO', bold: true },
        ', bajo el número de ',
        { text: `COV. ${data.colegiado_numero}`, bold: true },
        ', se encuentra al día con sus obligaciones gremiales y en pleno ejercicio de sus funciones profesionales.'
      ],
      lineHeight: 2,
      fontSize: 11,
      alignment: 'justify',
      margin: [60, 40, 60, 0]
    },
    {
      text: [
        {
          text: '        Constancia que se expide a petición de la parte interesada, en Caracas a los '
        },
        { text: fechaExpedicion.day, bold: true },
        ' días del mes ',
        { text: fechaExpedicion.month, bold: true },
        ' del año ',
        { text: fechaExpedicion.year.toString(), bold: true },
        '.'
      ],
      lineHeight: 2,
      fontSize: 11,
      alignment: 'justify',
      margin: [60, 10, 60, 0]
    }
  ];
};

const getConstanciaLibreEjercicioContent = (data) => {
  const fechaExpedicion = formatDate(new Date());
  
//   return [
//     {
//       table: {
//         widths: [10, 50, '*'],
//         body: [
//           [
//             { text: ''},
//             { image: 'escudo', width: 60 },
//             {  
//               stack: [
//                 { 
//                   text: 'COLEGIO DE ODONTOLOGOS DE VENEZUELA',
//                   fontSize: 18.5,
//                   alignment: 'center',
//                   bold: true
//                 },
//                 { 
//                   text: 'RIF J-00041277-4',
//                   fontSize: 10,
//                   alignment: 'center',
//                   bold: true
//                 }
//               ]
//             }
//           ],
//           [
//             { text: ''},
//             {
//               columns: [
//                 { text: 'Nº ', fontSize: 12, alignment: 'center', fillColor: '#522D8A', width: 'auto', marginRight: 5},
//                 { text: data.codigo_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
//               ]
//             },
//             { text: ''},
//           ]
//         ]
//       },
//       layout: 'noBorders',
//       margin: [30, 40, 30, 0]
//     },
//     {
//       columns: [
//         { text: '', width: '*'},
//         { 
//           text: 'Constancia de Libre Ejercicio',
//           fontSize: 21.5,
//           alignment: 'center',
//           bold: true,
//           width: 'auto',
//           marginTop: 20
//         },
//         { text: '', width: '*'},
//       ],
//       marginTop: 10,
//     },
//     {
//       text: [
//         {
//           text: '        El suscrito Presidente del Colegio de Odontologos de Venezuela, por medio de la presente hace constar que el ciudadano(a) '
//         },
//         { text: `${data.colegiado_nombre} ${data.colegiado_primer_apellido} ${data.colegiado_segundo_apellido || ''}`.trim(), bold: true },
//         ', titular de la ',
//         { text: `C.I. ${data.colegiado_identificacion}`, bold: true },
//         ', inscrito en esta institución como ',
//         { text: 'ODONTOLOGO', bold: true },
//         ', bajo el número de ',
//         { text: `COV. ${data.colegiado_numero}`, bold: true },
//         ', se encuentra habilitado para el libre ejercicio de la profesión odontológica en todo el territorio nacional.'
//       ],
//       lineHeight: 2,
//       fontSize: 11,
//       alignment: 'justify',
//       margin: [60, 40, 60, 0]
//     },
//     {
//       text: [
//         {
//           text: '        Constancia que se expide a petición de la parte interesada, en Caracas a los '
//         },
//         { text: fechaExpedicion.day, bold: true },
//         ' días del mes ',
//         { text: fechaExpedicion.month, bold: true },
//         ' del año ',
//         { text: fechaExpedicion.year.toString(), bold: true },
//         '.'
//       ],
//       lineHeight: 2,
//       fontSize: 11,
//       alignment: 'justify',
//       margin: [60, 10, 60, 0]
//     }
//   ];
  return [
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
                            { text: data.codigo_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
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
        { text: 'Dr. (a) '+data.colegiado_nombre+' '+data.colegiado_primer_apellido+' '+data.colegiado_segundo_apellido, bold: true },
        ', portador(a) de la ',
        { text: 'C.I. '+data.colegiado_identificacion, bold: true },
        ', inscrita bajo el Nº de ',
        { text: 'COV '+data.colegiado_numero, bold: true },
        ', ha venido ejerciendo libremente en forma continua, su profesión, como ODONTOLOGO GENERAL, en los consultorios que se nombran a continuación: ',
        { text: data.colegiado_consultorios, bold: true },
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
]
};
const getConstanciaDeontologiaOdontologicaContent = (data) => {
    return[
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
                                { text: data.codigo_documento, fontSize: 12, alignment: 'left', decoration: ['underline'], width: 'auto'}
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
                    text: 'Constancia Deontología Odontológica',
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
              text: '        El suscrito Presidente del Colegio de Odontólogos de Venezuela, por medio de la presente hace constar que el ciudadano (a) '
            },
            { text: 'Dr. (a) '+data.colegiado_nombre+' '+data.colegiado_primer_apellido+' '+data.colegiado_segundo_apellido, bold: true },
            ', titular de la C.I. ',
            { text: data.colegiado_identificacion, bold: true },
            ', ha cumplido correctamente con la Ética y el reglamento exigido por este colegio desde el inicio de su agremiación hasta la fecha por lo que tiene derecho de ejercer como ',
            { text: data.colegiado_profesion, bold: true },
            ' en todo el territorio nacional sin restricción alguna.'
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
            { text: data.fecha_exp.day, bold: true },
            ' días del mes ',
            { text: data.fecha_exp.month, bold: true },
            ' del año ',
            { text: data.fecha_exp.year, bold: true },
            ' en todo el territorio nacional sin restricción alguna.'
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
}

const getFooter = (codigoDocumento) => ({
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
                {text: 'https://colegiadoselcov.com/verificar-documentos', link: `https://colegiadoselcov.com/${codigoDocumento}`, decoration: ['underline'], color: '#0000EE'},
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
            {text: codigoDocumento, fontSize: 7.5, alignment: 'center'},
            { qr: codigoDocumento, fit: '65', alignment: 'center'}
          ],
          marginLeft: 10
        },
        { text: ''}
      ]
    ]
  },
  layout: 'noBorders',
});

export const generateConstanciaPDF = (data, tipoConstancia) => {
  let content = [];
  let fileName = '';
  
  switch(tipoConstancia) {
    case 'inscripcion_cov':
      content = getConstanciaInscripcionContent(data);
      fileName = `Constancia_Inscripcion_${data.colegiado_numero}.pdf`;
      break;
    case 'continuidad_laboral':
      content = getConstanciaContinuidadLaboralContent(data);
      fileName = `Constancia_Continuidad_Laboral_${data.colegiado_numero}.pdf`;
      break;
    case 'libre_ejercicio':
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Libre_Ejercicio_${data.colegiado_numero}.pdf`;
      break;
    case 'deontologia_odontologica':
      // Por ahora usar el mismo template que libre ejercicio
      content = getConstanciaDeontologiaOdontologicaContent(data);
      fileName = `Constancia_Deontologia_Odontologica_${data.colegiado_numero}.pdf`;
      break;
    case 'solvencia':
      // Usar el mismo template que libre ejercicio por ahora
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Solvencia_${data.colegiado_numero}.pdf`;
      break;
    case 'declaracion_habilitacion':
      // Usar el mismo template que libre ejercicio por ahora
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Declaracion_Habilitacion_${data.colegiado_numero}.pdf`;
      break;
    default:
      throw new Error(`Tipo de constancia no soportado: ${tipoConstancia}`);
  }

  const docDefinition = {
    content: content,
    footer: getFooter(data.codigo_documento),
    pageSize: 'LETTER',
    pageMargins: [0, 0, 0, 80],
    images: {
        escudo: 'http://localhost:3000/escudo.png',
        firma_presidente: 'http://localhost:3000/firmaPablo.png',
        sello_cov: 'http://localhost:3000/sello_colegio.png'
    }
  };

  return { docDefinition, fileName };
};

export const downloadPDF = async (docDefinition, fileName) => {
  try {
    const pdfMakeInstance = await initializePdfMake();
    if (pdfMakeInstance) {
      pdfMakeInstance.createPdf(docDefinition).download(fileName);
    } else {
      throw new Error('No se pudo inicializar pdfMake');
    }
  } catch (error) {
    throw new Error(`Error al descargar PDF: ${error.message}`);
  }
};

export const openPDF = async (docDefinition) => {
  try {
    const pdfMakeInstance = await initializePdfMake();
    if (pdfMakeInstance) {
      return new Promise((resolve, reject) => {
        pdfMakeInstance.createPdf(docDefinition).getDataUrl((dataUrl) => {
          resolve(dataUrl);
        });
      });
    } else {
      throw new Error('No se pudo inicializar pdfMake');
    }
  } catch (error) {
    throw new Error(`Error al generar PDF: ${error.message}`);
  }
}; 