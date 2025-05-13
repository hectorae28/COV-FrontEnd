// Versión simplificada que mantiene elementos en sus filas específicas
export const organizeElementsIntoRows = (elements) => {
  if (!elements || !elements.length) return [];

  // Si no hay elementos con rowData definido, asignar rowData inicial
  const needsRowData = !elements.some(el => el.rowData);

  // Crear una copia de los elementos con rowData asignado si es necesario
  const elementsWithRowData = needsRowData
    ? assignInitialRowData(elements)
    : [...elements];

  // Agrupar elementos por fila
  const rowMap = {};

  // Agrupar por fila usando rowData
  elementsWithRowData.forEach(element => {
    const rowIndex = element.rowData?.row || 0;
    if (!rowMap[rowIndex]) {
      rowMap[rowIndex] = [];
    }
    rowMap[rowIndex].push(element);
  });

  // Convertir el mapa de filas en un array de filas
  const rows = Object.keys(rowMap)
    .sort((a, b) => Number(a) - Number(b))  // ordenar filas numéricamente
    .map(rowIndex => rowMap[rowIndex]);

  return rows;
};

// Asignar datos de fila inicial a elementos
const assignInitialRowData = (elements) => {
  const result = [];
  let currentRow = 0;

  elements.forEach(element => {
    // Crear una copia del elemento con rowData asignado
    result.push({
      ...element,
      rowData: {
        row: currentRow,
        order: result.filter(el => el.rowData?.row === currentRow).length
      }
    });

    // Cada elemento en su propia fila
    currentRow += 1;
  });

  return result;
};

// Conservar filas al manipular elementos
export const preserveElementsInRows = (elements) => {
  if (!elements || !elements.length) return [];

  // Si ningún elemento tiene rowData, asignar datos iniciales
  if (!elements.some(el => el.rowData)) {
    return assignInitialRowData(elements);
  }

  return elements;
};