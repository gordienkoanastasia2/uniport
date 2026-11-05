const initialItems = [
  {id:1,title:"Основи програмування мовою Java",type:"Робота",description:"Навчальна робота з основ програмування та розв'язання практичних задач.",date:"20.10.2026",file:"java_basics.pdf"},
  {id:2,title:"Первинна підготовка рятувальника",type:"Робота",description:"Матеріал про підготовку рятувальника та взаємодію з постраждалими.",date:"18.10.2026",file:""},
  {id:3,title:"Участь у студентській конференції",type:"Сертифікат",description:"Сертифікат учасника науково-практичної конференції.",date:"12.10.2026",file:"certificate.pdf"},
  {id:4,title:"Курс цифрової грамотності",type:"Сертифікат",description:"Підтвердження проходження онлайн-курсу.",date:"05.10.2026",file:""},
  {id:5,title:"UniPort — цифрове портфоліо студента",type:"Проєкт",description:"Ідея платформи для збереження академічних досягнень.",date:"30.10.2026",file:""}
];
let items = JSON.parse(localStorage.getItem("uniportItems") || "null") || initialItems;
const pages = {dashboard:"Огляд",works:"Мої роботи",certificates:"Сертифікати",projects:"Проєкти та досвід",portfolio:"Моє портфоліо"};
const iconFor = type => type==="Сертифікат"?"bi-award":type==="Проєкт"?"bi-lightbulb":"bi-file-earmark-text";
const classFor = type => type==="Сертифікат"?"certificate":type==="Проєкт"?"project":"";
function save(){localStorage.setItem("uniportItems",JSON.stringify(items));}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function itemHTML(item, removable=false){
 return `<div class="material-item"><div class="file-icon ${classFor(item.type)}"><i class="bi ${iconFor(item.type)}"></i></div><div class="material-info"><strong>${esc(item.title)}</strong><small>${esc(item.date)}${item.file?" · "+esc(item.file):""}</small></div><span class="material-type">${esc(item.type)}</span>${removable?`<button class="material-actions" title="Видалити" onclick="removeItem(${item.id})"><i class="bi bi-trash3"></i></button>`:""}</div>`;
}
function empty(){return '<div class="empty-state"><i class="bi bi-inbox"></i>Поки що тут немає матеріалів.</div>';}
function render(){
 const works=items.filter(x=>x.type==="Робота"), certs=items.filter(x=>x.type==="Сертифікат"), projects=items.filter(x=>x.type==="Проєкт");
 document.getElementById("workCount").textContent=works.length;document.getElementById("certCount").textContent=certs.length;document.getElementById("projectCount").textContent=projects.length;
 document.getElementById("recentList").innerHTML=items.slice().reverse().slice(0,4).map(x=>itemHTML(x)).join("")||empty();
 document.getElementById("allMaterials").innerHTML=items.slice().reverse().map(x=>itemHTML(x,true)).join("")||empty();
 document.getElementById("certificateGrid").innerHTML=certs.map(x=>`<div class="col-md-6 col-xl-4"><div class="certificate-card"><div class="file-icon certificate"><i class="bi bi-award"></i></div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><small>${esc(x.date)}</small></div></div>`).join("")||`<div class="col-12">${empty()}</div>`;
 document.getElementById("projectGrid").innerHTML=projects.map(x=>`<div class="col-md-6"><div class="certificate-card"><div class="file-icon project"><i class="bi bi-lightbulb"></i></div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><small>${esc(x.date)}</small></div></div>`).join("")||`<div class="col-12">${empty()}</div>`;
 document.getElementById("portfolioWorkCount").textContent=works.length;document.getElementById("portfolioCertCount").textContent=certs.length;document.getElementById("portfolioProjectCount").textContent=projects.length;
 document.getElementById("portfolioItems").innerHTML=items.slice().reverse().slice(0,5).map(x=>itemHTML(x)).join("")||empty();
}
function showPage(name){
 document.querySelectorAll(".page-section").forEach(el=>el.classList.add("d-none"));
 document.getElementById(name+"Page").classList.remove("d-none");
 document.getElementById("pageCrumb").textContent=pages[name];
 document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===name));
 document.getElementById("sidebar").classList.remove("open");
}
document.querySelectorAll("[data-page]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();showPage(el.dataset.page);}));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll('[data-default-type]').forEach(btn=>btn.addEventListener("click",()=>document.getElementById("itemType").value=btn.dataset.defaultType));
document.getElementById("addForm").addEventListener("submit",e=>{
 e.preventDefault();
 const file=document.getElementById("itemFile").files[0];
 items.push({id:Date.now(),title:document.getElementById("itemTitle").value.trim(),type:document.getElementById("itemType").value,description:document.getElementById("itemDescription").value.trim(),date:new Date().toLocaleDateString("uk-UA"),file:file?file.name:""});
 save();render();e.target.reset();bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();toast("Матеріал додано до твого UniPort!");
});
function removeItem(id){items=items.filter(x=>x.id!==id);save();render();toast("Матеріал видалено.");}
window.removeItem=removeItem;
document.getElementById("searchInput").addEventListener("input",filterItems);
document.getElementById("typeFilter").addEventListener("change",filterItems);
function filterItems(){const q=document.getElementById("searchInput").value.toLowerCase();const t=document.getElementById("typeFilter").value;const found=items.slice().reverse().filter(x=>(t==="all"||x.type===t)&&(x.title+" "+x.description).toLowerCase().includes(q));document.getElementById("allMaterials").innerHTML=found.map(x=>itemHTML(x,true)).join("")||empty();}
function toast(message){document.getElementById("toastMessage").textContent=message;bootstrap.Toast.getOrCreateInstance(document.getElementById("appToast")).show();}
document.getElementById("shareBtn").addEventListener("click",async()=>{const demo=location.href.split("#")[0]+"#portfolio";try{await navigator.clipboard.writeText(demo);toast("Демонстраційне посилання скопійовано!");}catch(e){toast("Портфоліо готове до демонстрації на цьому пристрої.");}});
render();
