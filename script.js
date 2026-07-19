const GROUNDS = [
  { name:'Total Football Ground', area:'6 Park Road, Chak Shahzad, Islamabad', price:5000, tags:['3G Turf','Floodlights','5 & 7-a-side'], hue:150 },
  { name:'Khaldunia Football Ground', area:'Street 94, G-11/3, Islamabad', price:3500, tags:['Outdoor turf','Floodlights'], hue:35 },
  { name:'Football Ground H-8/4', area:'H-8/4, Islamabad', price:3000, tags:['Community ground','Floodlights'], hue:205 },
  { name:'Kiran FC Ground', area:'I-10, Islamabad', price:3200, tags:['Club ground','Academy nearby'], hue:10 },
  { name:'PTCL Football Ground', area:'G-8/4, Islamabad', price:3000, tags:['Open ground','Floodlights'], hue:150 },
  { name:'Islamabad Club Futsal Court', area:'F-5/2, Islamabad Club', price:4500, tags:['Indoor futsal','Members & guests'], hue:35 },
];

/* Photo-style floodlit pitch banner, built from layered gradients + SVG (no external images) */
function GroundBanner(hue){
  const wrap = document.createElement('div');
  wrap.className = 'sky';
  wrap.style.position = 'absolute'; wrap.style.inset = '0';
  wrap.style.background = `
    radial-gradient(160px 120px at 20% 0%, hsla(${hue},70%,60%,0.35), transparent 60%),
    radial-gradient(160px 120px at 80% 0%, hsla(${hue+20},70%,55%,0.25), transparent 60%),
    linear-gradient(180deg, hsl(${hue},35%,10%) 0%, hsl(${hue},40%,7%) 55%, hsl(${hue},45%,5%) 100%)
  `;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 300 140');
  svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
  svg.style.position='absolute'; svg.style.inset='0';
  const mk=(tag,attrs)=>{ const el=document.createElementNS(ns,tag); Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v)); return el; };
  // turf strips
  svg.appendChild(mk('rect',{x:0,y:96,width:300,height:44,fill:`hsl(${hue},40%,12%)`}));
  for(let i=0;i<6;i++){
    svg.appendChild(mk('rect',{x:i*50,y:96,width:25,height:44,fill:'rgba(255,255,255,0.03)'}));
  }
  svg.appendChild(mk('line',{x1:0,y1:96,x2:300,y2:96,stroke:'rgba(255,255,255,0.15)','stroke-width':1}));
  svg.appendChild(mk('ellipse',{cx:150,cy:96,rx:46,ry:8,fill:'none',stroke:'rgba(255,255,255,0.2)','stroke-width':1}));
  // floodlight poles + glow
  [26, 274].forEach(x=>{
    svg.appendChild(mk('rect',{x:x-1.5,y:20,width:3,height:78,fill:'rgba(255,255,255,0.12)'}));
    svg.appendChild(mk('circle',{cx:x,cy:18,r:5,fill:'#fff', opacity:0.9}));
    svg.appendChild(mk('circle',{cx:x,cy:18,r:16,fill:'#fff', opacity:0.15}));
  });
  wrap.appendChild(svg);
  return wrap;
}

function GroundCard(g){
  const el = document.createElement('div');
  el.className = 'ground-card';
  const banner = document.createElement('div');
  banner.className = 'ground-banner';
  banner.appendChild(GroundBanner(g.hue));
  const vg = document.createElement('div'); vg.className='vignette'; banner.appendChild(vg);
  const label = document.createElement('div'); label.className='name-on-banner'; label.textContent = g.tags[0]; banner.appendChild(label);
  el.appendChild(banner);
  const body = document.createElement('div');
  body.className = 'ground-body';
  body.innerHTML = `
    <div class="ground-name">${g.name}</div>
    <div class="ground-addr">${g.area}</div>
    <div class="ground-tags">${g.tags.map(t=>`<span class="mini-tag">${t}</span>`).join('')}</div>
    <div class="ground-meta">
      <span class="ground-price">PKR ${g.price.toLocaleString()}<span>/hour approx</span></span>
      <span class="open-tag">Open 24h</span>
    </div>
    <button class="btn btn-primary btn-sm book-btn" style="margin-top:0.6rem;">Book this ground</button>
  `;
  el.appendChild(body);
  body.querySelector('.book-btn').addEventListener('click', () => openModal(g.name));
  return el;
}

const groundsGrid = document.getElementById('groundsGrid');
GROUNDS.forEach(g => groundsGrid.appendChild(GroundCard(g)));

/* MODAL */
const modalOverlay = document.getElementById('modalOverlay');
const modalGroundName = document.getElementById('modalGroundName');
const modalForm = document.getElementById('modalForm');
const modalSuccess = document.getElementById('modalSuccess');
function openModal(name){ modalGroundName.textContent = 'Book ' + name; modalForm.style.display='block'; modalSuccess.classList.remove('open'); modalOverlay.classList.add('open'); }
function closeModal(){ modalOverlay.classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalDone').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e)=>{ if(e.target===modalOverlay) closeModal(); });
document.getElementById('confirmBtn').addEventListener('click', ()=>{ modalForm.style.display='none'; modalSuccess.classList.add('open'); });

/* Mobile menu */
const menuBtn = document.getElementById('menuBtn');
const mobilePanel = document.getElementById('mobilePanel');
menuBtn.addEventListener('click', () => mobilePanel.classList.toggle('open'));
mobilePanel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobilePanel.classList.remove('open')));

