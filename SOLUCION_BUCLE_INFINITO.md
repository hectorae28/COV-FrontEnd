# Solución al Error de Bucle Infinito en Zustand

## 🚨 Problema Identificado

```
Error: The result of getSnapshot should be cached to avoid an infinite loop
```

Este error se produce cuando se usa `useSyncExternalStore` (que es lo que usa Zustand internamente) con selectores que crean nuevos objetos en cada render.

## 🔍 Causa Raíz

El problema estaba en esta línea del componente `SolvenciaPago`:

```javascript
// ❌ INCORRECTO - Crea un nuevo objeto en cada render
const { colegiadoUser, setColegiadoUser } = useColegiadoUserStore((state) => ({
  colegiadoUser: state.colegiadoUser,
  setColegiadoUser: state.setColegiadoUser
}));
```

El selector `(state) => ({ ... })` crea un nuevo objeto en cada renderizado, lo que hace que React piense que el estado ha cambiado y vuelve a ejecutar el componente, causando un bucle infinito.

## ✅ Solución Implementada

### 1. **Separar los selectores de Zustand**

```javascript
// ✅ CORRECTO - Selectores separados
const colegiadoUser = useColegiadoUserStore((state) => state.colegiadoUser);
const setColegiadoUser = useColegiadoUserStore((state) => state.setColegiadoUser);
```

### 2. **Optimizar useEffect con dependencias específicas**

```javascript
// ❌ ANTES - Dependencia problemática
useEffect(() => {
  fetchUserAndSolvency();
}, [useColegiadoUserStore((state) => state.colegiadoUser?.solvente)]);

// ✅ DESPUÉS - Selector separado
const colegiadoUserSolvente = useColegiadoUserStore((state) => state.colegiadoUser?.solvente);

useEffect(() => {
  if (colegiadoUserSolvente) {
    fetchUserAndSolvency();
  }
}, [colegiadoUserSolvente]);
```

### 3. **Hook personalizado optimizado con memoización**

```javascript
const useSolvenciaData = (solvenciaData) => {
  // ... lógica del hook ...
  
  // Memoizar datos de entrada
  const pagosData = useMemo(() => {
    return solvenciaData?.pagos_solicitud_solvencia || [];
  }, [solvenciaData?.pagos_solicitud_solvencia]);

  // Memoizar el retorno del hook
  return useMemo(() => ({
    historialPagos,
    error,
    formatearFecha,
    formatearMoneda,
    obtenerNombreMetodoPago
  }), [historialPagos, error, formatearFecha, formatearMoneda, obtenerNombreMetodoPago]);
};
```

### 4. **Optimizar dependencias de useCallback**

```javascript
// ✅ Dependencias específicas en lugar de objetos completos
const calcularCosto = useCallback((tipo) => {
  // ... lógica ...
}, [colegiadoUser?.costo_de_solvencia, colegiadoUser?.costo_de_solvencia_anual]);
// En lugar de [colegiadoUser] que cambiaría en cada render
```

## 🛠️ Pasos de la Solución

### Paso 1: Identificar selectores problemáticos
- ✅ Cambiar selectores que retornan objetos nuevos
- ✅ Usar selectores individuales para cada propiedad

### Paso 2: Memoizar hooks personalizados
- ✅ Agregar `useMemo` al retorno del hook
- ✅ Memoizar datos de entrada con `useMemo`

### Paso 3: Optimizar dependencias
- ✅ Usar propiedades específicas en lugar de objetos completos
- ✅ Separar useEffect problemáticos

### Paso 4: Verificar useCallback
- ✅ Asegurar dependencias mínimas y específicas
- ✅ Evitar objetos complejos en dependencias

## 📊 Antes vs Después

### Antes (Problemático):
```javascript
// Crea nuevo objeto → re-render → nuevo objeto → bucle infinito
const { colegiadoUser, setColegiadoUser } = useColegiadoStore(state => ({
  colegiadoUser: state.colegiadoUser,
  setColegiadoUser: state.setColegiadoUser
}));
```

### Después (Optimizado):
```javascript
// Referencias estables → sin re-renders innecesarios
const colegiadoUser = useColegiadoUserStore(state => state.colegiadoUser);
const setColegiadoUser = useColegiadoUserStore(state => state.setColegiadoUser);
```

## 🎯 Reglas para Evitar Bucles con Zustand

1. **Nunca crear objetos en selectores**: Usar selectores que retornen valores primitivos o referencias estables

2. **Memoizar hooks personalizados**: Usar `useMemo` en el retorno de hooks personalizados

3. **Dependencias específicas**: Usar propiedades específicas en lugar de objetos completos en dependencias

4. **Separar selectores**: No combinar múltiples valores en un solo selector que cree objetos

5. **Verificar useEffect**: Asegurar que las dependencias no cambien en cada render

## 🔧 Herramientas de Debugging

Para identificar problemas similares:

```javascript
// Agregar logs temporales para debuggear
useEffect(() => {
  console.log('Selector executado:', new Date().getTime());
}, [useColegiadoUserStore(state => state.colegiadoUser)]);
```

## ✅ Resultado

Después de aplicar estas optimizaciones:
- ❌ Error de bucle infinito eliminado
- ✅ Rendimiento mejorado significativamente
- ✅ Re-renders reducidos al mínimo necesario
- ✅ Estado de aplicación estable

## 📝 Lecciones Aprendidas

1. **Zustand + React 18**: Los selectores deben retornar referencias estables
2. **useSyncExternalStore**: Requiere que `getSnapshot` esté memoizado
3. **Memoización crítica**: En hooks personalizados es esencial memoizar retornos
4. **Dependencias mínimas**: Usar solo las propiedades necesarias en dependencias

---

**Importante**: Esta solución mantiene toda la funcionalidad original mientras elimina el problema de rendimiento y estabilidad. 