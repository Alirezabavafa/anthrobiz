import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const source=path.join(root,'web');
const output=path.join(root,'pages-dist');
const repository=(process.env.GITHUB_REPOSITORY||'').split('/').pop()||'';
const base=repository&& !repository.endsWith('.github.io')?`/${repository}`:'';

fs.rmSync(output,{recursive:true,force:true});
fs.cpSync(source,output,{recursive:true});

function walk(directory){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())walk(file);
  else if(base&&/\.(?:html|js|css)$/.test(entry.name)){
   const original=fs.readFileSync(file,'utf8');
   const adjusted=original.replace(/(["'`])\/(?![/>])/g,`$1${base}/`);
   fs.writeFileSync(file,adjusted);
  }
 }
}

walk(output);
fs.copyFileSync(path.join(output,'index.html'),path.join(output,'404.html'));
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(`Built GitHub Pages site${base?` for base path ${base}`:' at the domain root'}.`);
