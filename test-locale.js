// Script de test pour vérifier le comportement des prompts avec différentes locales
const { getAiImageQuery } = require('./src/photo/ai/index.ts');

console.log('=== Test avec locale en-us (par défaut) ===');
console.log(getAiImageQuery('title', [], undefined, 'en-us'));

console.log('\n=== Test avec locale zh-cn ===');
console.log(getAiImageQuery('title', [], undefined, 'zh-cn'));

console.log('\n=== Test avec locale fr-fr ===');
console.log(getAiImageQuery('title', [], undefined, 'fr-fr'));

console.log('\n=== Test caption avec titre existant (en-us) ===');
console.log(getAiImageQuery('caption', [], 'Sunset Over Mountains', 'en-us'));

console.log('\n=== Test caption avec titre existant (zh-cn) ===');
console.log(getAiImageQuery('caption', [], 'Sunset Over Mountains', 'zh-cn'));
