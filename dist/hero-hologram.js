// Original hero-only Three.js study inspired by the orbital hologram in
// https://github.com/Art200507/AI-Assistant/tree/main/dashboard
// Uses the portfolio's renderer, camera, pointer, and animation clock.
export function createHeroHologram(T, parent) {
  const assembly = new T.Group();
  assembly.name = 'hero-hologram';
  parent.add(assembly);
  const cyan = new T.Color('#7fe6ff');
  const ice = new T.Color('#c7f6ff');
  const amber = new T.Color('#ffbc79');
  const bands = [], orbits = [];
  const response = new T.Vector2(), pointerTarget = new T.Vector2();
  const additive = { transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false };
  const lineMaterial = (color, opacity) => new T.LineBasicMaterial({ ...additive, color, opacity });

  function arcs(radius, spans, steps = 64) {
    const positions = [];
    for (const [start, length] of spans) {
      for (let i = 0; i < steps; i++) {
        for (const angle of [start + length * i / steps, start + length * (i + 1) / steps]) {
          positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        }
      }
    }
    return new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  }
  function tickGeometry(radius, count, length) {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const extent = i % 10 === 0 ? length : i % 5 === 0 ? length * .65 : length * .28;
      for (const r of [radius, radius + extent]) positions.push(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    }
    return new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  }
  function luminousArc(radius, spans, color) {
    const positions = [], indices = [];
    for (const [start, length] of spans) {
      const offset = positions.length / 3;
      for (let i = 0; i <= 72; i++) {
        const angle = start + length * i / 72;
        for (const r of [radius - .095, radius + .095]) positions.push(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      }
      for (let i = 0; i < 72; i++) {
        const n = offset + i * 2;
        indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    const material = new T.ShaderMaterial({ ...additive, side: T.DoubleSide,
      uniforms: { uRadius: { value: radius }, uColor: { value: color.clone() } },
      vertexShader: 'varying float vRadius; void main(){vRadius=length(position.xy);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform float uRadius;uniform vec3 uColor;varying float vRadius;void main(){float d=abs(vRadius-uRadius);float halo=exp(-pow(d/.046,2.))*.27;float edge=exp(-pow(d/.015,2.))*.85;gl_FragColor=vec4(uColor,halo+edge);}'
    });
    return new T.Mesh(geometry, material);
  }

  // A glass-like containment shell surrounds a larger, flowing plasma nucleus.
  const shellMaterial = new T.ShaderMaterial({ ...additive,
    uniforms: { uTime: { value: 0 }, uPointer: { value: response }, uColor: { value: cyan } },
    vertexShader: `varying vec3 vNormal;varying vec3 vView;varying vec3 vPosition;
      void main(){vPosition=position;vec4 mv=modelViewMatrix*vec4(position,1.);
      vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uTime;uniform vec2 uPointer;uniform vec3 uColor;
      varying vec3 vNormal;varying vec3 vView;varying vec3 vPosition;
      void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),3.);
      float latitude=pow(.5+.5*sin(vPosition.y*75.),28.);
      float scan=exp(-pow((vPosition.y-sin(uTime*.25)*1.85)*15.,2.));
      float alpha=rim*.29+latitude*.012+scan*.04;
      gl_FragColor=vec4(uColor*(.7+rim*.45),alpha);}`
  });
  const shell = new T.Mesh(new T.SphereGeometry(1.88,64,48),shellMaterial);
  shell.name = 'hologram-shell';
  assembly.add(shell);
  const nucleusMaterial = new T.ShaderMaterial({
    toneMapped: false,
    uniforms: { uTime: { value: 0 }, uPointer: { value: response } },
    vertexShader: `varying vec3 vNormal;varying vec3 vView;varying vec3 vPosition;
      void main(){vPosition=position;vec4 mv=modelViewMatrix*vec4(position,1.);
      vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uTime;uniform vec2 uPointer;
      varying vec3 vNormal;varying vec3 vView;varying vec3 vPosition;
      void main(){vec3 p=normalize(vPosition);float t=uTime*.18;
      float flow=sin(p.x*8.+p.z*5.+t+sin(p.y*9.-t)*1.7);
      float folds=sin(p.y*12.+p.x*6.-t*1.3+flow*2.2);
      float vein=pow(1.-abs(sin(p.z*10.+p.x*7.+folds*1.5+t)),12.);
      float silk=pow(.5+.5*folds,3.);
      float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.2);
      float light=pow(max(0.,dot(normalize(vNormal),normalize(vec3(uPointer*.5+vec2(-.4,.7),1.)))),4.);
      vec3 color=mix(vec3(.005,.04,.12),vec3(.02,.33,.57),silk);
      color+=vec3(.12,.8,1.)*vein*(.45+silk*.65);
      color+=vec3(.22,.78,1.)*rim+vec3(.18,.38,.43)*light;
      gl_FragColor=vec4(color,1.);}`
  });
  const nucleus = new T.Mesh(new T.SphereGeometry(.9,64,48),nucleusMaterial);
  nucleus.name = 'hero-core';
  assembly.add(nucleus);
  const inner = new T.Group();
  inner.name = 'hologram-inner-gyroscope';
  assembly.add(inner);
  for (let i=0;i<3;i++) {
    const orbit = new T.LineSegments(arcs(1.05+i*.2,[[0,Math.PI*2]],112),lineMaterial(i===1?amber:ice,.3));
    orbit.rotation.set(.5+i*.7,.3+i*.8,i*.2);
    inner.add(orbit);
  }
  const lattice = new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(1.68,1)),lineMaterial(cyan,.055));
  lattice.name = 'hologram-inner-lattice';
  inner.add(lattice);

  const fieldMaterial = new T.ShaderMaterial({ ...additive,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform float uTime;varying vec2 vUv;void main(){
      float pulse=pow(.5+.5*cos(vUv.x*18.84956-uTime*.65),8.);
      vec3 color=mix(vec3(.04,.36,.72),vec3(.65,.96,1.),pulse);
      gl_FragColor=vec4(color,.18+pulse*.7);}`
  });
  for(let i=0;i<6;i++) {
    const path=[];
    for(let j=0;j<=128;j++) {
      const a=j/128*Math.PI*2, r=1.22+.12*Math.sin(a*3+i);
      path.push(new T.Vector3(Math.cos(a)*r,Math.sin(a)*r,Math.sin(a*2+i)*.18));
    }
    const filament=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(path,true),128,.013,5,true),fieldMaterial);
    filament.name=`core-field-${i}`;
    filament.rotation.set(i*.53,.3+i*.61,i*.4);
    inner.add(filament);
  }

  // Uniform spherical samples. Movement is orbital; the sphere does not wobble.
  const positions = [], seeds = [];
  const count = 4200, golden = Math.PI*(3-Math.sqrt(5));
  for (let i=0;i<count;i++) {
    const y=1-2*(i+.5)/count, radius=Math.sqrt(1-y*y), angle=i*golden;
    positions.push(Math.cos(angle)*radius*1.94,y*1.94,Math.sin(angle)*radius*1.94);
    seeds.push((i*.61803398875)%1);
  }
  const particleGeometry = new T.BufferGeometry();
  particleGeometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  particleGeometry.setAttribute('aSeed',new T.Float32BufferAttribute(seeds,1));
  const particleMaterial = new T.ShaderMaterial({ ...additive,
    uniforms: { uTime:{value:0},uPointer:{value:response},uPixel:{value:Math.min(globalThis.devicePixelRatio||1,1.5)} },
    vertexShader: `attribute float aSeed;uniform float uTime;uniform float uPixel;uniform vec2 uPointer;
      varying float vAlpha;varying float vHighlight;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vec4 clip=projectionMatrix*mv;
      vec2 delta=clip.xy/clip.w-uPointer;float nearPointer=exp(-dot(delta,delta)*14.);
      float front=max(0.,dot(normalize(normalMatrix*normalize(position)),normalize(-mv.xyz)));
      vAlpha=(.17+front*.5)*(.84+.16*sin(aSeed*40.+uTime*.8))+nearPointer*.17;
      vHighlight=step(.97,aSeed);gl_PointSize=clamp((12.+aSeed*9.)*uPixel/(-mv.z),.9,3.5);
      gl_Position=clip;}`,
    fragmentShader: `varying float vAlpha;varying float vHighlight;void main(){
      float d=length(gl_PointCoord-.5);if(d>.5)discard;
      vec3 color=mix(vec3(.23,.74,1.),vec3(.83,.98,1.),vHighlight);
      gl_FragColor=vec4(color,(1.-smoothstep(.08,.5,d))*vAlpha);}`
  });
  const particles = new T.Points(particleGeometry,particleMaterial);
  particles.name = 'hologram-particle-sphere';
  assembly.add(particles);

  const chassisMaterial=new T.MeshStandardMaterial({color:'#294656',metalness:.84,roughness:.28,emissive:'#0c2634',emissiveIntensity:.4});
  function panel(radius,start,length) {
    const shape=new T.Shape(),width=.075;
    shape.absarc(0,0,radius+width,start,start+length,false);
    shape.absarc(0,0,radius-width,start+length,start,true);shape.closePath();
    const geometry=new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.012,curveSegments:32});
    geometry.translate(0,0,-.0225);
    return new T.Mesh(geometry,chassisMaterial);
  }
  // Concentric instruments in several physical planes, with deliberately sparse amber.
  for (let i=0;i<8;i++) {
    const band=new T.Group(), radius=2.18+i*.135;
    band.name=`hologram-band-${i}`;
    const spans=Array.from({length:3},(_,j)=>[j*Math.PI*2/3+i*.24,1.35+(i%2)*.12]);
    const color=i===4?amber:i<2?ice:cyan;
    band.add(new T.LineSegments(arcs(radius,spans),lineMaterial(color,i===4?.42:.62)));
    if(i===1||i===5) {
      for(const [start,length] of spans)band.add(panel(radius,start,length));
      const rail=luminousArc(radius+.078,spans,color);rail.position.z=.035;band.add(rail);
      band.add(new T.LineSegments(arcs(radius-.08,spans),lineMaterial(cyan,.45)));
    } else if(i%2===0)band.add(luminousArc(radius,spans,color));
    if(i===1||i===5||i===7)band.add(new T.LineSegments(tickGeometry(radius+.04,120,.11),lineMaterial(cyan,.37)));
    band.rotation.set(i<3?.08:i%2?.7:-.65,i<3?0:i%3?.45:-.5,i*.33);
    band.userData.rest=band.rotation.clone();
    assembly.add(band);bands.push(band);
  }
  // Fine outer orbits and three small moving light sources provide depth cues.
  for(let i=0;i<3;i++) {
    const orbit=new T.Group(),radius=3.28+i*.08;
    orbit.add(new T.LineSegments(arcs(radius,[[0,Math.PI*2]],144),lineMaterial(cyan,.12)));
    const bead=new T.Mesh(new T.SphereGeometry(.045,16,12),new T.MeshBasicMaterial({...additive,color:i===1?amber:ice,opacity:.95}));
    orbit.add(bead);orbit.rotation.set(.42+i*.54,.25+i*.57,i*.2);
    const trailGeometry=new T.BufferGeometry(),trailPositions=[],trailAlphas=[];
    for(let j=0;j<100;j++) {
      const a=-j/99*.9*(i%2?-1:1);
      trailPositions.push(Math.cos(a)*radius,Math.sin(a)*radius,0);trailAlphas.push(Math.pow(1-j/100,1.6));
    }
    trailGeometry.setAttribute('position',new T.Float32BufferAttribute(trailPositions,3));
    trailGeometry.setAttribute('aAlpha',new T.Float32BufferAttribute(trailAlphas,1));
    const trailMaterial=new T.ShaderMaterial({...additive,
      uniforms:{uPixel:{value:1},uColor:{value:i===1?amber:ice}},
      vertexShader:'attribute float aAlpha;uniform float uPixel;varying float vAlpha;void main(){vAlpha=aAlpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=clamp((15.+aAlpha*22.)*uPixel/(-mv.z),1.,5.);gl_Position=projectionMatrix*mv;}',
      fragmentShader:'uniform vec3 uColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(uColor,(1.-smoothstep(0.,.5,d))*vAlpha*.7);}'
    });
    const trail=new T.Points(trailGeometry,trailMaterial);trail.name=`orbital-trail-${i}`;orbit.add(trail);
    assembly.add(orbit);orbits.push({orbit,bead,radius,trail});
  }
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const context=canvas.getContext('2d'),gradient=context.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'rgba(160,245,255,.65)');gradient.addColorStop(.1,'rgba(68,201,255,.3)');
  gradient.addColorStop(.38,'rgba(30,150,240,.13)');gradient.addColorStop(1,'rgba(0,80,160,0)');
  context.fillStyle=gradient;context.fillRect(0,0,128,128);
  const glow=new T.Sprite(new T.SpriteMaterial({...additive,map:new T.CanvasTexture(canvas),color:'#8adfff',opacity:.72}));
  glow.scale.set(6.4,6.4,1);glow.name='hologram-core-glow';assembly.add(glow);
  for(const {bead} of orbits) {
    const flare=new T.Sprite(new T.SpriteMaterial({...additive,map:glow.material.map,color:ice,opacity:.8}));
    flare.scale.set(.6,.6,1);bead.add(flare);
  }

  return {
    update(time,dt,pointer,opening,interactive,pixelRatio=Math.min(globalThis.devicePixelRatio||1,1.5)) {
      if(!parent.visible)return;
      if(interactive)response.lerp(pointerTarget.set(pointer.x,pointer.y),1-Math.exp(-dt*4));
      shellMaterial.uniforms.uTime.value=nucleusMaterial.uniforms.uTime.value=particleMaterial.uniforms.uTime.value=fieldMaterial.uniforms.uTime.value=time;
      nucleus.rotation.set(.25,time*.085,-.18);
      particleMaterial.uniforms.uPixel.value=pixelRatio;
      particles.rotation.y=time*.035;
      inner.rotation.set(time*.045,time*.075,0);
      assembly.rotation.x=response.y*.055;assembly.rotation.y=response.x*.075;
      bands.forEach((band,i)=>{
        const rest=band.userData.rest;
        band.rotation.set(rest.x+Math.sin(time*.19+i)*.025+opening*(i%2?1:-1)*.32,
          rest.y+opening*(i%3-1)*.38,
          rest.z+time*(i%2?1:-1)*(.038+i*.006));
        band.position.set(Math.cos(i*2.4)*opening*.2,Math.sin(i*2.4)*opening*.2,(i-3.5)*opening*.24);
      });
      orbits.forEach(({orbit,bead,radius,trail},i)=>{
        const a=time*(.13+i*.06)*(i%2?-1:1);bead.position.set(Math.cos(a)*radius,Math.sin(a)*radius,0);orbit.rotation.z=time*.018+i*.2;trail.rotation.z=a;trail.material.uniforms.uPixel.value=particleMaterial.uniforms.uPixel.value;
      });
    }
  };
}
