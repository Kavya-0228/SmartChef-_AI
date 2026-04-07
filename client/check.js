const fs = require('fs');
const glob = require('glob');
const babel = require('@babel/core');

glob('src/**/*.{js,jsx}', (err, files) => {
  files.forEach(file => {
    try {
      babel.transformFileSync(file, { presets: ['@babel/preset-react'] });
    } catch (e) {
      console.log('Error in file:', file);
      console.log(e.message);
    }
  });
});
