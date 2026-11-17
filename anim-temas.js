/* Inglés técnico: una animación por tema */
(function(){var M=window.MANIM;if(!M)return;var U=M.util,C=M.C,nf=U.nf,lerp=U.lerp,ease=U.ease,seg=U.seg,clamp=U.clamp,RG=U.RG,W=640;

/* T1 Energy: comparativos y superlativos */
var EN=[['solar PV',45],['onshore wind',40],['gas',70],['coal',110],['nuclear',95]];
M.reg('ing-t1',M.barras({title:'Energy: comparing costs',H:560,dur:18,n:5,p:[0,1],u:function(t,d){return ease(seg(t,1,8));},ax:{xr:[-0.6,4.6],yr:[0,125],xt:[],yt:[25,50,75,100],yd:0,xl:'',yl:'$/MWh'},h:280,bw:0.6,
 val:function(i,p){return EN[i][1]*p;},lab:function(i){return EN[i][0];},col:function(i){return i<2?'ok':'m';},
 extra:function(D,A,p,t){var s=['Wind is cheaper than gas.','Coal is more expensive than nuclear.','Onshore wind is the cheapest source.','Coal is the most expensive.'],k=Math.min(3,Math.floor(seg(t,9,17)*4));if(t>9)D.text(s[k],W/2,470,{s:24,a:'center',c:C.m,bold:true,it:false});},
 caps:[[9,'Los datos (cifras ilustrativas) se describen comparando: adjetivo corto + <b>-er than</b> (<i>cheaper than</i>), adjetivo largo con <b>more … than</b> (<i>more expensive than</i>).'],[99,'Para el extremo del grupo, superlativo: <b>the -est</b> (<i>the cheapest</i>) o <b>the most …</b> (<i>the most expensive</i>). Ojo con los irregulares: good → better → the best.']]}));

/* T2 Materials: adjetivo → sustantivo */
M.reg('ing-t2',M.pasos({title:'Materials: properties as nouns',H:560,dur:20,lines:[{s:'adjective  →  noun',it:false,b:true},{s:'strong  →  strength'},{s:'hard  →  hardness'},{s:'tough  →  toughness'},{s:'ductile  →  ductility'},{s:'elastic  →  elasticity'},{s:'Steel has a high tensile strength.',c:'m',it:false}],
 caps:[[10,'Para hablar de propiedades se usa el sustantivo: <i>strong → strength</i>, <i>hard → hardness</i>. Sufijos típicos: <b>-ness</b>, <b>-ity</b>, <b>-th</b>.'],[99,'Con el sustantivo se forman frases técnicas: <i>high strength</i>, <i>low ductility</i>, <i>good corrosion resistance</i>.']]}));

/* T3 Manufacturing: voz pasiva */
M.reg('ing-t3',M.pasos({title:'Manufacturing: describing a process (passive)',H:560,dur:22,lines:[{s:'active: The operator heats the billet.',c:'mut'},{s:'passive: The billet is heated.',c:'m'},{s:'Then it is rolled into a sheet.',c:'m'},{s:'Next, the sheet is cut to length.',c:'m'},{s:'Finally, the parts are inspected.',c:'m'},{s:'be (is/are) + past participle',it:false,b:true}],
 caps:[[10,'En procesos importa la acción, no quién la hace: se usa la <b>pasiva</b>, <i>is/are + participio</i>: <i>is heated</i>, <i>are inspected</i>.'],[99,'Los conectores de secuencia (<i>first, then, next, after that, finally</i>) ordenan los pasos.']]}));

/* T4 describing devices: dimensiones */
M.reg('ing-t4',M.base({title:'Describing devices: dimensions and shape',H:540,dur:16,caps:[[5,'Para dar medidas: número + unidad + adjetivo: <i>40 mm long</i>, <i>20 mm wide</i>, <i>5 mm thick</i>.'],[11,'O con sustantivos: <i>a length of 40 mm</i>, <i>a diameter of 8 mm</i>.'],[99,'La forma se describe con adjetivos: <i>rectangular, cylindrical, L-shaped, hollow</i>. Ejemplo: <i>It is an L-shaped bracket with two 8 mm holes.</i>']]},
 function(D,t){D.path([[150,330],[450,330],[450,280],[220,280],[220,140],[150,140]],C.m,2.6,RG(C.m,.15));D.ring(185,180,12,C.m,2);D.ring(400,305,12,C.m,2);
  var s=[[2,'It is 40 mm long.',function(){D.line(150,360,450,360,C.f,1.6);D.head(150,360,Math.PI,C.f,8);D.head(450,360,0,C.f,8);}],[5,'It is 25 mm high.',function(){D.line(120,140,120,330,C.f,1.6);D.head(120,140,-Math.PI/2,C.f,8);D.head(120,330,Math.PI/2,C.f,8);}],[8,'The holes have a diameter of 8 mm.',function(){D.arrow(250,200,193,186,C.g,1.6);}],[11,'It is an L-shaped bracket.',function(){}]];
  s.forEach(function(q,i){if(t<q[0])return;q[2]();D.text(q[1],W/2,420+i*0,{s:0.1});});var cur=s.filter(function(q){return t>=q[0];}).pop();if(cur)D.text(cur[1],W/2,440,{s:24,a:'center',c:C.m,bold:true,it:false});}));

/* T5 Electronics: código de colores */
var COL=[['black','#222'],['brown','#7b4a1e'],['red','#d22'],['orange','#f80'],['yellow','#ee0'],['green','#2a2'],['blue','#22d'],['violet','#a3c'],['grey','#888'],['white','#eee']];
var RES=[[4,7,2],[1,0,3],[2,2,1],[5,6,4]];
M.reg('ing-t5',M.base({title:'Electronics: reading a resistor',H:520,dur:16,caps:[[5,'Read it aloud: <i>yellow, violet, red</i>. The first two bands are digits, the third is the multiplier.'],[11,'4 7 × 10² = 4700 Ω: «four point seven kilohms» (4.7 kΩ). In English the decimal point is a <b>point</b>, not a comma.'],[99,'Useful verbs: <i>the resistor limits the current</i>, <i>the capacitor stores charge</i>, <i>the diode allows current to flow in one direction</i>.']]},
 function(D,t){var k=Math.min(3,Math.floor(t/4)),r=RES[k],v=(r[0]*10+r[1])*Math.pow(10,r[2]);D.line(80,220,560,220,C.mut,4);D.rect(200,180,240,80,C.w,'#d9c39a',2);
  r.forEach(function(c,i){D.rect(240+i*50,180,22,80,null,COL[c][1]);});D.rect(410,180,14,80,null,'#c9a227');
  r.forEach(function(c,i){D.text(COL[c][0],251+i*50,300,{s:15,a:'center',c:C.m,it:false});});
  var txt=v>=1e6?nf(v/1e6,1)+' MΩ':(v>=1000?nf(v/1000,1)+' kΩ':v+' Ω');D.text((r[0]*10+r[1])+' × 10^{'+r[2]+'} = '+txt.replace(',','.'),W/2,380,{s:26,a:'center',c:C.m,bold:true});}));

/* T6 Automation: condicionales con un diagrama */
M.reg('ing-t6',M.base({title:'Automation & control: if… then…',H:540,dur:18,caps:[[6,'Las reglas de un automatismo se expresan con el <b>zero / first conditional</b>: <i>If the level rises above the limit, the pump stops.</i>'],[12,'Presente en las dos partes para hechos que siempre ocurren; <i>will</i> en la principal para predicciones: <i>If it overheats, the system will shut down.</i>'],[99,'Otros conectores útiles: <i>when, unless, as soon as, until</i>: <i>The valve stays open until the tank is full.</i>']]},
 function(D,t){var lvl=0.5+0.45*Math.sin(t*0.6),hi=lvl>0.8;D.rect(80,140,140,240,C.w,null,2);D.rect(82,140+238*(1-lvl),136,238*lvl,null,RG(C.f,.35));D.line(70,140+240*0.2,230,140+240*0.2,C.bad,1.6,[5,4]);D.text('limit',236,140+240*0.2+5,{s:14,c:C.bad,it:false});
  D.rect(300,150,120,50,C.m,RG(C.m,.12),2);D.text('level > limit?',360,181,{s:16,a:'center',it:false});D.arrow(420,175,470,175,hi?C.ok:C.mut,2);D.text('yes',445,165,{s:13,a:'center',c:C.ok,it:false});D.rect(470,150,120,50,hi?C.bad:C.mut,RG(hi?C.bad:C.mut,.15),2);D.text('pump stops',530,181,{s:16,a:'center',it:false});
  D.arrow(360,200,360,250,!hi?C.ok:C.mut,2);D.text('no',372,230,{s:13,c:C.ok,it:false});D.rect(300,250,120,50,!hi?C.ok:C.mut,RG(!hi?C.ok:C.mut,.15),2);D.text('pump runs',360,281,{s:16,a:'center',it:false});
  D.text(hi?'If the level rises above the limit, the pump stops.':'If the level is below the limit, the pump keeps running.',W/2,440,{s:20,a:'center',c:C.m,bold:true,it:false});}));

/* T7 Robotics: movimiento */
M.reg('ing-t7',M.base({title:'Robotics: describing movement',H:540,dur:18,caps:[[6,'Verbos de movimiento: <i>rotate, extend, retract, lift, lower, grip, release</i>.'],[12,'Con adverbios y preposiciones: <i>rotates clockwise</i>, <i>moves up</i>, <i>extends towards the part</i>.'],[99,'Presente simple para secuencias: <i>The arm rotates 90° clockwise, then the gripper closes.</i>']]},
 function(D,t){var ph=Math.min(4,Math.floor(t/3.6)),u=ease((t%3.6)/3.6),bx=200,by=380,a1=[0.6,0.6-0.8*u,-0.2,-0.2,-0.2][ph],L2=[90,90,90+50*u,140,140-50*u][ph],up=[0,0,0,-30*u,-30][ph];
  D.rect(bx-40,by,80,20,C.mut,RG(C.mut,.4),2);var j=[bx+120*Math.cos(Math.PI/2-a1),by-120*Math.sin(Math.PI/2-a1)+up],e=[j[0]+L2,j[1]];D.line(bx,by,j[0],j[1],C.m,10);D.line(j[0],j[1],e[0],e[1],C.f,8);D.dot(bx,by,9,C.w);D.dot(j[0],j[1],8,C.w);
  var g=ph>=3?4:12;D.line(e[0],e[1]-g,e[0]+18,e[1]-g,C.g,4);D.line(e[0],e[1]+g,e[0]+18,e[1]+g,C.g,4);var j2=[bx+120*Math.cos(Math.PI/2+0.2),by-120*Math.sin(Math.PI/2+0.2)],e2=[j2[0]+140+18,j2[1]],bp=ph>=3?[e[0]+18,e[1]]:e2;D.rect(bp[0]-6,bp[1]-14,28,28,C.hl,RG(C.hl,.3),2);
  D.text(['The arm is in its home position.','The arm rotates clockwise.','The arm extends towards the part.','The gripper closes and lifts the part.','The arm retracts.'][ph],W/2,460,{s:22,a:'center',c:C.m,bold:true,it:false});}));

/* T8 Academic English */
M.reg('ing-t8',M.pasos({title:'Academic English: from informal to formal',H:560,dur:22,lines:[{s:'informal: We got really good results.',c:'mut'},{s:'formal: The results obtained were highly satisfactory.',c:'m'},{s:'informal: Lots of tests show this.',c:'mut'},{s:'formal: Numerous studies indicate that…',c:'m'},{s:'hedging: The data suggest that the method may reduce costs.',c:'g'},{s:'avoid contractions, “I think”, vague words',it:false,b:true}],
 caps:[[10,'El registro académico evita contracciones y palabras vagas, y prefiere la pasiva y verbos precisos: <i>obtain, indicate, demonstrate</i>.'],[99,'<b>Hedging</b>: se suavizan las afirmaciones con <i>may, might, suggest, appear to</i> para no afirmar más de lo que prueban los datos.']]}));

/* T9 Presentations: signposting */
M.reg('ing-t9',M.pasos({title:'Presentations: signposting',H:560,dur:22,lines:[{s:'Opening: Today I’m going to talk about…',c:'m'},{s:'Structure: First…, then…, finally…',c:'m'},{s:'Moving on: Let’s move on to…',c:'m'},{s:'Visuals: As you can see in this graph…',c:'m'},{s:'Summary: To sum up, …',c:'m'},{s:'Questions: Are there any questions?',c:'m'}],
 caps:[[10,'Las frases de <b>signposting</b> guían al público: anuncian qué viene, marcan cambios de sección y resumen.'],[99,'Para gráficos: <i>As you can see…</i>, <i>This chart shows…</i>, <i>There is a sharp increase in…</i>. Termina siempre con un resumen y abre turno de preguntas.']]}));

/* T10 Business English: email formal */
M.reg('ing-t10',M.pasos({title:'Professional English: a formal email',H:560,dur:22,lines:[{s:'Dear Ms Smith,',c:'m',a:'left',x:80},{s:'I am writing to enquire about the PLC training course.',a:'left',x:80},{s:'Could you please send me the dates and prices?',a:'left',x:80},{s:'I look forward to hearing from you.',a:'left',x:80},{s:'Kind regards,',c:'m',a:'left',x:80},{s:'Ana García',c:'m',a:'left',x:80}],
 caps:[[10,'Estructura: saludo (<i>Dear Ms…</i>), motivo (<i>I am writing to…</i>), petición cortés (<i>Could you please…</i>).'],[99,'Cierre: <i>I look forward to hearing from you</i> + despedida (<i>Kind regards</i> / <i>Yours sincerely</i> si sabes el nombre). Sin contracciones.']]}));
})();
