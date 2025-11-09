#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('\n🔒 EJECUTANDO TESTS DE SEGURIDAD\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Todos los tests deben FALLAR (❌) inicialmente.');
console.log('Tu objetivo es implementar las correcciones para que PASEN (✅).');
console.log('═══════════════════════════════════════════════════════════════\n');

const tests = [
  '01-brute-force.test.js',
  '02-command-injection.test.js',
  '03-csrf-protection.test.js',
  '04-file-inclusion.test.js',
  '05-file-upload.test.js',
  '06-insecure-captcha.test.js',
  '07-sql-injection.test.js',
  '08-blind-sql-injection.test.js'
];

let currentTest = 0;
const results = [];

function runNextTest() {
  if (currentTest >= tests.length) {
    showSummary();
    return;
  }

  const testFile = tests[currentTest];
  console.log(`\n📋 Ejecutando: ${testFile}`);
  console.log('─'.repeat(50));

  const testPath = path.join(__dirname, 'security', testFile);
  const jest = spawn('npx', ['jest', testPath, '--verbose'], {
    stdio: 'inherit'
  });

  jest.on('close', (code) => {
    results.push({
      test: testFile,
      passed: code === 0
    });
    currentTest++;
    runNextTest();
  });
}

function showSummary() {
  console.log('\n\n📊 RESUMEN DE RESULTADOS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  let passedCount = 0;
  
  results.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const vulnerability = tests[index].replace(/^\d+-/, '').replace('.test.js', '').replace(/-/g, ' ').toUpperCase();
    console.log(`${status} - ${vulnerability}`);
    if (result.passed) passedCount++;
  });
  
  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(`Total: ${passedCount}/${tests.length} vulnerabilidades corregidas`);
  
  const percentage = (passedCount / tests.length * 100).toFixed(0);
  console.log(`Progreso: ${getProgressBar(percentage)} ${percentage}%`);
  
  if (passedCount === tests.length) {
    console.log('\n🎉 ¡FELICITACIONES! Has corregido todas las vulnerabilidades.');
  } else {
    console.log('\n💪 Sigue trabajando para corregir las vulnerabilidades restantes.');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
}

function getProgressBar(percentage) {
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  return '[' + '█'.repeat(filled) + '░'.repeat(empty) + ']';
}

// Ejecutar tests
runNextTest();
