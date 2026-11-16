// A continuous, softly lit interior. Instancing keeps eight floors inexpensive.
export function createShaft(T,scene,floorCount,brush){
 const group=new T.Group();group.name='shaft-architecture';group.visible=false;scene.add(group);
 const wall=new T.MeshPhysicalMaterial({color:'#344956',metalness:.48,roughness:.42,envMapIntensity:1.4,clearcoat:.12,clearcoatRoughness:.38,bumpMap:brush,bumpScale:.003,emissive:'#182b39',emissiveIntensity:.22,transparent:true,opacity:0,depthWrite:false});
 const frame=new T.MeshStandardMaterial({color:'#647c8c',metalness:.78,roughness:.3,envMapIntensity:1.5,emissive:'#253b47',emissiveIntensity:.16,transparent:true,opacity:0,depthWrite:false});
 const seam=new T.MeshBasicMaterial({color:'#a2c9dc',transparent:true,opacity:0,depthWrite:false,toneMapped:false});
 // Grazing light reads the edges; fine vertical variation prevents featureless faces.
 wall.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 vShaftLocal;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvShaftLocal=position;');
  shader.fragmentShader='varying vec3 vShaftLocal;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   float shoulder=smoothstep(3.05,3.62,abs(vShaftLocal.x));
   float brushing=sin(vShaftLocal.x*78.)*.012;
   diffuseColor.rgb*=.9+shoulder*.28+brushing;`);
 };
 function chamfered(w,h,d,r,curve=false){
  const shape=new T.Shape(),x=-w/2,y=-h/2;
  shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);
  shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const geometry=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:r*.45,bevelThickness:r*.45,bevelSegments:3,steps:1,curveSegments:8});geometry.center();
  if(curve){
   // Subdivide planar faces before bending so the wall follows the shaft smoothly.
   // ExtrudeGeometry triangulates broad faces; split triangles to avoid a flat chord.
   const position=geometry.attributes.position,uv=geometry.attributes.uv,normal=geometry.attributes.normal,positions=[],uvs=[],normals=[];
   function triangle(vertices,tex,norm,level){
    const span=Math.max(...vertices.map(v=>v.x))-Math.min(...vertices.map(v=>v.x));
    if(level&&span>.65){
     let edge=0;for(let i=1;i<3;i++)if(Math.abs(vertices[i].x-vertices[(i+1)%3].x)>Math.abs(vertices[edge].x-vertices[(edge+1)%3].x))edge=i;
     const a=edge,b=(edge+1)%3,c=(edge+2)%3;
     const mid=vertices[a].clone().add(vertices[b]).multiplyScalar(.5),tm=tex[a].clone().add(tex[b]).multiplyScalar(.5),nm=norm[a].clone().add(norm[b]).normalize();
     triangle([vertices[a],mid,vertices[c]],[tex[a],tm,tex[c]],[norm[a],nm,norm[c]],level-1);
     triangle([mid,vertices[b],vertices[c]],[tm,tex[b],tex[c]],[nm,norm[b],norm[c]],level-1);return;
    }
    vertices.forEach((p,i)=>{const angle=p.x/17.3,c=Math.cos(angle),s=Math.sin(angle),n=norm[i];positions.push(s*17.3,p.y,p.z+(c-1)*17.3);uvs.push(tex[i].x,tex[i].y);normals.push(n.x*c+n.z*s,n.y,-n.x*s+n.z*c);});
   }
   for(let i=0;i<position.count;i+=3)triangle([0,1,2].map(j=>new T.Vector3().fromBufferAttribute(position,i+j)),[0,1,2].map(j=>new T.Vector2().fromBufferAttribute(uv,i+j)),[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(normal,i+j)),8);
   geometry.dispose();const curved=new T.BufferGeometry();curved.setAttribute('position',new T.Float32BufferAttribute(positions,3));curved.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));curved.setAttribute('normal',new T.Float32BufferAttribute(normals,3));return curved;
  }
  return geometry;
 }
 const bays=14,count=bays*floorCount;
 const panels=new T.InstancedMesh(chamfered(7.18,12.35,.24,.16,true),wall,count);panels.name='curved-wall-bays';
 const ribs=new T.InstancedMesh(chamfered(.14,12.65,.3,.025),frame,count);ribs.name='beveled-wall-ribs';
 const reveals=new T.InstancedMesh(new T.BoxGeometry(.035,11.8,.035),seam,count*2);reveals.name='recessed-light-seams';
 const sills=new T.InstancedMesh(new T.BoxGeometry(7.18,.055,.16),frame,count);sills.name='floor-shadow-reveals';
 const dummy=new T.Object3D();
 function place(mesh,index,angle,radius,y){dummy.position.set(Math.sin(angle)*radius,y,Math.cos(angle)*radius);dummy.rotation.set(0,angle,0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);}
 for(let floor=0;floor<floorCount;floor++)for(let bay=0;bay<bays;bay++){
  const index=floor*bays+bay,angle=bay/bays*Math.PI*2,center=angle+Math.PI/bays,y=-floor*13+2.3;
  place(panels,index,center,17.3,y);place(ribs,index,angle,17.1,y);
  place(reveals,index*2,center-3.5/17.3,17.08,y);place(reveals,index*2+1,center+3.5/17.3,17.08,y);
  place(sills,index,center,16.94,-floor*13-4.2);
 }
 for(const mesh of [panels,ribs,reveals,sills]){mesh.instanceMatrix.needsUpdate=true;group.add(mesh);}
 // Cull individual bays, then compact their instance matrices into the existing four draws.
 // A single giant InstancedMesh bounding sphere cannot reject off-camera floors.
 const meshes=[panels,ribs,reveals,sills],originals=meshes.map(mesh=>mesh.instanceMatrix.array.slice());
 const bounds=[],matrix=new T.Matrix4(),temporary=new T.Box3();
 meshes.forEach(mesh=>{mesh.geometry.computeBoundingBox();mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.userData.capacity=mesh.count;});
 for(let bay=0;bay<count;bay++){
  const box=new T.Box3();
  meshes.forEach((mesh,type)=>{const copies=type===2?2:1;for(let part=0;part<copies;part++){
   matrix.fromArray(originals[type],(bay*copies+part)*16);temporary.copy(mesh.geometry.boundingBox).applyMatrix4(matrix);box.union(temporary);
  }});bounds.push(box.expandByScalar(.2));
 }
 const frustum=new T.Frustum(),projection=new T.Matrix4(),visible=new Int16Array(count);let previousCount=-1;
 function cull(camera){
  camera.updateMatrixWorld();projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);
  let length=0,changed=false;
  for(let bay=0;bay<count;bay++)if(frustum.intersectsBox(bounds[bay])){if(visible[length]!==bay)changed=true;visible[length++]=bay;}
  if(!changed&&length===previousCount)return;previousCount=length;
  meshes.forEach((mesh,type)=>{
   const copies=type===2?2:1,source=originals[type],destination=mesh.instanceMatrix.array;
   for(let i=0;i<length;i++)for(let part=0;part<copies;part++){
    const from=(visible[i]*copies+part)*16,to=(i*copies+part)*16;for(let n=0;n<16;n++)destination[to+n]=source[from+n];
   }
   mesh.count=length*copies;mesh.instanceMatrix.needsUpdate=true;
  });
 }
 const fill=new T.HemisphereLight('#afc8d5','#14232f',0);fill.name='shaft-soft-fill';scene.add(fill);
 const bounce=new T.PointLight('#b2cad6',0,40,2);bounce.name='shaft-camera-bounce';scene.add(bounce);
 return {group,update(reveal,camera){
  group.visible=reveal>.0001;if(group.visible)cull(camera);wall.opacity=frame.opacity=reveal;wall.depthWrite=frame.depthWrite=reveal>.995;
  seam.opacity=reveal*.2;fill.intensity=reveal*.58;bounce.intensity=reveal*14;bounce.position.copy(camera.position);bounce.position.y+=1.8;
 }};
}
