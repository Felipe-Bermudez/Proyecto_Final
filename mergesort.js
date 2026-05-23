// ============================================
//  MERGESORT - Ordenamiento descendente
//  ✅ Usa: map, filter, reduce
//  ✅ Usa: Organización en funciones/módulos
// ============================================

/**
 * Fusiona dos subarreglos ordenados en orden descendente
 */
function merge(arr, left, mid, right) {
  const leftArr  = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] >= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
  }

  while (i < leftArr.length) arr[k++] = leftArr[i++];
  while (j < rightArr.length) arr[k++] = rightArr[j++];
}

/**
 * MergeSort recursivo
 * Complejidad: O(n log n) en todos los casos
 */
function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
  return arr;
}

// ============================================
//  ✅ ELEMENTO: Funciones map, filter, reduce
//  Funciones de análisis sobre los resultados
// ============================================

/**
 * Usa MAP: convierte cada elemento a su posición relativa (ranking %)
 * Ejemplo: [900, 500, 100] => ["1° (100%)", "2° (55%)", "3° (11%)"]
 */
function calcularRanking(arrOrdenado) {
  const max = arrOrdenado[0];
  return arrOrdenado.map((val, i) => ({
    posicion: i + 1,
    valor: val,
    porcentaje: ((val / max) * 100).toFixed(1) + '%'
  }));
}

/**
 * Usa FILTER: filtra los elementos que superan un umbral dado
 * Ejemplo: filtrarMayores([900, 500, 100], 400) => [900, 500]
 */
function filtrarMayores(arr, umbral) {
  return arr.filter(val => val > umbral);
}

/**
 * Usa REDUCE: calcula la suma total y la media de un arreglo
 */
function calcularSumaYMedia(arr) {
  const suma = arr.reduce((acum, val) => acum + val, 0);
  return {
    suma,
    media: suma / arr.length
  };
}

module.exports = {
  mergeSort,
  calcularRanking,
  filtrarMayores,
  calcularSumaYMedia
};