/* ============================================================
   HERO MINI-GAME: click the ball, it shoots straight into a goal
   ============================================================ */
const stageBall = document.getElementById('stageBall');
const goalLeft = document.getElementById('goalLeft');
const goalRight = document.getElementById('goalRight');
const goalText = document.getElementById('goalText');
let kicking = false;
let nextSide = 'right';

function kickBall(){
  if(kicking) return;
  kicking = true;

  const stage = document.getElementById('heroStage');
  const stageRect = stage.getBoundingClientRect();
  const ballRect = stageBall.getBoundingClientRect();
  const targetGoal = nextSide === 'right' ? goalRight : goalLeft;
  const goalRect = targetGoal.getBoundingClientRect();

  const goalCenterX = goalRect.left + goalRect.width/2 - (ballRect.left + ballRect.width/2);
  const goalCenterY = goalRect.top + goalRect.height/2 - (ballRect.top + ballRect.height/2);

  const frames = [
    { transform:'translate(0,0) scale(1)', offset:0 },
    { transform:`translate(${goalCenterX*0.7}px, ${goalCenterY*0.55}px) scale(0.85) rotate(280deg)`, offset:0.55 },
    { transform:`translate(${goalCenterX}px, ${goalCenterY}px) scale(0.55) rotate(480deg)`, offset:1 },
  ];
  const anim = stageBall.animate(frames, { duration:650, easing:'cubic-bezier(.25,.6,.4,1)', fill:'forwards' });

  anim.onfinish = () => {
    goalText.classList.remove('show');
    void goalText.offsetWidth;
    goalText.classList.add('show');
    setTimeout(() => {
      stageBall.animate([
        { transform: stageBall.style.transform || `translate(${goalCenterX}px, ${goalCenterY}px) scale(0.55) rotate(480deg)`, offset:0 },
        { transform:'translate(0,0) scale(1) rotate(0deg)', offset:1 },
      ], { duration:500, easing:'ease-in-out', fill:'forwards' }).onfinish = () => {
        stageBall.style.transform = '';
        kicking = false;
      };
    }, 500);
  };

  nextSide = nextSide === 'right' ? 'left' : 'right';
}

stageBall.addEventListener('click', kickBall);
stageBall.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); kickBall(); } });

/* ============================================================
   SIGNATURE: ball follows scroll down the whole page,
   lands and bounces with a bright glow when you hit the bottom
   ============================================================ */
const ballLayer = document.getElementById('ballLayer');
const ballGlow = document.getElementById('ballGlow');
const ballEl = document.getElementById('ball');

const TOP_OFFSET = 90;      // where the ball sits when scrollY = 0
const BOTTOM_PAD = 70;      // gap from bottom of viewport for the ball's resting spot
let landed = false;
let rafPending = false;

function updateBall(){
  rafPending = false;
  const doc = document.documentElement;
  const scrollY = window.scrollY;
  const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(scrollY / maxScroll, 1);

  const travel = window.innerHeight - TOP_OFFSET - BOTTOM_PAD - 52;
  const y = TOP_OFFSET + progress * travel;

  const atBottom = progress > 0.985;

  if(atBottom && !landed){
    landed = true;
    ballLayer.style.transform = `translateY(${y}px)`;
    playLanding(y);
  } else if(!atBottom){
    landed = false;
    ballEl.style.animation = 'none';
    ballGlow.style.animation = 'none';
    ballLayer.style.transform = `translateY(${y}px) rotate(${progress*720}deg)`;
    ballGlow.style.opacity = 0.35 + progress*0.25;
  }
}

function playLanding(y){
  const keyframes = [
    { transform: `translateY(${y}px) scale(1,1)` , offset:0 },
    { transform: `translateY(${y+14}px) scale(1.25,0.7)`, offset:0.18 },
    { transform: `translateY(${y-26}px) scale(0.95,1.05)`, offset:0.4 },
    { transform: `translateY(${y+6}px) scale(1.12,0.85)`, offset:0.58 },
    { transform: `translateY(${y-10}px) scale(1,1)`, offset:0.75 },
    { transform: `translateY(${y}px) scale(1.05,0.93)`, offset:0.9 },
    { transform: `translateY(${y}px) scale(1,1)`, offset:1 },
  ];
  ballLayer.animate(keyframes, { duration: 1100, easing:'ease-out', fill:'forwards' });

  const glowFrames = [
    { opacity:0.5, filter:'blur(4px)', offset:0 },
    { opacity:1, filter:'blur(2px)', offset:0.18 },
    { opacity:0.6, filter:'blur(5px)', offset:0.4 },
    { opacity:0.9, filter:'blur(3px)', offset:0.58 },
    { opacity:0.7, filter:'blur(4px)', offset:0.75 },
    { opacity:0.85, filter:'blur(3px)', offset:1 },
  ];
  ballGlow.animate(glowFrames, { duration:1100, easing:'ease-out', fill:'forwards' });
}

window.addEventListener('scroll', () => {
  if(!rafPending){ rafPending = true; requestAnimationFrame(updateBall); }
}, { passive:true });
window.addEventListener('resize', () => { landed=false; updateBall(); });
updateBall();
