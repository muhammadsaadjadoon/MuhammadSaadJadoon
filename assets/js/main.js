const toggle=document.querySelector('.nav-toggle');
const nav=document.querySelector('.nav-links');

function setMenu(open){
  if(!toggle||!nav)return;
  nav.classList.toggle('open',open);
  document.body.classList.toggle('menu-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
  const icon=toggle.querySelector('i');
  if(icon){
    icon.classList.toggle('fa-bars',!open);
    icon.classList.toggle('fa-xmark',open);
  }
}

if(toggle&&nav){
  toggle.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  document.addEventListener('click',e=>{
    if(nav.classList.contains('open')&&!nav.contains(e.target)&&!toggle.contains(e.target))setMenu(false);
  });
  window.addEventListener('resize',()=>{if(innerWidth>980)setMenu(false)},{passive:true});
}

const lines=['I build intelligent AI systems 🤖','I engineer Machine Learning solutions 📊','I develop Generative AI applications ✨','I connect AI models with full-stack products 💻'];
const t=document.getElementById('typed');let li=0,ci=0,del=false;
function loop(){if(!t)return;let s=lines[li];t.textContent=s.slice(0,ci);if(!del&&ci<s.length){ci++;setTimeout(loop,45)}else if(!del){del=true;setTimeout(loop,1400)}else if(ci>0){ci--;setTimeout(loop,24)}else{del=false;li=(li+1)%lines.length;setTimeout(loop,240)}}
if(t)setTimeout(loop,350);

if('IntersectionObserver' in window){
  const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.07});
  document.querySelectorAll('.reveal').forEach(e=>ro.observe(e));


}else{
  document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
}

const topBtn=document.querySelector('.to-top');
if(topBtn){
  addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>500),{passive:true});
}

// Keep the active navigation underline aligned with the section in view.
(function setupSectionNavigation(){
  const header=document.querySelector('.navbar');
  const links=[...document.querySelectorAll('.nav-links a')];
  const sections=links.map(link=>{
    const href=link.getAttribute('href')||'';
    if(!href.startsWith('#'))return null;
    const section=document.getElementById(href.slice(1));
    return section?{link,section}:null;
  }).filter(Boolean);
  function activate(selected){
    links.forEach(link=>{
      const active=link===selected;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  if(!sections.length){
    const projects=links.find(link=>(link.getAttribute('href')||'').endsWith('#projects'));
    if(projects)activate(projects);
    return;
  }
  let queued=false;
  function update(){
    queued=false;
    const headerHeight=header?header.getBoundingClientRect().height:0;
    const marker=headerHeight+Math.min(100,window.innerHeight*0.15);
    let current=sections[0];
    for(const entry of sections){
      if(entry.section.getBoundingClientRect().top<=marker)current=entry;
    }
    if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-2){
      current=sections[sections.length-1];
    }
    activate(current.link);
  }
  function schedule(){
    if(!queued){queued=true;window.requestAnimationFrame(update);}
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('load',schedule);
  if('ResizeObserver' in window){
    const observer=new ResizeObserver(schedule);
    if(header)observer.observe(header);
    sections.forEach(entry=>observer.observe(entry.section));
  }
  update();
})();
