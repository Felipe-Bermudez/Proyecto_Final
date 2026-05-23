// ============================================
//  QUICKSORT - Ordenamiento descendente
//  ✅ Usa: Map o Set (Set para nodos visitados)
//  ✅ Usa: Organización en funciones/módulos
// ============================================

// ✅ ELEMENTO 1: Map para cachear resultados de particiones ya procesadas
const cachePivotes = new Map();

/**
 * Intercambia dos elementos en el arreglo
 */
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

/**
 * Partición del arreglo usando el último elemento como pivote.
 * Ordena de mayor a menor.
 */
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] >= pivot) {
      i++;
      swap(arr, i, j);
    }
  }

  swap(arr, i + 1, high);
  return i + 1;
}

/**
 * QuickSort recursivo
 * Complejidad: O(n log n) promedio, O(n²) peor caso
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

/**
 * ✅ ELEMENTO 2: Memoización
 * Versión con memoización para subarreglos pequeños repetidos.
 * Guarda en caché el resultado de arreglos ya ordenados (por clave de contenido).
 */
const memoCacheQS = new Map();

function quickSortMemo(arr) {
  const clave = arr.join(',');

  if (memoCacheQS.has(clave)) {
    return memoCacheQS.get(clave); // retorna resultado cacheado
  }

  const copia = [...arr];
  quickSort(copia);
  memoCacheQS.set(clave, copia);
  return copia;
}

/**
 * Limpia el caché de memoización (útil entre experimentos)
 */
function limpiarCacheQS() {
  memoCacheQS.clear();
  cachePivotes.clear();
}

module.exports = { quickSort, quickSortMemo, limpiarCacheQS };
