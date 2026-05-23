// ============================================
//  MEDICIÓN Y ANÁLISIS ESTADÍSTICO
//  QuickSort vs MergeSort
//  ✅ Usa: Map o Set, map/filter/reduce,
//          memoización, módulos
// ============================================

const { performance } = require('perf_hooks');
const ss = require('simple-statistics');

const { quickSort, quickSortMemo, limpiarCacheQS } = require('./quicksort');
const {
  mergeSort,
  calcularRanking,
  filtrarMayores,
  calcularSumaYMedia
} = require('./mergesort');

// --- Configuración ---
const TAMANIOS    = [1000, 10000, 100000, 500000];
const REPETICIONES = 10;

// ✅ ELEMENTO: Set — registra los tamaños ya procesados (evita duplicados)
const tamaniosProcesados = new Set();

// ✅ ELEMENTO: Map — almacena todos los resultados por tamaño
const resultados = new Map();

// --- Utilidades ---

function generarArreglo(n) {
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * 1_000_000) + 1
  );
}

function medirTiempo(algoritmo, arreglo) {
  const copia = [...arreglo];
  const inicio = performance.now();
  algoritmo(copia);
  return performance.now() - inicio;
}

const f = (n) => n.toFixed(4);

// --- Ejecución principal ---

console.log('='.repeat(65));
console.log('   COMPARACIÓN: QuickSort vs MergeSort');
console.log(`   Orden: Descendente | Repeticiones por n: ${REPETICIONES}`);
console.log('='.repeat(65));

for (const n of TAMANIOS) {

  // ✅ Set: evita reprocesar el mismo tamaño si se llama dos veces
  if (tamaniosProcesados.has(n)) {
    console.log(`\n⚠️  n = ${n} ya fue procesado, se omite.`);
    continue;
  }
  tamaniosProcesados.add(n);

  console.log(`\n📦 Tamaño n = ${n.toLocaleString()}`);
  console.log('-'.repeat(65));

  const tiemposQS = [];
  const tiemposMS = [];

  for (let i = 1; i <= REPETICIONES; i++) {
    const arreglo = generarArreglo(n);
    const tqs = medirTiempo(quickSort, arreglo);
    const tms = medirTiempo(mergeSort, arreglo);
    tiemposQS.push(tqs);
    tiemposMS.push(tms);
    console.log(
      `  Rep ${String(i).padStart(2)}: QuickSort = ${f(tqs)} ms | MergeSort = ${f(tms)} ms`
    );
  }

  // --- Estadísticas con simple-statistics ---
  const statsQS = {
    media:   ss.mean(tiemposQS),
    desv:    ss.standardDeviation(tiemposQS),
    minimo:  ss.min(tiemposQS),
    maximo:  ss.max(tiemposQS),
    mediana: ss.median(tiemposQS),
  };
  const statsMS = {
    media:   ss.mean(tiemposMS),
    desv:    ss.standardDeviation(tiemposMS),
    minimo:  ss.min(tiemposMS),
    maximo:  ss.max(tiemposMS),
    mediana: ss.median(tiemposMS),
  };

  // ✅ Map: guarda el resultado de este tamaño
  resultados.set(n, { statsQS, statsMS, tiemposQS, tiemposMS });

  console.log(`\n  📊 Estadísticas para n = ${n.toLocaleString()}:`);
  console.log(`  ${'Métrica'.padEnd(18)} ${'QuickSort'.padEnd(14)} ${'MergeSort'}`);
  console.log(`  ${'-'.repeat(46)}`);
  console.log(`  ${'Media (ms)'.padEnd(18)} ${f(statsQS.media).padEnd(14)} ${f(statsMS.media)}`);
  console.log(`  ${'Desv. Estándar'.padEnd(18)} ${f(statsQS.desv).padEnd(14)} ${f(statsMS.desv)}`);
  console.log(`  ${'Mínimo (ms)'.padEnd(18)} ${f(statsQS.minimo).padEnd(14)} ${f(statsMS.minimo)}`);
  console.log(`  ${'Máximo (ms)'.padEnd(18)} ${f(statsQS.maximo).padEnd(14)} ${f(statsMS.maximo)}`);
  console.log(`  ${'Mediana (ms)'.padEnd(18)} ${f(statsQS.mediana).padEnd(14)} ${f(statsMS.mediana)}`);
  console.log(`  ${'Ganador'.padEnd(18)} ${statsQS.media < statsMS.media ? '✅ QuickSort'.padEnd(14) : '  -'.padEnd(14)} ${statsMS.media < statsQS.media ? '✅ MergeSort' : '  -'}`);
}

