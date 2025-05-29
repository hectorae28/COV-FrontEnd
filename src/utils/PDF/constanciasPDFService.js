// Importación dinámica para evitar problemas de SSR
let pdfMake;
let pdfFonts;

// Fallback con importación estática
let staticPdfMake;
let staticPdfFonts;

if (typeof window !== 'undefined') {
  try {
    staticPdfMake = require('pdfmake/build/pdfmake');
    staticPdfFonts = require('pdfmake/build/vfs_fonts');
  } catch (error) {
    console.warn('No se pudieron cargar las importaciones estáticas:', error);
  }
}

const initializePdfMake = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Intentar importación dinámica primero
      if (!pdfMake) {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          pdfMake = pdfMakeModule.default || pdfMakeModule;
          pdfMake.tableLayouts = contentLayouts;
        } catch (error) {
          console.warn('Importación dinámica falló, usando estática:', error);
          pdfMake = staticPdfMake;
        }
      }
      
      if (!pdfFonts) {
        try {
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
          pdfFonts = pdfFontsModule.default || pdfFontsModule;
        } catch (error) {
          console.warn('Importación dinámica de fuentes falló, usando estática:', error);
          pdfFonts = staticPdfFonts;
        }
      }
      
      if (!pdfMake) {
        throw new Error('No se pudo cargar pdfMake con ningún método');
      }
      
      if (!pdfMake.vfs && pdfFonts) {
        // Manejar diferentes estructuras de importación de fuentes
        let fonts;
        if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
          fonts = pdfFonts.pdfMake.vfs;
        } else if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
          fonts = pdfFonts.default.pdfMake.vfs;
        } else if (pdfFonts.vfs) {
          fonts = pdfFonts.vfs;
        } else {
          console.warn('Estructura de fuentes no reconocida:', pdfFonts);
          fonts = pdfFonts;
        }
        
        if (fonts) {
          pdfMake.vfs = fonts;
          
          //Configurar fuentes disponibles
          pdfMake.fonts = {
            Roboto: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Medium.ttf',
              italics: 'Roboto-Italic.ttf',
              bolditalics: 'Roboto-MediumItalic.ttf'
            }
          };
        }
      }
      
      return pdfMake;
    } catch (error) {
      console.error('Error al inicializar pdfMake:', error);
      throw new Error('No se pudo inicializar pdfMake');
    }
  }
  return null;
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
                {text: 'C.I. 13.303.357', fontSize: 12, alignment: 'center', bold: true}
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
							{text: 'C.I. 13.303.357', fontSize: 12, alignment: 'center', bold: true}
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
                                {text: 'C.I. 13.303.357', fontSize: 12, alignment: 'center', bold: true}
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

