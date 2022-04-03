import * as shell from 'shelljs';
shell.exec(
  'mkdir -p dist/src/public/views && yes | cp -r -i public/views dist/src/public',
);

// shell.cp('-R -I', 'public/views', 'dist/src/public/views');
// shell.cp('-R', 'src/public/fonts', 'dist/public/');
// shell.cp('-R', 'src/public/images', 'dist/public/');
