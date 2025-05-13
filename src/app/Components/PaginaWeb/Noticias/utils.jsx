// Funciones para el sistema de grid con 4 posiciones por fila
export const organizeElementsIntoRows = (elements) => {
  if (!elements || !elements.length) return [];
  
  // Si no hay elementos con rowData definido, asignar datos iniciales
  const needsRowData = !elements.some(el => el.rowData);
  
  // Crear una copia de los elementos con rowData asignado si es necesario
  const elementsWithRowData = needsRowData 
    ? assignInitialRowData(elements) 
    : [...elements];
  
  // Agrupar elementos por fila
  const rowMap = {};
  
  // Agrupar por fila
  elementsWithRowData.forEach(element => {
    const rowIndex = element.rowData?.row || 0;
    if (!rowMap[rowIndex]) {
      rowMap[rowIndex] = [];
    }
    rowMap[rowIndex].push(element);
  });
  
  // Ordenar elementos dentro de cada fila según su posición en el grid
  Object.keys(rowMap).forEach(rowIndex => {
    rowMap[rowIndex].sort((a, b) => {
      const gridPosA = a.rowData?.gridPosition || 0;
      const gridPosB = b.rowData?.gridPosition || 0;
      return gridPosA - gridPosB;
    });
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
        gridPosition: 0  // Posición inicial en el grid
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

// Convertir ancho de porcentaje a unidades de grid (1-4)
export const elementWidthToGridUnits = (width) => {
  if (typeof width === 'number') return width / 25;
  
  const percentage = parseInt(width, 10);
  switch (percentage) {
    case 25: return 1;
    case 50: return 2;
    case 75: return 3;
    case 100: return 4;
    default: return 4; // Por defecto, usar ancho completo
  }
};

// Convertir unidades de grid a ancho de porcentaje
export const gridUnitsToElementWidth = (units) => {
  return `${units * 25}%`;
};

// Verificar si un elemento cabe en una posición específica dentro de una fila
export const canElementFitInPosition = (elements, rowIndex, gridPosition, elementWidth, elementId = null) => {
  // Si la posición es negativa, no es válida
  if (gridPosition < 0) return false;
  
  // Ancho del elemento en unidades de grid (25% = 1 unidad, 50% = 2 unidades, etc.)
  const width = elementWidthToGridUnits(elementWidth);
  
  // Si la posición + ancho excede 4 unidades (100%), no cabe
  if (gridPosition + width > 4) {
    return false;
  }
  
  // Filtrar elementos en la misma fila
  const rowElements = elements.filter(el => 
    el.rowData?.row === rowIndex && (elementId ? el.id !== elementId : true)
  );
  
  // Verificar si hay conflicto con otros elementos en la fila
  for (const el of rowElements) {
    const elPos = el.rowData?.gridPosition || 0;
    const elWidth = elementWidthToGridUnits(el.style?.width || "100%");
    
    // Comprobar si hay superposición
    if ((gridPosition < elPos + elWidth) && (gridPosition + width > elPos)) {
      return false;
    }
  }
  
  return true;
};

// Encontrar la siguiente posición libre en el grid de una fila
export const findNextAvailableGridPosition = (elements, rowIndex, elementWidth, startFrom = 0) => {
  const width = elementWidthToGridUnits(elementWidth);
  
  // Probar primero posiciones específicas (0, 1, 2, 3) para mejor organización
  for (let position = startFrom; position <= 4 - width; position++) {
    if (canElementFitInPosition(elements, rowIndex, position, elementWidth)) {
      return position;
    }
  }
  
  // Si no hay espacio disponible, devolver -1
  return -1;
};

// Obtener todos los espacios disponibles en una fila
export const getAvailableSpacesInRow = (elements, rowIndex) => {
  const availableSpaces = [];
  
  // Para cada posición posible en la fila (0, 1, 2, 3)
  for (let pos = 0; pos < 4; pos++) {
    // Verificar si hay un elemento que ocupa esta posición
    const isOccupied = elements.some(el => {
      if (el.rowData?.row !== rowIndex) return false;
      
      const gridPos = el.rowData?.gridPosition || 0;
      const width = elementWidthToGridUnits(el.style?.width || "100%");
      
      // Comprobar si la posición actual está dentro del rango del elemento
      return pos >= gridPos && pos < gridPos + width;
    });
    
    if (!isOccupied) {
      availableSpaces.push(pos);
    }
  }
  
  // Agrupar posiciones consecutivas
  const spaces = [];
  let currentSpace = { start: -1, width: 0 };
  
  availableSpaces.forEach((pos, index) => {
    if (currentSpace.start === -1) {
      // Iniciar un nuevo espacio
      currentSpace.start = pos;
      currentSpace.width = 1;
    } else if (pos === availableSpaces[index - 1] + 1) {
      // Continuar el espacio actual
      currentSpace.width++;
    } else {
      // Guardar el espacio actual y comenzar uno nuevo
      spaces.push({ ...currentSpace });
      currentSpace.start = pos;
      currentSpace.width = 1;
    }
  });
  
  // Añadir el último espacio si existe
  if (currentSpace.start !== -1) {
    spaces.push(currentSpace);
  }
  
  return spaces;
};

// Encontrar el mejor espacio disponible en una fila para un elemento
export const findBestFitForElement = (elements, rowIndex, elementWidth) => {
  const width = elementWidthToGridUnits(elementWidth);
  const spaces = getAvailableSpacesInRow(elements, rowIndex);
  
  // Buscar el mejor espacio (primero que se ajuste exactamente, luego el más pequeño que sea suficiente)
  let bestSpace = null;
  
  // Primero buscar un ajuste exacto
  const exactFit = spaces.find(space => space.width === width);
  if (exactFit) return exactFit.start;
  
  // Si no hay ajuste exacto, buscar el espacio más pequeño que sea suficiente
  for (let i = 0; i < spaces.length; i++) {
    const space = spaces[i];
    if (space.width >= width) {
      if (!bestSpace || space.width < bestSpace.width) {
        bestSpace = space;
      }
    }
  }
  
  return bestSpace ? bestSpace.start : -1;
};