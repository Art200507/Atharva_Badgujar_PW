// Object-only finishing: the room, background, fog, and scene lighting stay intact.
export function finishExhibits(T,renderer,groups){
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
 const context=canvas.getContext('2d');context.fillStyle='#10151b';context.fillRect(0,0,2048,1024);
 // Broad photographic softboxes, plus a narrow cool rim, reflected in the metal.
 for(const [x,y,w,h,color] of [[150,70,300,680,'#e8edf2'],[790,130,470,520,'#c9d9e7'],[1570,60,90,810,'#a9c6dc']]){
  const gradient=context.createLinearGradient(x,0,x+w,0);
  gradient.addColorStop(0,'#10151b');gradient.addColorStop(.18,color);gradient.addColorStop(.82,color);gradient.addColorStop(1,'#10151b');
  context.fillStyle=gradient;context.fillRect(x,y,w,h);
 }
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.mapping=T.EquirectangularReflectionMapping;
 const generator=new T.PMREMGenerator(renderer),studio=generator.fromEquirectangular(texture).texture;texture.dispose();generator.dispose();
 const finishes=new Map();
 function finish(source){
  if(!source.isMeshStandardMaterial)return source;
  if(finishes.has(source))return finishes.get(source);
  const material=source.clone();material.onBeforeCompile=source.onBeforeCompile;
  // Preserve the emotion demo's shared color reference.
  material.color=source.color;material.envMap=studio;material.envMapIntensity=1.25;
  material.roughness=Math.max(.16,source.roughness*.82);
  if(material.isMeshPhysicalMaterial){material.anisotropy=.86;material.clearcoat=.28;material.clearcoatRoughness=.2;material.bumpScale=.004;}
  finishes.set(source,material);return material;
 }
 function precisionBand(radius,thickness){
  const width=thickness,depth=thickness*.58,bevel=Math.min(width,depth)*.48,profile=[];
  const corners=[[width-bevel,depth-bevel],[-width+bevel,depth-bevel],[-width+bevel,-depth+bevel],[width-bevel,-depth+bevel]];
  for(let corner=0;corner<4;corner++)for(let step=0;step<=5;step++){
   const angle=corner*Math.PI/2+step/5*Math.PI/2;
   profile.push([corners[corner][0]+Math.cos(angle)*bevel,corners[corner][1]+Math.sin(angle)*bevel]);
  }
  const positions=[],uv=[],indices=[],segments=192,n=profile.length;
  for(let i=0;i<=segments;i++){
   const angle=i/segments*Math.PI*2;
   for(let j=0;j<n;j++){const [u,v]=profile[j];positions.push(Math.cos(angle)*(radius+u),Math.sin(angle)*(radius+u),v);uv.push(i/segments,j/n);}
  }
  for(let i=0;i<segments;i++)for(let j=0;j<n;j++){
   const a=i*n+j,b=(i+1)*n+j,c=i*n+(j+1)%n,d=(i+1)*n+(j+1)%n;indices.push(a,b,c,b,d,c);
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();geometry.name='precision-band';return geometry;
 }
 function roundedBody(w,h,d,r){
  const shape=new T.Shape(),x=-w/2,y=-h/2;
  shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const geometry=new T.ExtrudeGeometry(shape,{depth:d-r*.5,bevelEnabled:true,bevelSize:r*.25,bevelThickness:r*.25,bevelSegments:4,curveSegments:12,steps:1});geometry.center();return geometry;
 }
 const bandCache=new Map(),kinetic=[];
 groups.forEach((group,index)=>{
  group.traverse(object=>{
   if(object.material)object.material=Array.isArray(object.material)?object.material.map(finish):finish(object.material);
   if(index===0||!object.isMesh)return;
   const geometry=object.geometry,parameters=geometry.parameters;
   if(geometry.type==='TorusGeometry'&&parameters.tube>=.04){
    const key=`${parameters.radius}-${parameters.tube}`;
    if(!bandCache.has(key))bandCache.set(key,precisionBand(parameters.radius,parameters.tube));
    object.geometry=bandCache.get(key);
   }
   if(geometry.type==='SphereGeometry'&&parameters.radius<.25&&parameters.widthSegments<32)object.geometry=new T.SphereGeometry(parameters.radius,32,20);
   if(index===5&&geometry.type==='BoxGeometry')object.geometry=roundedBody(parameters.width,parameters.height,parameters.depth,.06);
   if(index===10&&geometry.type==='IcosahedronGeometry')object.geometry=new T.TorusKnotGeometry(.57,.16,192,24,2,3);
   if(index===11&&geometry.type==='IcosahedronGeometry')object.geometry=roundedBody(.88,.88,.26,.09);
  });
  if([2,3,10,11].includes(index)){
   group.children.filter(o=>o.geometry?.name==='precision-band').forEach((mesh,i)=>kinetic.push({mesh,index,base:mesh.rotation.clone(),rate:(i%2?-1:1)*(.024+i*.008)}));
  }
 });
 // Remove the bulky hoops around the experience pillars; use slender structural frames.
 for(const mesh of groups[7].children.filter(o=>o.userData.baseY!==undefined))mesh.geometry=precisionBand(2.8,.12);
 // Teaching becomes three curved titanium leaves, with a quiet, legible silhouette.
 for(const mesh of groups[9].children.filter(o=>o.userData.baseY!==undefined)){
  mesh.geometry=roundedBody(1.28,3.8,.065,.075);
  const positions=mesh.geometry.attributes.position;
  for(let i=0;i<positions.count;i++)positions.setZ(i,positions.getZ(i)+Math.sin(positions.getY(i)/1.9*Math.PI*.5)*.13+positions.getX(i)**2*.08);
  positions.needsUpdate=true;mesh.geometry.computeVertexNormals();
 }
 // Fine engraved rails define the faces of the research / quantum instruments.
 const trim=new T.MeshStandardMaterial({color:'#9dc5d8',metalness:.8,roughness:.23,emissive:'#2e697e',emissiveIntensity:.35,envMap:studio});
 for(const index of [3,10,11]){
  for(const band of groups[index].children.filter(o=>o.geometry?.name==='precision-band')){
   const bounds=new T.Box3().setFromBufferAttribute(band.geometry.attributes.position),r=bounds.max.x-.035;
   const rail=new T.Mesh(new T.TorusGeometry(r,.008,8,192,Math.PI*1.4),trim);rail.position.z=.06;rail.rotation.z=.4;band.add(rail);
  }
 }
 // Metal node housings and inset blue lenses replace the bare low-poly spheres.
 const housing=finish(new T.MeshPhysicalMaterial({color:'#718898',metalness:1,roughness:.24,clearcoat:.3}));
 for(const index of [2,3]){
  const nodes=groups[index].children.filter(o=>o.geometry?.type==='SphereGeometry');
  nodes.forEach((node,i)=>{
   node.geometry=new T.SphereGeometry(.105,32,20);node.material=housing;
   const lens=new T.Mesh(new T.CircleGeometry(.048,32),trim);lens.position.z=.099;node.add(lens);
  });
 }
 return {update(times){
  for(const {mesh,index,base,rate} of kinetic){if(!groups[index].visible)continue;mesh.rotation.z=base.z+times[index]*rate;}
 }};
}
