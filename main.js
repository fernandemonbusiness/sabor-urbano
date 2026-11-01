import './style.css'
const $=(s,r=document)=>r.querySelector(s)
const U=(id,w=800)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

// Navbar
const nav=$('#nav'),links=$('#links'),burger=$('#burger')
addEventListener('scroll',()=>nav.classList.toggle('small',scrollY>60),{passive:true})
burger.onclick=()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)}
links.onclick=e=>{if(e.target.matches('a')){links.classList.remove('open');burger.setAttribute('aria-expanded',false)}}

// Reveal + counters
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return
  e.target.classList.add('in');io.unobserve(e.target)
  e.target.querySelectorAll('[data-n]').forEach(c=>{
    const n=+c.dataset.n;let t0
    const f=t=>{t0??=t;const p=Math.min((t-t0)/1500,1);c.textContent=Math.round(n*p).toLocaleString('es');if(p<1)requestAnimationFrame(f)}
    requestAnimationFrame(f)
  })
}),{threshold:.15})
document.querySelectorAll('.reveal').forEach(el=>io.observe(el))

// Menu (contenido de ejemplo)
const MENU={
 Entradas:[['Ceviche de trucha','Leche de tigre de ají amarillo, maíz tostado, cebolla encurtida','48','P SG'],['Croquetas de quinua','Bechamel de queso andino, alioli de hierbas','36','V'],['Carpaccio de res','Parmesano, rúcula, aceite de oliva y limón','52','SG']],
 'Platos Fuertes':[['Lomo en costra de hierbas','Puré de papa nativa, reducción de vino tinto','98','SG'],['Risotto de hongos','Hongos de temporada, queso añejo, aceite de trufa','82','V SG'],['Pasta de ají fresco','Tagliatelle casera, camarones, salsa de ají','88','P']],
 Postres:[['Crème brûlée de cacao','Cacao local, sal de mar, frutos rojos','34','V SG'],['Tarta de maracuyá','Base de galleta, merengue flameado','32','V'],['Helado de coca','Helado artesanal, crocante de almendra','30','V SG']],
 Bebidas:[['Pisco sour de autor','Pisco, limón, jarabe de hierbas','38','SG'],['Limonada de jengibre','Limón, jengibre, hierbabuena','18','V SG'],['Vino de la casa (copa)','Tinto o blanco, selección del sommelier','35','V SG']]}
const tabs=$('#tabs'),list=$('#dishes')
const show=cat=>{
  tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.textContent===cat))
  list.innerHTML=MENU[cat].map(([n,d,p,t])=>`<li><b>${n}${t.split(' ').map(x=>`<span class="tag" title="${{V:'Vegetariano',P:'Picante',SG:'Sin gluten'}[x]}">${x}</span>`).join('')}</b><span class="pr">Bs ${p}</span><p>${d}</p></li>`).join('')
}
Object.keys(MENU).forEach(c=>{const b=document.createElement('button');b.textContent=c;b.setAttribute('role','tab');b.onclick=()=>show(c);tabs.append(b)})
show('Entradas')
$('#picks').innerHTML=[['1565299624946-b28f40a0ae38','Lomo en costra de hierbas'],['1476224203421-9ac39bcb3327','Risotto de hongos'],['1551218808-94e220e084d2','Crème brûlée de cacao']].map(([i,n])=>`<figure><img loading="lazy" src="${U(i,600)}" alt="${n}"/><figcaption>${n}</figcaption></figure>`).join('')

// Galería + lightbox
const G=['1414235077428-338989a2e8c0','1517248135467-4c7edcad34c4','1555939594-58d7cb561ad1','1504674900247-0877df9cc836','1577219491135-ce391730fb2c','1540189549336-e6e99c3679fe','1559339352-11d035aa65de','1476224203421-9ac39bcb3327','1551218808-94e220e084d2']
const H=[520,380,440,400,560,360,480,420,500]
$('#gal').innerHTML=G.map((id,i)=>`<button data-id="${id}" aria-label="Ampliar foto ${i+1}"><img loading="lazy" width="600" height="${H[i]}" src="${U(id,600)}" alt="Foto ${i+1} de Sabor Urbano"/></button>`).join('')
const lb=$('#lb')
$('#gal').onclick=e=>{const b=e.target.closest('button');if(!b)return;$('img',lb).src=U(b.dataset.id,1600);lb.hidden=false}
lb.onclick=()=>lb.hidden=true
addEventListener('keydown',e=>{if(e.key==='Escape')lb.hidden=true})

// Reservas
const f=$('#form'),hora=f.hora
for(let h=12;h<=22;h++)for(const m of['00','30']){if(h===15&&m==='30'||h===16||h===17||h===18&&m==='00'||h===22&&m==='30')continue;hora.add(new Option(`${h}:${m}`,`${h}:${m}`))}
f.fecha.min=new Date().toISOString().split('T')[0]
f.onsubmit=e=>{
  e.preventDefault()
  const err=$('#err');err.textContent=''
  if(!f.checkValidity()){err.textContent='Revisa los campos marcados: todos son obligatorios salvo los comentarios.';f.reportValidity();return}
  // TODO: enviar a tu backend / WhatsApp / servicio de email
  $('#okmsg').textContent=`${f.nombre.value}, te esperamos el ${f.fecha.value} a las ${f.hora.value} (${f.personas.value} personas). Te confirmaremos a ${f.email.value}.`
  f.hidden=true;$('#ok').hidden=false
}

// Testimonios
const T=[['María L.','La mejor cena del año. El lomo es increíble y el servicio, impecable.'],['Carlos P.','Sabores locales con técnica europea. Volveremos con toda la familia.'],['Ana R.','Ambiente cálido y postres espectaculares. Reservar fue muy fácil.'],['Diego M.','Una propuesta distinta y honesta. El ceviche de trucha es imperdible.']]
const car=$('#car')
car.innerHTML=T.map(([n,t],i)=>`<blockquote class="${i?'':'on'}"><p>“${t}”</p><footer><span class="av">${n[0]}</span>${n} · ★★★★★</footer></blockquote>`).join('')
let k=0;setInterval(()=>{const q=car.children;q[k].classList.remove('on');k=(k+1)%q.length;q[k].classList.add('on')},5000)

// Newsletter
$('#news').onsubmit=e=>{e.preventDefault();$('#nmsg').textContent='¡Gracias! Ya estás suscrito.';e.target.reset()}
