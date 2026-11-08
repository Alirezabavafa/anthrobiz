import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const assets={};
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json; charset=utf-8'};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else{const ext=path.extname(f);if(mime[ext])assets['/'+path.relative(path.join(root,'web'),f).split(path.sep).join('/')]={type:mime[ext],body:fs.readFileSync(f).toString('base64')};}}}
walk(path.join(root,'web'));
fs.rmSync(path.join(root,'dist'),{recursive:true,force:true});fs.mkdirSync(path.join(root,'dist/server'),{recursive:true});fs.mkdirSync(path.join(root,'dist/.openai'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/server/index.js'),'const ASSETS='+JSON.stringify(assets)+';\n'+fs.readFileSync(path.join(root,'worker/index.js'),'utf8'));
fs.copyFileSync(path.join(root,'.openai/hosting.json'),path.join(root,'dist/.openai/hosting.json'));
console.log('Built Worker with',Object.keys(assets).length,'embedded assets.');