const getCarnetContent = (data) => {
  const formatDateCarnet = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fechaEmision = formatDateCarnet(data.fecha_emision || new Date());
  const fechaVencimiento = formatDateCarnet(data.fecha_vencimiento || new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
  
  return [
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
          [{ text: ''}, {colSpan: 4, text: data.universidad || 'Universidad Central de Venezuela', fontSize: 4, bold: true , alignment: 'center', fillColor: '#522D8A', color: '#FFFFFF'}, { text: '' }, { text: ''}, { text: ''}, { text: ''}],
          [{ text: ''},{ colSpan: 3,
            columns: [
              {   
                stack: [
                  { image: 'carnet_foto', fit: [50,60], marginLeft: 4},
                  { columns: [{ text: 'C.O.V', bold: true, color: '#522D8A', fontSize: 7}, { text: data.colegiado_numero, bold: true}], marginTop: 3, fontSize: 7, alignment: 'center'},
                  { columns: [{ text: 'M.P.P.S', bold: true, color: '#522D8A', fontSize: 7}, { text: data.mpps_numero, bold: true}], marginTop: 3, fontSize: 7, alignment: 'center'}
                ],
                width: 'auto',
                paddingLeft: 10
              },
              {   
                stack: [
                  { text: `${data.colegiado_primer_apellido} ${data.colegiado_segundo_apellido || ''}`.trim().toUpperCase(), bold: true, marginTop: 2, fontSize: 7},
                  { text: 'Apellidos', bold: true, color: '#522D8A', marginTop: 1, marginBottom: 1, fontSize: 7},
                  { text: data.colegiado_nombre.toUpperCase(), bold: true, marginTop: 2, fontSize: 7},
                  { text: 'Nombres', bold: true, color: '#522D8A', marginTop: 1, marginBottom: 1, fontSize: 7},
                  { text: data.colegiado_identificacion, bold: true, marginTop: 2, fontSize: 7},
                  { text: 'Cédula de Identidad', bold: true, color: '#522D8A', marginTop: 2, marginBottom: 1, fontSize: 7},
                  { columns: [{ text: 'F. Emisión:', bold: true, color: '#522D8A'}, { text: fechaEmision, bold: true}], marginTop: 3, fontSize: 7},
                  { columns: [{ text: 'Válido Hasta:', bold: true, color: '#522D8A'}, { text: fechaVencimiento, bold: true}], marginTop: 3, fontSize: 7},
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
          [{ text: ''}, {colSpan: 2, text: (data.colegiado_profesion || 'ODONTÓLOGO').toUpperCase(), fontSize: 10, bold: true, marginTop: 3 , alignment: 'right', fillColor: '#522D8A', color: '#FFFFFF'}, { text: '' },
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
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 1 : (i === 3) ? 2 : 0;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body[0].length) ? 1 : 0;
        },
        hLineStyle: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? { dash: { length: 5, space: 3 } } : null;
        },
        vLineStyle: function (i, node) {
          return (i === 0 || i === node.table.body[0].length) ? { dash: { length: 5, space: 3 } } : null;
        },
        hLineColor: function (i, node){
            return (i === 3) ? '#FFF' : '#000';
        },
        paddingLeft: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 1 : 1; },
        paddingRight: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 1 : 1; },
        paddingTop: function (i, node) { return (i === 0 || i === node.table.body.length) ? 1 : (i === 4) ? 5 : 1; },
        paddingBottom: function (i, node) { return (i === 0 || i === node.table.body.length) ? 1 : (i === 4) ? 5 : 1; }
      },
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
                  { qr: data.url_verificacion || 'https://colegiadoscov.sistemasjrpm.com/searchs', fit: '70', marginTop: 2, alignment:'center'},
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
      layout: {
        hLineWidth: function (i, node) {
          // Líneas horizontales: 1 para la primera y la última fila, 0 para las internas
          return (i === 0 || i === node.table.body.length) ? 1 : (i === 3) ? 2 : 0;
        },
        vLineWidth: function (i, node) {
          // Líneas verticales: 1 para la primera y la última columna, 0 para las internas
          return (i === 0 || i === node.table.body[0].length) ? 1 : 0;
        },
        hLineStyle: function (i, node) {
          // Estilo punteado solo para la primera y la última fila
          return (i === 0 || i === node.table.body.length) ? { dash: { length: 5, space: 3 } } : null;
        },
        vLineStyle: function (i, node) {
          // Estilo punteado solo para la primera y la última columna
          return (i === 0 || i === node.table.body[0].length) ? { dash: { length: 5, space: 3 } } : null;
        },
        hLineColor: function (i, node){
            return (i === 3) ? '#FFF' : '#000';
        },
        paddingLeft: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 5 : 4; },
        paddingRight: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 5 : 4; },
        paddingTop: function (i, node) { return (i === 0) ? 13 : 4; },
        paddingBottom: function (i, node) { return (i === node.table.body.length-1) ? 13 : 4; }
    },
      margin: [162, 10, 162, 0]
    }
  ];
};

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

const carnetLayout = {
  dashedBorderLayout: {
      hLineWidth: function (i, node) {
        // Líneas horizontales: 1 para la primera y la última fila, 0 para las internas
        return (i === 0 || i === node.table.body.length) ? 1 : (i === 3) ? 2 : 0;
      },
      vLineWidth: function (i, node) {
        // Líneas verticales: 1 para la primera y la última columna, 0 para las internas
        return (i === 0 || i === node.table.body[0].length) ? 1 : 0;
      },
      hLineStyle: function (i, node) {
        // Estilo punteado solo para la primera y la última fila
        return (i === 0 || i === node.table.body.length) ? { dash: { length: 5, space: 3 } } : null;
      },
      vLineStyle: function (i, node) {
        // Estilo punteado solo para la primera y la última columna
        return (i === 0 || i === node.table.body[0].length) ? { dash: { length: 5, space: 3 } } : null;
      },
      hLineColor: function (i, node){
          return (i === 3) ? '#FFF' : '#000';
      },
      paddingLeft: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 1 : 1; },
      paddingRight: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 1 : 1; },
      paddingTop: function (i, node) { return (i === 0 || i === node.table.body.length) ? 1 : (i === 4) ? 5 : 1; },
      paddingBottom: function (i, node) { return (i === 0 || i === node.table.body.length) ? 1 : (i === 4) ? 5 : 1; }
  },
  dashedBorderLayoutSecond: {
      hLineWidth: function (i, node) {
        // Líneas horizontales: 1 para la primera y la última fila, 0 para las internas
        return (i === 0 || i === node.table.body.length) ? 1 : (i === 3) ? 2 : 0;
      },
      vLineWidth: function (i, node) {
        // Líneas verticales: 1 para la primera y la última columna, 0 para las internas
        return (i === 0 || i === node.table.body[0].length) ? 1 : 0;
      },
      hLineStyle: function (i, node) {
        // Estilo punteado solo para la primera y la última fila
        return (i === 0 || i === node.table.body.length) ? { dash: { length: 5, space: 3 } } : null;
      },
      vLineStyle: function (i, node) {
        // Estilo punteado solo para la primera y la última columna
        return (i === 0 || i === node.table.body[0].length) ? { dash: { length: 5, space: 3 } } : null;
      },
      hLineColor: function (i, node){
          return (i === 3) ? '#FFF' : '#000';
      },
      paddingLeft: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 5 : 4; },
      paddingRight: function (i, node) { return (i === 0 || i === node.table.body[0].length-1) ? 1 : (i === 1) ? 5 : 4; },
      paddingTop: function (i, node) { return (i === 0) ? 13 : 4; },
      paddingBottom: function (i, node) { return (i === node.table.body.length-1) ? 13 : 4; }
  }
};

