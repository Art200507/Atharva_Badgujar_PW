// Resolution follows sustained frame timing, not individual long frames.
export function createAdaptiveQuality({width,height,pixelRatio=1,onChange}){
 const scales=[1,.85,.7,.6];let level=0,cap=1,warmup=1.5,cooldown=0,recoveryHold=0,seconds=0,frames=0,slow=0,stable=0,lastRatio=0;
 function apply(){const ratio=cap*scales[level];if(Math.abs(ratio-lastRatio)>.005){lastRatio=ratio;onChange(ratio,level);}}
 function reset(){seconds=0;frames=0;slow=0;}
 function resize(size){width=size.width;height=size.height;pixelRatio=size.pixelRatio||1;cap=Math.min(pixelRatio,1.5,Math.sqrt(3000000/Math.max(1,width*height)));warmup=1;reset();apply();}
 resize({width,height,pixelRatio});
 return {resize,get pixelRatio(){return lastRatio;},get level(){return level;},sample(elapsed,allowUpgrade=true){
  if(!Number.isFinite(elapsed)||elapsed<=0)return;
  if(elapsed>1){warmup=.5;reset();return;}
  const dt=Math.min(elapsed,.1);cooldown=Math.max(0,cooldown-dt);recoveryHold=Math.max(0,recoveryHold-dt);
  if(warmup>0){warmup-=dt;return;}
  seconds+=dt;frames++;if(dt>.020)slow++;
  if(seconds<1.25)return;
  const mean=seconds/frames,bad=slow/frames;
  if(mean>.0205||bad>.15){stable=0;if(cooldown===0&&level<scales.length-1){level++;cooldown=2.5;recoveryHold=15;apply();}}
  else if(mean<.0175&&bad<.04){stable++;if(stable>=6&&allowUpgrade&&cooldown===0&&recoveryHold===0&&level>0){level--;stable=0;cooldown=.5;apply();}}
  else stable=0;
  reset();
 }};
}