// ============================================
//  ✅ ELEMENTO: map, filter, reduce aplicados
//     a los resultados recolectados
// ============================================

console.log('\n' + '='.repeat(65));
console.log('   ANÁLISIS CON map / filter / reduce');
console.log('='.repeat(65));

// MAP: transforma resultados en tabla de diferencia porcentual
const diferencias = [...resultados.entries()].map(([n, { statsQS, statsMS }]) => {
  const diff = ((statsMS.media - statsQS.media) / statsQS.media * 100).toFixed(1);
  return { n, mediaQS: statsQS.media, mediaMS: statsMS.media, diferencia: diff };
});

console.log('\n  📌 map() — Diferencia porcentual MergeSort vs QuickSort:');
console.log(`  ${'n'.padEnd(10)} ${'QS media'.padEnd(12)} ${'MS media'.padEnd(12)} ${'MS es más lento en'}`);
console.log(`  ${'-'.repeat(50)}`);
diferencias.forEach(({ n, mediaQS, mediaMS, diferencia }) => {
  console.log(`  ${String(n.toLocaleString()).padEnd(10)} ${f(mediaQS).padEnd(12)} ${f(mediaMS).padEnd(12)} ${diferencia}%`);
});

// FILTER: tamaños donde MergeSort tardó más del doble que QuickSort
const casosCriticos = diferencias.filter(({ diferencia }) => parseFloat(diferencia) > 100);
console.log(`\n  📌 filter() — Tamaños donde MergeSort tardó >2x que QuickSort:`);
if (casosCriticos.length === 0) {
  console.log('  Ninguno.');
} else {
  casosCriticos.forEach(({ n, diferencia }) =>
    console.log(`  n = ${n.toLocaleString()} → MergeSort fue ${diferencia}% más lento`)
  );
}

// REDUCE: tiempo total acumulado por algoritmo en todos los experimentos
const totales = [...resultados.values()].reduce(
  (acum, { tiemposQS, tiemposMS }) => {
    acum.qs += tiemposQS.reduce((a, b) => a + b, 0);
    acum.ms += tiemposMS.reduce((a, b) => a + b, 0);
    return acum;
  },
  { qs: 0, ms: 0 }
);
console.log(`\n  📌 reduce() — Tiempo total acumulado (todas las repeticiones):`);
console.log(`  QuickSort : ${f(totales.qs)} ms`);
console.log(`  MergeSort : ${f(totales.ms)} ms`);

// ============================================
//  ✅ ELEMENTO: Memoización — demo QuickSort
// ============================================

console.log('\n' + '='.repeat(65));
console.log('   DEMO MEMOIZACIÓN — quickSortMemo()');
console.log('='.repeat(65));

limpiarCacheQS();
const arregloDemo = generarArreglo(500);

const t1 = performance.now();
quickSortMemo(arregloDemo);
const t2 = performance.now();

quickSortMemo(arregloDemo); // segunda llamada: usa caché
const t3 = performance.now();

console.log(`\n  Arreglo de 500 elementos:`);
console.log(`  1ª llamada (sin caché): ${f(t2 - t1)} ms`);
console.log(`  2ª llamada (con caché): ${f(t3 - t2)} ms`);
console.log(`  Speedup por memoización: ${((t2 - t1) / Math.max(t3 - t2, 0.0001)).toFixed(1)}x más rápido`);

// --- Resumen final ---
console.log('\n' + '='.repeat(65));
console.log('   RESUMEN FINAL');
console.log('='.repeat(65));
console.log(`  ${'n'.padEnd(10)} ${'QuickSort (ms)'.padEnd(16)} ${'MergeSort (ms)'.padEnd(16)} Ganador`);
console.log(`  ${'-'.repeat(55)}`);

let gQS = 0, gMS = 0;
for (const [n, { statsQS, statsMS }] of resultados) {
  const ganador = statsQS.media < statsMS.media ? '⚡ QuickSort' : '⚡ MergeSort';
  if (statsQS.media < statsMS.media) gQS++; else gMS++;
  console.log(
    `  ${String(n.toLocaleString()).padEnd(10)} ${f(statsQS.media).padEnd(16)} ${f(statsMS.media).padEnd(16)} ${ganador}`
  );
}

console.log('\n' + '='.repeat(65));
console.log(`  Victorias → QuickSort: ${gQS}/${TAMANIOS.length} | MergeSort: ${gMS}/${TAMANIOS.length}`);
console.log('='.repeat(65));
console.log('\n✅ Análisis completado.\n');