export const generateConstanciaPDF = (data, tipoConstancia) => {
  let content = [];
  let fileName = '';
  let docDefinition = {};
  
  switch(tipoConstancia) {
    case 'inscripcion_cov':
      content = getConstanciaInscripcionContent(data);
      fileName = `Constancia_Inscripcion_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'continuidad_laboral':
      content = getConstanciaContinuidadLaboralContent(data);
      fileName = `Constancia_Continuidad_Laboral_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'libre_ejercicio':
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Libre_Ejercicio_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'deontologia_odontologica':
      content = getConstanciaDeontologiaOdontologicaContent(data);
      fileName = `Constancia_Deontologia_Odontologica_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'solvencia':
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Solvencia_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'declaracion_habilitacion':
      content = getConstanciaLibreEjercicioContent(data);
      fileName = `Constancia_Declaracion_Habilitacion_${data.colegiado_numero}.pdf`;
      docDefinition = {
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
      break;
    case 'carnet':
      content = getCarnetContent(data);
      fileName = `Carnet_${data.colegiado_numero}_${data.colegiado_nombre}_${data.colegiado_primer_apellido}.pdf`;
      docDefinition = {
        pageOrientation: 'portrait',
        pageSize: 'FOLIO',
        pageMargins: [20, 30, 20, 30],
        info: {
          title: `Carnet - ${data.colegiado_nombre} ${data.colegiado_primer_apellido}`,
          author: 'COLEGIO DE ODONTÓLOGOS DE VENEZUELA',
          subject: 'Carnet - Odontología',
          keywords: 'carnet',
        },
        content: content,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          }
        },
        defaultStyle: {
          font: 'Roboto'
        },
        images: {
          escudo: 'http://localhost:3000/escudo.png',
          escudoBW: 'http://localhost:3000/escudo_bw.png',
          escudo_borde: 'http://localhost:3000/escudo_borde.png',
          carnet_foto: `${process.env.NEXT_PUBLIC_BACK_HOST}${data.foto_url}` || 'http://localhost:3000/carnet.png'
        },
        patterns: {
          stripe45d: {
            boundingBox: [1, 1, 4, 4],
            xStep: 3,
            yStep: 3,
            pattern: "1 w 0 1 m 4 5 l s 2 0 m 5 3 l s",
          },
        },
      };
      break;
    default:
      throw new Error(`Tipo de documento no soportado: ${tipoConstancia}`);
  }

  return { docDefinition, fileName };
};

export const downloadPDF = async (docDefinition, fileName) => {
  try {
    const pdfMakeInstance = await initializePdfMake();
    if (pdfMakeInstance) {
      pdfMakeInstance.createPdf(docDefinition).download(fileName);
    } else {
      throw new Error('No se pudo inicializar pdfMake - ejecutándose en servidor');
    }
  } catch (error) {
    console.error('Error detallado al descargar PDF:', error);
    throw new Error(`Error al descargar PDF: ${error.message}`);
  }
};

export const openPDF = async (docDefinition) => {
  try {
    const pdfMakeInstance = await initializePdfMake();
    if (pdfMakeInstance) {
      return new Promise((resolve, reject) => {
        try {
          pdfMakeInstance.createPdf(docDefinition).getDataUrl((dataUrl) => {
            resolve(dataUrl);
          });
        } catch (error) {
          reject(error);
        }
      });
    } else {
      throw new Error('No se pudo inicializar pdfMake - ejecutándose en servidor');
    }
  } catch (error) {
    console.error('Error detallado al generar PDF:', error);
    throw new Error(`Error al generar PDF: ${error.message}`);
  }
}; 