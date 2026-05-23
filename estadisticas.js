// estadisticas.js

const ss = require('simple-statistics');

const resultados = require('./medicion');

console.log("\nANÁLISIS ESTADÍSTICO\n");

for(const n in resultados){

    const tiempos = resultados[n];

    const media = ss.mean(tiempos);

    const desviacion = ss.standardDeviation(tiempos);

    console.log(`Tamaño n = ${n}`);

    console.log(
        `Promedio: ${media.toFixed(4)} ms`
    );

    console.log(
        `Desviación estándar: ${desviacion.toFixed(4)} ms`
    );

    console.log("-------------------------");

}