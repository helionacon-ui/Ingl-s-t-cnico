/* Figuras interactivas de Inglés Técnico. Vanilla JS + canvas. */
(function(){
const C = {};
function paleta(el){const cs=getComputedStyle(el);const v=n=>cs.getPropertyValue(n).trim();
  C.bg=v('--surface')||'#fff';C.grid=v('--line')||'#d5dcd9';C.text=v('--fg')||'#16211d';C.muted=v('--muted')||'#56635e';
  C.a=v('--tc')||v('--accent')||'#b4232f';C.b=v('--warn')||'#b8730c';C.c=v('--c6')||'#2c8a52';C.d=v('--c5')||'#c43d63';C.e=v('--c4')||'#b8730c';C.f=v('--c2')||'#3a63c4';}
const F=n=>Number.isInteger(n)?String(n):(Math.abs(n)<1e-9?'0':n.toFixed(2).replace('.',','));

function build(el, spec){
  el.classList.add('sim-box');paleta(el);
  const ctrls=document.createElement('div'); ctrls.className='ctrl sim-ctrls';
  const cv=document.createElement('canvas'); cv.width=spec.w||640; cv.height=spec.h||360; cv.className='sim-cv';
  const out=document.createElement('div'); out.className='readout sim-out';
  el.append(ctrls,cv,out);
  const st={};
  (spec.sliders||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=`${s.l}: ${F(s.v)} ${s.u||''}`;
    const inp=document.createElement('input');inp.type='range';inp.min=s.min;inp.max=s.max;inp.step=s.step||0.01;inp.value=s.v;
    inp.oninput=()=>{st[s.k]=parseFloat(inp.value);sp.textContent=`${s.l}: ${F(st[s.k])} ${s.u||''}`;draw();};lab.append(sp,inp);ctrls.append(lab);});
  (spec.selects||[]).forEach(s=>{st[s.k]=s.v;const lab=document.createElement('label');const sp=document.createElement('span');sp.textContent=s.l;
    const sel=document.createElement('select');s.opts.forEach(o=>{const op=document.createElement('option');op.value=o[0];op.textContent=o[1];if(o[0]===s.v)op.selected=true;sel.append(op);});
    sel.onchange=()=>{st[s.k]=sel.value;draw();};lab.append(sp,sel);ctrls.append(lab);});
  const g=cv.getContext('2d');
  const api={st,cv,g,out,W:cv.width,H:cv.height,
    clear(){paleta(el);g.fillStyle=C.bg;g.fillRect(0,0,cv.width,cv.height);},
    txt(s,x,y,col,sz,al){g.fillStyle=col||C.text;g.font=(sz||13)+'px system-ui';g.textAlign=al||'left';g.fillText(s,x,y);},
    arrow(x1,y1,x2,y2,col,wd){g.strokeStyle=g.fillStyle=col;g.lineWidth=wd||2.5;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1),L=10;g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-L*Math.cos(a-0.4),y2-L*Math.sin(a-0.4));g.lineTo(x2-L*Math.cos(a+0.4),y2-L*Math.sin(a+0.4));g.closePath();g.fill();},
    line(x1,y1,x2,y2,col,wd,dash){g.strokeStyle=col;g.lineWidth=wd||1.5;g.setLineDash(dash||[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);},
    circ(x,y,r,col,fill){g.beginPath();g.arc(x,y,r,0,Math.PI*2);if(fill){g.fillStyle=col;g.fill();}else{g.strokeStyle=col;g.lineWidth=2;g.stroke();}},
    html(h){out.innerHTML=h;},
    // sistema de ejes cartesiano
    axes(cx,cy,u,xmin,xmax,ymin,ymax){for(let i=Math.ceil(xmin);i<=xmax;i++)api.line(cx+i*u,cy-ymax*u,cx+i*u,cy-ymin*u,C.grid,1);for(let j=Math.ceil(ymin);j<=ymax;j++)api.line(cx+xmin*u,cy-j*u,cx+xmax*u,cy-j*u,C.grid,1);api.line(cx+xmin*u,cy,cx+xmax*u,cy,C.muted,1.5);api.line(cx,cy-ymax*u,cx,cy-ymin*u,C.muted,1.5);}
  };
  function draw(){spec.draw(api);}
  draw(); return api;
}
const SIMS={};

