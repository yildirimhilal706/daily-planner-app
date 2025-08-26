const todoInput=document.getElementById('todoInput');
const addTodoBtn=document.getElementById('addTodo');
const todoList=document.getElementById('todoList');
const dateInput=document.getElementById('date');
const goalsInput=document.getElementById('goals');
const notesInput=document.getElementById('notes');

document.addEventListener('DOMContentLoaded',()=> {
  if(dateInput){dateInput.value=new Date().toISOString().split('T')[0];}
  loadSavedData();
  if(addTodoBtn){addTodoBtn.addEventListener('click',addTodo);}
  if(todoInput){todoInput.addEventListener('keypress',e=>{if(e.key==='Enter')addTodo();});}
  if(dateInput)dateInput.addEventListener('change',saveData);
  if(goalsInput)goalsInput.addEventListener('input',saveData);
  if(notesInput)notesInput.addEventListener('input',saveData);
});

function addTodo(){
  const t=todoInput.value.trim(); if(!t) return;
  const li=createTodoItem(t); todoList.appendChild(li);
  todoInput.value=''; saveData();
  li.style.opacity='0'; li.style.transform='translateX(-20px)';
  setTimeout(()=>{li.style.transition='all .3s';li.style.opacity='1';li.style.transform='translateX(0)';},10);
}
function createTodoItem(text){
  const li=document.createElement('li'); li.className='todo-item';
  const cb=document.createElement('input'); cb.type='checkbox'; cb.className='todo-checkbox';
  cb.addEventListener('change',()=>{li.classList.toggle('completed',cb.checked);saveData();});
  const span=document.createElement('span'); span.className='todo-text'; span.textContent=text;
  const del=document.createElement('button'); del.className='delete-btn'; del.innerHTML='<i class="fas fa-trash"></i>';
  del.addEventListener('click',()=>{li.style.opacity='0';li.style.transform='translateX(20px)';setTimeout(()=>{li.remove();saveData();},300);});
  li.append(cb,span,del); return li;
}
function saveData(){
  const data={date:dateInput?.value||'',goals:goalsInput?.value||'',notes:notesInput?.value||'',
    todos:[...todoList.children].map(i=>({text:i.querySelector('.todo-text').textContent,completed:i.querySelector('.todo-checkbox').checked}))};
  localStorage.setItem('dailyPlannerData',JSON.stringify(data));
}
function loadSavedData(){
  const s=localStorage.getItem('dailyPlannerData'); if(!s) return;
  const d=JSON.parse(s); if(dateInput)dateInput.value=d.date||''; if(goalsInput)goalsInput.value=d.goals||''; if(notesInput)notesInput.value=d.notes||'';
  if(d.todos){d.todos.forEach(t=>{const li=createTodoItem(t.text); if(t.completed){li.classList.add('completed'); li.querySelector('.todo-checkbox').checked=true;} todoList.appendChild(li);});}
}
