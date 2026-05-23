// medicion.js

const { performance } = require('perf_hooks');
const mergeSort = require('./mergeSort');

const tamaños = [1000,10000,100000,500000];

const REPETICIONES = 10;

const resultados = {};

for(const n of tamaños){

    resultados[n] = [];

    for(let i=1;i<=REPETICIONES;i++){

        const arreglo = Array.from(
            {length:n},
            ()=>Math.floor(Math.random()*100000)
        );

        const inicio = performance.now();

        mergeSort(arreglo);

        const fin = performance.now();

        const tiempo = fin - inicio;

        resultados[n].push(tiempo);

        console.log(
            `n=${n} | repetición ${i} | ${tiempo.toFixed(4)} ms`
        );

    }

}

module.exports = resultados;