/* ---- Inglés Técnico: ejercicios interactivos ---- */
const mk=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!==undefined)e.innerHTML=h;return e;};

/* motor de opción múltiple */
function quiz(el,spec){
  el.classList.add('sim-box');paleta(el);
  const head=mk('p','qhead',spec.intro||'');
  const wrap=mk('div','qwrap');
  const out=mk('div','readout sim-out');
  el.append(head,wrap,out);
  let done=0, right=0;
  spec.items.forEach((it,i)=>{
    const card=mk('div','qcard');
    card.append(mk('p','qq','<b>'+(i+1)+'.</b> '+it.q));
    const opts=mk('div','qopts');
    let answered=false;
    it.o.forEach((o,k)=>{
      const b=mk('button','qo',o);b.type='button';
      b.onclick=()=>{
        if(answered)return;answered=true;done++;
        [...opts.children].forEach((bb,kk)=>{bb.disabled=true;
          if(kk===it.a)bb.classList.add('ok');
          else if(bb===b)bb.classList.add('bad');});
        if(k===it.a)right++;
        card.append(mk('p','qexp',(k===it.a?'✅ ':'❌ ')+it.e));
        out.innerHTML=`<b>${right} de ${done}</b> ${done===spec.items.length?'· ejercicio completado':'respondidas'}${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;};
      opts.append(b);});
    card.append(opts);wrap.append(card);});
  out.innerHTML=`${spec.items.length} preguntas.${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;
}

/* motor de emparejar (columna izquierda ↔ desplegable) */
function match(el,spec){
  el.classList.add('sim-box');paleta(el);
  const head=mk('p','qhead',spec.intro||'');
  const tw=mk('div','tw');
  const tb=mk('table','');
  tb.innerHTML='<tr><th>'+spec.cols[0]+'</th><th>'+spec.cols[1]+'</th><th></th></tr>';
  const out=mk('div','readout sim-out');
  el.append(head,tw,out);tw.append(tb);
  const opciones=spec.items.map(x=>x.b).sort((a,b)=>a.localeCompare(b,'en'));
  const sels=[];
  spec.items.forEach((it,i)=>{
    const tr=mk('tr','');
    const td1=mk('td','',it.a);
    const td2=mk('td','');
    const sel=document.createElement('select');
    sel.append(new Option('—',''));
    opciones.forEach(o=>sel.append(new Option(o,o)));
    td2.append(sel);sels.push([sel,it]);
    const td3=mk('td','');
    sel.onchange=()=>{td3.textContent=sel.value===''?'':(sel.value===it.b?'✅':'❌');
      td3.style.color=sel.value===it.b?'var(--c6)':'var(--warn)';
      const ok=sels.filter(([s,x])=>s.value===x.b).length;
      const resp=sels.filter(([s])=>s.value!=='').length;
      out.innerHTML=`<b>${ok} de ${resp}</b> correctas${resp===spec.items.length?' · completado':''}${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;};
    tr.append(td1,td2,td3);tb.append(tr);});
  out.innerHTML=`Empareja los ${spec.items.length} elementos.${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;
}

/* motor de huecos (rellenar con desplegable dentro del texto) */
function gaps(el,spec){
  el.classList.add('sim-box');paleta(el);
  const head=mk('p','qhead',spec.intro||'');
  const box=mk('div','gapbox');
  const out=mk('div','readout sim-out');
  el.append(head,box,out);
  const sels=[];
  spec.lines.forEach(ln=>{
    const p=mk('p','gline');
    const partes=ln.t.split('___');
    p.append(document.createTextNode(partes[0]));
    const sel=document.createElement('select');
    sel.append(new Option('—',''));
    (ln.o||spec.opciones).forEach(o=>sel.append(new Option(o,o)));
    sel.onchange=()=>{
      sel.style.borderColor=sel.value===''?'':(sel.value===ln.a?'var(--c6)':'var(--warn)');
      const ok=sels.filter(([s,l])=>s.value===l.a).length, resp=sels.filter(([s])=>s.value!=='').length;
      out.innerHTML=`<b>${ok} de ${resp}</b> correctas${resp===spec.lines.length?' · completado':''}${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;
      if(sel.value!==''&&!p.querySelector('.gexp')&&ln.e)p.append(mk('span','gexp',' — '+ln.e));};
    sels.push([sel,ln]);
    p.append(sel);
    if(partes[1])p.append(document.createTextNode(partes[1]));
    box.append(p);});
  out.innerHTML=`${spec.lines.length} huecos.${spec.hint?'<br><span class="hint">'+spec.hint+'</span>':''}`;
}

/* T1 · Energy vocabulary */
SIMS.energia=el=>quiz(el,{intro:'Vocabulario de energía: elige la opción correcta.',
 hint:'En el examen escrito la mitad de las preguntas son de vocabulario específico como éste: no se trata de traducir, sino de reconocer el término que usa un técnico.',
 items:[
 {q:'A power plant that burns coal or gas is a ___ power plant.',o:['fossil-fuel','fossil-fuelled','fuel-fossil'],a:1,e:'<b>fossil-fuelled</b> power plant. El adjetivo compuesto se forma con participio: <i>gas-fired</i>, <i>coal-fired</i>, <i>oil-fired</i> son alternativas muy frecuentes.'},
 {q:'The opposite of <i>renewable energy</i> is:',o:['non-renewable energy','unrenewable energy','disrenewable energy'],a:0,e:'<b>non-renewable</b>. El prefijo <i>non-</i> es el habitual en términos técnicos: <i>non-metallic</i>, <i>non-hazardous</i>, <i>non-conductive</i>.'},
 {q:'Electricity is measured in watts; energy consumption over time is measured in:',o:['watts per hour','kilowatt-hours','watts/hour'],a:1,e:'<b>kilowatt-hours (kWh)</b>. Cuidado: <i>watts per hour</i> es un error clásico, porque el vatio ya es energía por unidad de tiempo.'},
 {q:'The ___ grid distributes electricity across the country.',o:['national','nacional','state'],a:0,e:'<b>national grid</b> es el término estándar en inglés británico para la red eléctrica. En EE. UU. se dice <i>power grid</i>.'},
 {q:'Choose the correct sentence about efficiency:',o:['The plant has an efficiency of the 40 %','The plant is 40 % efficient','The plant has 40 % of efficiency'],a:1,e:'<b>40 % efficient</b> o <i>an efficiency of 40 %</i>. En inglés no se dice «of the 40 %» ni «has 40 % of efficiency».'},
 {q:'Energy that is lost as heat is said to be:',o:['wasted','spoiled','spent'],a:0,e:'<b>wasted</b>. El texto de clase sobre frenos regenerativos lo usa: «The resulting friction generates heat, which is <i>wasted</i>».'},
 {q:'A device that converts one form of energy into another is a:',o:['transductor','transducer','transformator'],a:1,e:'<b>transducer</b>. Y el que cambia la tensión alterna es un <i>transformer</i>, nunca «transformator».'},
]});

/* T2 · Materials and properties */
SIMS.materiales=el=>match(el,{intro:'Empareja cada propiedad con su definición (ejercicio «properties of materials» de clase).',
 cols:['Property','Meaning'],
 hint:'Estas ocho propiedades son las que aparecen en la tabla del ejercicio de clase sobre la zapatilla deportiva: carbon fibre (lightweight, flexible), aramid fibre (strong in tension, impact resistant), polyurethane foam (soft, impact absorbent) y TPU (tough, elastic).',
 items:[
 {a:'malleable',b:'can be hammered or pressed into shape without breaking'},
 {a:'ductile',b:'can be drawn out into a wire'},
 {a:'tough',b:'does not break easily when struck'},
 {a:'brittle',b:'breaks suddenly, without bending first'},
 {a:'elastic',b:'returns to its original shape after being stretched'},
 {a:'absorbent',b:'able to take in liquids or reduce the effect of an impact'},
 {a:'corrosion-resistant',b:'is not damaged by rust or chemical attack'},
 {a:'lightweight',b:'does not weigh very much for its size'},
]});

/* T3 · Manufacturing */
SIMS.fabricacion=el=>match(el,{intro:'Procesos de fabricación: empareja cada verbo con lo que describe.',
 cols:['Process','What it means'],
 hint:'Ojo a los falsos amigos: <i>to mould</i> no es «moler», es moldear; <i>to drill</i> es taladrar, no «driblar»; y <i>to cast</i> es fundir en molde, no «castear».',
 items:[
 {a:'to cast',b:'pour molten metal into a mould and let it solidify'},
 {a:'to forge',b:'shape hot metal by hammering or pressing it'},
 {a:'to weld',b:'join two pieces of metal by melting their edges together'},
 {a:'to drill',b:'make a round hole with a rotating tool'},
 {a:'to mill',b:'remove material with a rotating multi-tooth cutter'},
 {a:'to turn',b:'shape a rotating workpiece on a lathe'},
 {a:'to mould',b:'form plastic by forcing it into a shaped cavity'},
 {a:'to assemble',b:'put the separate parts together to build the product'},
]});

/* T4 · Technology: describing devices */
SIMS.dispositivos=el=>gaps(el,{intro:'Describir un dispositivo: completa cada frase con la estructura correcta.',
 opciones:['which','that','made of','made from','used for','used to','consists of','is capable of'],
 hint:'Las dos parejas que más se confunden: <b>made of</b> (el material se reconoce: a table made of wood) frente a <b>made from</b> (se transforma: paper made from wood); y <b>used for + -ing</b> frente a <b>used to + infinitivo</b>.',
 lines:[
 {t:'A sensor is a device ___ converts a physical quantity into an electrical signal.',a:'which',e:'<i>which</i> o <i>that</i> en una oración especificativa sin coma.'},
 {t:'The housing is ___ stainless steel.',a:'made of',e:'el acero sigue siendo reconocible: <b>made of</b>.'},
 {t:'Biodiesel is ___ vegetable oil.',a:'made from',e:'hay transformación química: <b>made from</b>.'},
 {t:'This valve is ___ regulating the flow of coolant.',a:'used for',e:'<b>used for + -ing</b>.'},
 {t:'This valve is ___ regulate the flow of coolant.',a:'used to',e:'<b>used to + infinitivo</b>: misma idea, otra estructura.'},
 {t:'The system ___ three main units: the sensor, the controller and the actuator.',a:'consists of',e:'<b>consists of</b> (nunca «consists in» en este sentido; tampoco lleva <i>of</i> con <i>comprises</i>).'},
 {t:'The robot ___ lifting loads of up to 50 kg.',a:'is capable of',e:'<b>be capable of + -ing</b>.'},
]});

/* T5 · Electronics */
SIMS.electronica=el=>quiz(el,{intro:'Vocabulario de electrónica y circuitos.',
 hint:'Son los términos del bloque discipline-specific del GIEyA. Muchos aparecen en los textos de lectura del portafolio.',
 items:[
 {q:'The two states of a digital signal are usually called:',o:['high and low','up and down','on and over'],a:0,e:'<b>high and low</b> (o <i>logic 1 / logic 0</i>). También se dice que la señal <i>goes high</i> o <i>goes low</i>.'},
 {q:'A component that opposes the flow of current is a:',o:['resistance','resistor','resistence'],a:1,e:'<b>resistor</b> es el componente; <b>resistance</b> es la magnitud. El mismo par que <i>capacitor / capacitance</i> e <i>inductor / inductance</i>.'},
 {q:'The correct term for «placa de circuito impreso» is:',o:['printed circuit board','printed board circuit','circuit printed board'],a:0,e:'<b>printed circuit board (PCB)</b>. En inglés técnico el orden de los compuestos va de izquierda (modificador) a derecha (núcleo).'},
 {q:'A circuit that is not closed is:',o:['an opened circuit','an open circuit','a broken circuit'],a:1,e:'<b>open circuit</b> (adjetivo, no participio). El contrario es <i>closed circuit</i>, y un fallo de aislamiento es un <i>short circuit</i>.'},
 {q:'«El circuito se alimenta a 5 V» se dice:',o:['The circuit is fed with 5 V','The circuit is powered by 5 V','The circuit is alimented at 5 V'],a:1,e:'<b>powered by</b> (o <i>supplied with</i>). «Alimented» no existe en inglés.'},
 {q:'A signal that varies continuously is:',o:['analogic','analogical','analogue (UK) / analog (US)'],a:2,e:'<b>analogue</b> en inglés británico y <b>analog</b> en americano. «Analogic» no se usa en este sentido.'},
 {q:'To measure voltage you connect the meter:',o:['in series','in parallel','in cascade'],a:1,e:'<b>in parallel</b> para tensión, <i>in series</i> para corriente. Es una pregunta clásica de comprensión lectora técnica.'},
]});

/* T6 · Automation & control */
SIMS.control=el=>match(el,{intro:'Automatización y control: empareja cada término con su definición.',
 cols:['Term','Definition'],
 hint:'La terminología de control es casi idéntica en los dos idiomas, pero cuidado con <i>actual</i> (real, no «actual») y <i>eventually</i> (finalmente, no «eventualmente»).',
 items:[
 {a:'setpoint',b:'the value the system is required to reach'},
 {a:'feedback',b:'information about the output sent back to the controller'},
 {a:'actuator',b:'the element that physically acts on the process'},
 {a:'overshoot',b:'the amount by which the response exceeds its final value'},
 {a:'steady-state error',b:'the difference that remains once the response has settled'},
 {a:'open-loop',b:'control without measuring the output'},
 {a:'PLC',b:'industrial computer used to control machinery'},
 {a:'troubleshooting',b:'finding and fixing the cause of a fault'},
]});

/* T7 · Robotics */
SIMS.robotica=el=>quiz(el,{intro:'Robótica: términos y estructuras.',
 hint:'Fíjate en que casi todos los términos de robótica son compuestos de dos palabras: <i>end effector</i>, <i>degree of freedom</i>, <i>payload capacity</i>.',
 items:[
 {q:'The tool at the end of a robot arm is called the:',o:['end effector','final tool','terminal device'],a:0,e:'<b>end effector</b>: puede ser una pinza (<i>gripper</i>), una herramienta de soldadura, una ventosa (<i>suction cup</i>)…'},
 {q:'The number of independent movements a robot can make is its number of:',o:['freedom degrees','degrees of freedom','liberty degrees'],a:1,e:'<b>degrees of freedom (DOF)</b>. El orden es fijo.'},
 {q:'The maximum weight a robot can handle is its:',o:['payload','overload','workload'],a:0,e:'<b>payload</b>. <i>Overload</i> es sobrecarga y <i>workload</i> es carga de trabajo (de personas o de un sistema).'},
 {q:'«El robot se programa mediante un panel portátil» →',o:['The robot is programmed using a teach pendant','The robot programs with a teaching panel','The robot is programmed with a pendant teacher'],a:0,e:'<b>teach pendant</b> es el nombre estándar de la consola de programación.'},
 {q:'Choose the correct passive sentence:',o:['The parts are picked up by the gripper','The parts picked up by the gripper','The gripper is picked up the parts'],a:0,e:'La <b>pasiva</b> domina en la descripción de procesos: <i>be + participio + by</i>.'},
 {q:'A robot that works alongside humans is a:',o:['coworker robot','cobot','humanoid'],a:1,e:'<b>cobot</b> (<i>collaborative robot</i>). Es un acrónimo ya habitual en textos técnicos.'},
]});

/* T8 · Chemical engineering & processes */
SIMS.procesos=el=>gaps(el,{intro:'Describir un proceso: ordena el discurso con el conector adecuado.',
 opciones:['First','Then','After that','Once','While','Finally','As a result','However'],
 hint:'En la descripción de procesos se usa <b>presente simple en pasiva</b> y conectores de secuencia. Es exactamente lo que se evalúa en la parte de writing del portafolio.',
 lines:[
 {t:'___, the raw material is fed into the reactor.',a:'First',e:'apertura de la secuencia.'},
 {t:'___ the mixture has reached 300 °C, the catalyst is added.',a:'Once',e:'<b>Once</b> + presente = «una vez que».'},
 {t:'___ the reaction takes place, the temperature is monitored continuously.',a:'While',e:'<b>While</b> para simultaneidad.'},
 {t:'___, the product is cooled down and filtered.',a:'After that',e:'secuencia intermedia; <i>Then</i> también valdría, pero no se repite dos veces seguidas.'},
 {t:'___, the yield drops if the pressure is not kept constant.',a:'However',e:'<b>However</b> introduce contraste, y siempre va seguido de coma.'},
 {t:'___, the purity of the product is above 99 %.',a:'As a result',e:'<b>As a result</b> introduce consecuencia.'},
 {t:'___, the product is packaged and stored.',a:'Finally',e:'cierre de la secuencia.'},
]});

/* T9 · Academic and formal English */
SIMS.registro=el=>quiz(el,{intro:'Registro: decide si cada frase es formal, neutra o informal (ejercicio de la clase 1).',
 hint:'La prueba escrita pregunta por el registro con frases muy parecidas a éstas. Regla rápida: contracciones y phrasal verbs ⇒ informal; verbos de origen latino (proceed, verify, require) ⇒ formal.',
 items:[
 {q:'«You got a sec?»',o:['formal','neutral','informal'],a:2,e:'<b>Informal</b>: falta el auxiliar («Have you got…?») y usa la abreviatura <i>sec</i>.'},
 {q:'«Could I disturb you for a minute?»',o:['formal','neutral','informal'],a:0,e:'<b>Formal</b>: <i>could</i> + verbo elevado (<i>disturb</i>).'},
 {q:'«Can I ask you something?»',o:['formal','neutral','informal'],a:1,e:'<b>Neutral</b>: válido en casi cualquier contexto.'},
 {q:'«We need to verify the data before we proceed.»',o:['formal','neutral','informal'],a:0,e:'<b>Formal</b>: <i>verify</i> y <i>proceed</i> frente a <i>check</i> y <i>carry on</i>.'},
 {q:'«We need to check the data before we continue.»',o:['formal','neutral','informal'],a:1,e:'<b>Neutral</b>: el punto medio entre las otras dos.'},
 {q:'«Just FYI, we’d like to fix up a meeting in October.»',o:['formal','neutral','informal'],a:2,e:'<b>Informal</b>: sigla <i>FYI</i>, contracción <i>we’d</i> y phrasal verb <i>fix up</i>.'},
 {q:'«Just for your information, we would like to schedule another meeting in October.»',o:['formal','neutral','informal'],a:0,e:'<b>Formal</b>: sin contracciones, sigla desarrollada y <i>schedule</i>.'},
]});

/* T9b · Relative clauses */
SIMS.relativas=el=>gaps(el,{intro:'Oraciones de relativo: une cada par con el pronombre correcto (ejercicio de la clase 3).',
 opciones:['which','who','where','from where','whose','that'],
 hint:'Regla de oro: las <b>explicativas van entre comas y nunca llevan <i>that</i></b>; las especificativas no llevan coma y sí admiten <i>that</i>.',
 lines:[
 {t:'A serious air disaster occurred with TWA flight 800, ___ crashed into the Atlantic.',a:'which',e:'explicativa, antecedente de cosa.'},
 {t:'The accident was caused by a build-up of fuel vapours in a fuel tank, ___ exploded.',a:'which',e:'explicativa; con coma, <i>that</i> sería incorrecto.'},
 {t:'The last radio transmission was received at Boston, ___ the weather was fine.',a:'where',e:'antecedente de lugar.'},
 {t:'The explosion was seen by another pilot, ___ was flying in the area at the time.',a:'who',e:'antecedente de persona.'},
 {t:'The other pilot landed at Boston airport, ___ he contacted the investigators.',a:'from where',e:'«desde donde»: preposición + relativo.'},
 {t:'The engineer ___ report we read yesterday will visit the plant.',a:'whose',e:'posesivo: «cuyo informe».'},
 {t:'This is the sensor ___ failed during the test.',a:'that',e:'especificativa, sin coma: aquí <i>that</i> es perfectamente correcto (también <i>which</i>).'},
]});

/* T10 · Presentations */
SIMS.presentacion=el=>match(el,{intro:'Presentación oral: empareja cada momento con la frase hecha que le corresponde.',
 cols:['Moment','Useful phrase'],
 hint:'La presentación en grupo vale el <b>20 %</b>. Memorizar estas fórmulas da fluidez y evita traducir del español sobre la marcha.',
 items:[
 {a:'Greeting the audience',b:'Good morning everyone, and thank you for coming.'},
 {a:'Stating the topic',b:'Today I’m going to talk about…'},
 {a:'Outlining the structure',b:'I’ve divided my talk into three parts.'},
 {a:'Moving to the next point',b:'That brings me to my next point…'},
 {a:'Referring to a visual',b:'As you can see from this graph…'},
 {a:'Emphasising',b:'I’d like to stress that…'},
 {a:'Summarising',b:'To sum up, the main findings are…'},
 {a:'Inviting questions',b:'I’d be happy to answer any questions.'},
]});

/* Extra · Falsos amigos */
SIMS.falsos=el=>quiz(el,{intro:'Falsos amigos y errores típicos de hispanohablantes.',
 hint:'Estos errores se penalizan en el portafolio escrito, porque cambian el significado de la frase sin que el texto parezca incorrecto.',
 items:[
 {q:'«Actualmente el sistema funciona bien» →',o:['Actually, the system works well','Currently, the system works well','At the actuality the system works well'],a:1,e:'<b>Currently / At present</b>. <i>Actually</i> significa «en realidad».'},
 {q:'«Eventualmente puede fallar» →',o:['It may eventually fail','It may occasionally fail','It may eventual fail'],a:1,e:'<b>occasionally</b>. <i>Eventually</i> significa «finalmente, con el tiempo».'},
 {q:'«Asistir a una reunión» →',o:['to assist a meeting','to attend a meeting','to assist to a meeting'],a:1,e:'<b>attend</b>. <i>To assist</i> es «ayudar».'},
 {q:'«Un dispositivo sensible» (que detecta poco ruido) →',o:['a sensible device','a sensitive device','a sensorial device'],a:1,e:'<b>sensitive</b>. <i>Sensible</i> en inglés significa «sensato, razonable».'},
 {q:'«La fábrica» →',o:['the fabric','the factory','the manufacture'],a:1,e:'<b>factory</b> o <i>plant</i>. <i>Fabric</i> es «tejido».'},
 {q:'«Realizar un ensayo» →',o:['to realise a test','to carry out a test','to make a test'],a:1,e:'<b>carry out / perform / conduct</b> a test. <i>To realise</i> es «darse cuenta».'},
 {q:'«Datos» como sujeto en inglés técnico →',o:['The data is reliable','The data are reliable','Both are accepted'],a:2,e:'<b>Ambas</b>: en textos científicos clásicos <i>data</i> es plural (<i>data are</i>), pero el uso singular está hoy admitido. Lo importante es ser <b>coherente</b> en todo el documento.'},
]});

document.querySelectorAll('[data-sim]').forEach(el=>{const f=SIMS[el.dataset.sim];if(f)f(el);});
})();
