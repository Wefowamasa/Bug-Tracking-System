
/* CIRCUIT BOARD BACKGROUND */
(function initCircuit() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({length:90}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: 40 + Math.random() * 130,
    dir: Math.random() < 0.5 ? 'h' : 'v',
    alpha: 0.04 + Math.random() * 0.09
  }));
  const dots = Array.from({length:35}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1.5 + Math.random() * 3,
    alpha: 0.1 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.018 + Math.random() * 0.025
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width * 0.85);
    grad.addColorStop(0, '#041a2e');
    grad.addColorStop(1, '#020d18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lines.forEach(l => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,245,255,${l.alpha})`;
      ctx.lineWidth = 1;
      if (l.dir === 'h') { ctx.moveTo(l.x, l.y); ctx.lineTo(l.x + l.len, l.y); }
      else               { ctx.moveTo(l.x, l.y); ctx.lineTo(l.x, l.y + l.len); }
      ctx.stroke();
      ctx.beginPath();
      const ex = l.dir === 'h' ? l.x + l.len : l.x;
      const ey = l.dir === 'h' ? l.y : l.y + l.len;
      ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${l.alpha * 2.2})`;
      ctx.fill();
    });

    dots.forEach(d => {
      d.phase += d.speed;
      const a = d.alpha * (0.4 + 0.6 * Math.sin(d.phase));
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* HELPERS
*/
const get = k => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e) { return []; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { showToast(`Storage error saving "${k}"`, 'error'); } };

/*TOAST
*/
function showToast(message, type = 'success') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  const bg = type === 'error' ? '#ff3366' : type === 'warning' ? '#ffcc00' : '#00ff88';
  const color = type === 'warning' ? '#020d18' : '#fff';
  toast.style.cssText = `
    position:fixed;bottom:28px;right:28px;z-index:9999;
    padding:13px 22px;
    font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:1px;
    color:${color};background:${bg};
    box-shadow:0 0 24px ${bg}88;
    clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));
    animation:slideInToast 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
}

/* 

 RIPPLE ON ALL BUTTONS

 */
document.addEventListener('click', function(e) {
  const btn = e.target.closest('button');
  if (!btn) return;
  const old = btn.querySelector('.ripple');
  if (old) old.remove();
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;`;
  btn.appendChild(ripple);
  setTimeout(() => { if (ripple.parentNode) ripple.remove(); }, 600);
});

/*  
INIT DATA
 */
if (!localStorage.projects) set('projects', [{ id: 1, name: 'Website Redesign' }]);
if (!localStorage.people)   set('people',   [{ id: 1, name: 'John', surname: 'Doe', email: 'a@a.com', username: 'jdoe' }]);
if (!localStorage.issues)   set('issues',   []);

/*  
 NAV
  */
function showSection(id) {
  try {
    const target = document.getElementById(id);
    if (!target) throw new Error(`Section "${id}" not found.`);
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    target.classList.remove('hidden');
  } catch(e) {
    showToast('Navigation error: ' + e.message, 'error');
  }
}

/*  
DROPDOWNS
  */
function loadDropdowns() {
  try {
    const projects = get('projects');
    const people   = get('people');

    const pf = document.getElementById('projectFilter');
    if (pf) {
      const cur = pf.value;
      pf.innerHTML = '<option value="">ALL PROJECTS</option>';
      projects.forEach(p => { pf.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
      pf.value = cur;
    }

    const projectSelectEl = document.getElementById('projectSelect');
    if (projectSelectEl) {
      const cur = projectSelectEl.value;
      projectSelectEl.innerHTML = '<option value="">-- Select Project --</option>';
      projects.forEach(p => { projectSelectEl.innerHTML += `<option value="${p.id}">${p.name}</option>`; });
      projectSelectEl.value = cur;
    }

    const personSelectEl = document.getElementById('personSelect');
    if (personSelectEl) {
      const cur = personSelectEl.value;
      personSelectEl.innerHTML = '<option value="">Unassigned</option>';
      people.forEach(p => { personSelectEl.innerHTML += `<option value="${p.id}">${p.name} ${p.surname} (${p.username})</option>`; });
      personSelectEl.value = cur;
    }

    const identifiedByEl = document.getElementById('identifiedBy');
    if (identifiedByEl) {
      const cur = identifiedByEl.value;
      identifiedByEl.innerHTML = '<option value="">-- Select Person --</option>';
      people.forEach(p => { identifiedByEl.innerHTML += `<option value="${p.username}">${p.name} ${p.surname} (${p.username})</option>`; });
      identifiedByEl.value = cur;
    }
  } catch(e) {
    showToast('Failed to load dropdowns.', 'error');
  }
}

/*  
 ISSUES — PREPARE NEW
  */
function prepareNewIssue() {
  document.getElementById('issueFormTitle').textContent = 'CREATE ISSUE';
  document.getElementById('issueForm').reset();
  document.getElementById('issueId').value = '';
  loadDropdowns();
}

/*  
ISSUES — LOAD TABLE
  */
function loadIssues() {
  try {
    const issueTable = document.getElementById('issueTable');
    issueTable.innerHTML = '';
    let issues = get('issues');

    const statusFilter  = document.getElementById('statusFilter');
    const projectFilter = document.getElementById('projectFilter');
    if (statusFilter?.value)  issues = issues.filter(i => i.status === statusFilter.value);
    if (projectFilter?.value) issues = issues.filter(i => String(i.projectId) === String(projectFilter.value));

    const search = document.getElementById('issueSearch')?.value.toLowerCase() || '';
    if (search) issues = issues.filter(i => i.summary.toLowerCase().includes(search));

    if (issues.length === 0) {
      issueTable.innerHTML = `<tr><td colspan="9" style="text-align:center;color:rgba(200,238,255,0.3);padding:32px;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:2px;">// NO ISSUES FOUND</td></tr>`;
      return;
    }

    issues.forEach(issue => {
      let rowClass = '', priorityClass = '';
      if      (issue.priority === 'high')   { rowClass = 'priority-high';   priorityClass = 'priority-cell-high'; }
      else if (issue.priority === 'medium') { rowClass = 'priority-medium'; priorityClass = 'priority-cell-medium'; }
      else if (issue.priority === 'low')    { rowClass = 'priority-low';    priorityClass = 'priority-cell-low'; }

      const overdueClass  = issue.status === 'overdue' ? 'overdue' : '';
      const projectName   = get('projects').find(p => String(p.id) === String(issue.projectId))?.name || 'Unknown';
      const personName    = get('people').find(p => String(p.id) === String(issue.assignedTo))?.username || 'Unassigned';
      const statusBadge   = `<span style="font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:1px;padding:3px 8px;border-radius:2px;${statusStyle(issue.status)}">${issue.status}</span>`;

      issueTable.innerHTML += `
        <tr class="${overdueClass} ${rowClass}">
          <td style="font-weight:600;">${escapeHtml(issue.summary)}</td>
          <td>${statusBadge}</td>
          <td><span class="${priorityClass}">${issue.priority}</span></td>
          <td style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#0af0c8;">${escapeHtml(projectName)}</td>
          <td>${escapeHtml(personName)}</td>
          <td style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(200,238,255,0.5);">${issue.dateIdentified || ''}</td>
          <td style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(200,238,255,0.5);">${issue.targetDate || ''}</td>
          <td style="font-family:'Share Tech Mono',monospace;font-size:11px;color:rgba(200,238,255,0.5);">${issue.actualDate || ''}</td>
          <td>
            <button class="btn-edit"   onclick="editIssue(${issue.id})">✎ Edit</button>
            <button class="btn-delete" onclick="deleteIssue(${issue.id})">✕ Del</button>
            <button class="btn-view"   onclick="viewIssue(${issue.id})">👁 View</button>
          </td>
        </tr>`;
    });
  } catch(e) {
    showToast('Failed to load issues.', 'error');
    console.error(e);
  }
}

function statusStyle(s) {
  if (s === 'open')     return 'background:rgba(0,245,255,0.12);color:#00f5ff;border:1px solid rgba(0,245,255,0.3);';
  if (s === 'resolved') return 'background:rgba(0,255,136,0.12);color:#00ff88;border:1px solid rgba(0,255,136,0.3);';
  if (s === 'overdue')  return 'background:rgba(255,51,102,0.12);color:#ff3366;border:1px solid rgba(255,51,102,0.3);';
  return '';
}

/* ISSUES — SAVE */
document.getElementById('issueForm').onsubmit = (e) => {
  e.preventDefault();
  try {
    const summaryValue        = document.getElementById('summary').value.trim();
    const descriptionValue    = document.getElementById('description').value.trim();
    const identifiedByValue   = document.getElementById('identifiedBy').value;
    const dateIdentifiedValue = document.getElementById('dateIdentified').value;
    const projectIdValue      = Number(document.getElementById('projectSelect').value);
    const assignedToValue     = Number(document.getElementById('personSelect').value) || null;
    const statusValue         = document.getElementById('status').value;
    const priorityValue       = document.getElementById('priority').value;
    const targetDateValue     = document.getElementById('targetDate').value;
    const actualDateValue     = document.getElementById('actualDate').value;
    const resolutionValue     = document.getElementById('resolution').value.trim();
    const issueIdValue        = document.getElementById('issueId').value;

    if (!summaryValue)       { showToast('Summary is required.',               'error');   return; }
    if (!identifiedByValue)  { showToast('Please select who identified this.', 'error');   return; }
    if (!dateIdentifiedValue){ showToast('Date Identified is required.',       'error');   return; }
    if (!projectIdValue)     { showToast('Please select a project.',           'warning'); return; }
    if (targetDateValue && dateIdentifiedValue && targetDateValue < dateIdentifiedValue) {
      showToast('Target Date cannot be before Date Identified.', 'warning'); return;
    }
    if (actualDateValue && dateIdentifiedValue && actualDateValue < dateIdentifiedValue) {
      showToast('Actual Date cannot be before Date Identified.', 'warning'); return;
    }

    const issues = get('issues');
    const id     = issueIdValue ? Number(issueIdValue) : Date.now();
    const data   = { id, summary: summaryValue, description: descriptionValue,
      identifiedBy: identifiedByValue, dateIdentified: dateIdentifiedValue,
      projectId: projectIdValue, assignedTo: assignedToValue, status: statusValue,
      priority: priorityValue, targetDate: targetDateValue, actualDate: actualDateValue,
      resolution: resolutionValue };

    const idx = issues.findIndex(i => String(i.id) === String(id));
    if (idx >= 0) { issues[idx] = data; showToast('Issue updated!'); }
    else          { issues.push(data);  showToast('Issue created!'); }

    set('issues', issues);
    document.getElementById('issueForm').reset();
    document.getElementById('issueId').value = '';
    loadDropdowns(); loadIssues(); updateStats();
    showSection('dashboard');
  } catch(e) {
    showToast('Unexpected error saving issue.', 'error');
    console.error(e);
  }
};

/* ISSUES — EDIT*/
function editIssue(id) {
  try {
    const i = get('issues').find(x => String(x.id) === String(id));
    if (!i) throw new Error('Issue not found.');
    loadDropdowns();
    document.getElementById('issueFormTitle').textContent = 'EDIT ISSUE';
    const f = document.forms['issueForm'];
    f['issueId'].value        = i.id;
    f['summary'].value        = i.summary        || '';
    f['description'].value    = i.description    || '';
    f['dateIdentified'].value = i.dateIdentified || '';
    f['projectSelect'].value  = i.projectId      || '';
    f['personSelect'].value   = i.assignedTo     || '';
    f['status'].value         = i.status;
    f['priority'].value       = i.priority;
    f['targetDate'].value     = i.targetDate     || '';
    f['actualDate'].value     = i.actualDate     || '';
    f['resolution'].value     = i.resolution     || '';
    const identifiedByEl = document.getElementById('identifiedBy');
    if (identifiedByEl) identifiedByEl.value = i.identifiedBy || '';
    showSection('issueFormSection');
  } catch(e) {
    showToast('Could not open issue for editing: ' + e.message, 'error');
  }
}

/*  
 ISSUES — VIEW
  */
function viewIssue(id) {
  try {
    const issue   = get('issues').find(i => String(i.id) === String(id));
    if (!issue) throw new Error('Issue not found.');
    const project = get('projects').find(p => String(p.id) === String(issue.projectId))?.name || 'Unknown';
    const person  = get('people').find(p => String(p.id) === String(issue.assignedTo))?.username || 'Unassigned';
    document.getElementById('vSummary').textContent        = issue.summary        || '';
    document.getElementById('vDescription').textContent    = issue.description    || 'No description';
    document.getElementById('vStatus').textContent         = issue.status         || '';
    document.getElementById('vPriority').textContent       = issue.priority       || '';
    document.getElementById('vProject').textContent        = project;
    document.getElementById('vAssigned').textContent       = person;
    document.getElementById('vIdentifiedBy').textContent   = issue.identifiedBy   || '';
    document.getElementById('vDateIdentified').textContent = issue.dateIdentified || '';
    document.getElementById('vTargetDate').textContent     = issue.targetDate     || '';
    document.getElementById('vActualDate').textContent     = issue.actualDate     || '';
    document.getElementById('vResolution').textContent     = issue.resolution     || 'None';
    showSection('viewIssue');
  } catch(e) {
    showToast('Could not view issue: ' + e.message, 'error');
  }
}

/*  
ISSUES — DELETE
  */
function deleteIssue(id) {
  try {
    const issue = get('issues').find(i => String(i.id) === String(id));
    if (!issue) throw new Error('Issue not found.');
    if (confirm(`Delete "${issue.summary}"?\nThis cannot be undone.`)) {
      set('issues', get('issues').filter(i => String(i.id) !== String(id)));
      loadIssues(); updateStats();
      showToast('Issue deleted.');
    }
  } catch(e) {
    showToast('Could not delete issue: ' + e.message, 'error');
  }
}

/*  
FILTER EVENTS
  */
document.getElementById('statusFilter').onchange  = loadIssues;
document.getElementById('projectFilter').onchange = loadIssues;

/*  
PROJECTS — LOAD
  */
// Track which project is being inline-edited
let editingProjectId = null;

function loadProjects() {
  try {
    const search     = document.getElementById('projectSearch')?.value.toLowerCase() || '';
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    const filtered   = get('projects').filter(p => p.name.toLowerCase().includes(search));

    if (filtered.length === 0) {
      projectList.innerHTML = `<li style="color:rgba(200,238,255,0.3);text-align:center;padding:20px;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:2px;">// NO PROJECTS FOUND</li>`;
      return;
    }

    filtered.forEach(p => {
      const li = document.createElement('li');

      if (editingProjectId === p.id) {
        // ── INLINE EDIT ROW (same pattern as issues) ──
        li.innerHTML = `
          <div class="list-edit-row">
            <input class="inline-input" id="epj-name-${p.id}" value="${escapeHtml(p.name)}" placeholder="Project name">
          </div>
          <div class="project-actions">
            <button class="btn-save"   onclick="saveProjectInline(${p.id})">✔ Save</button>
            <button class="btn-cancel" onclick="cancelProjectInline()">✕ Cancel</button>
          </div>`;
      } else {
        li.innerHTML = `
          <span class="project-info">${escapeHtml(p.name)}</span>
          <div class="project-actions">
            <button class="btn-edit"   onclick="startProjectInline(${p.id})">✎ Edit</button>
            <button class="btn-delete" onclick="deleteProject(${p.id})">✕ Delete</button>
          </div>`;
      }
      projectList.appendChild(li);
    });
  } catch(e) {
    showToast('Failed to load projects.', 'error'); console.error(e);
  }
}

function startProjectInline(id)  { editingProjectId = id;   loadProjects(); }
function cancelProjectInline()   { editingProjectId = null; loadProjects(); }

function saveProjectInline(id) {
  try {
    const newName = document.getElementById(`epj-name-${id}`)?.value.trim();
    if (!newName) { showToast('Project name cannot be empty.', 'warning'); return; }
    const projects = get('projects');
    if (projects.find(item => item.id !== id && item.name.toLowerCase() === newName.toLowerCase())) {
      showToast('Another project with that name already exists.', 'warning'); return;
    }
    const idx = projects.findIndex(item => item.id === id);
    if (idx < 0) { showToast('Project not found.', 'error'); return; }
    projects[idx].name = newName;
    set('projects', projects);
    editingProjectId = null;
    loadProjects(); loadDropdowns();
    showToast('Project updated!');
  } catch(e) {
    showToast('Could not save project: ' + e.message, 'error'); console.error(e);
  }
}

function addProject() {
  try {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { showToast('Project name cannot be empty.', 'warning'); return; }
    const projects = get('projects');
    if (projects.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      showToast('A project with that name already exists.', 'warning'); return;
    }
    projects.push({ id: Date.now(), name });
    set('projects', projects);
    document.getElementById('projectName').value = '';
    loadProjects(); loadDropdowns();
    showToast('Project added!');
  } catch(e) {
    showToast('Failed to add project.', 'error'); console.error(e);
  }
}

function editProject(id) {
  startProjectInline(id);
}

function deleteProject(id) {
  try {
    const p = get('projects').find(item => item.id === id);
    if (!p) throw new Error('Project not found.');
    const linked = get('issues').filter(i => String(i.projectId) === String(id)).length;
    if (linked > 0) { showToast(`Cannot delete "${p.name}" — it has ${linked} linked issue(s).`, 'warning'); return; }
    if (confirm(`Delete project "${p.name}"? This cannot be undone.`)) {
      set('projects', get('projects').filter(item => item.id !== id));
      loadProjects(); loadDropdowns();
      showToast('Project deleted.');
    }
  } catch(e) {
    showToast('Could not delete project: ' + e.message, 'error'); console.error(e);
  }
}

/*  
PEOPLE — LOAD
  */
let editingPersonId = null;

function loadPeople() {
  try {
    const search     = document.getElementById('peopleSearch')?.value.toLowerCase() || '';
    const peopleList = document.getElementById('peopleList');
    peopleList.innerHTML = '';
    const filtered   = get('people').filter(p =>
      (p.name + ' ' + p.surname + ' ' + p.username).toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
      peopleList.innerHTML = `<li style="color:rgba(200,238,255,0.3);text-align:center;padding:20px;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:2px;">// NO PEOPLE FOUND</li>`;
      return;
    }

    filtered.forEach(p => {
      const li = document.createElement('li');

      if (editingPersonId === p.id) {
        // ── INLINE EDIT ROW (same pattern as issues) ──
        li.innerHTML = `
          <div class="list-edit-row">
            <input class="inline-input" id="ep-name-${p.id}"     value="${escapeHtml(p.name)}"     placeholder="First name">
            <input class="inline-input" id="ep-surname-${p.id}"  value="${escapeHtml(p.surname)}"  placeholder="Surname">
            <input class="inline-input" id="ep-email-${p.id}"    value="${escapeHtml(p.email||'')}"    placeholder="Email">
            <input class="inline-input" id="ep-username-${p.id}" value="${escapeHtml(p.username)}" placeholder="Username">
          </div>
          <div class="person-actions">
            <button class="btn-save"   onclick="savePersonInline(${p.id})">✔ Save</button>
            <button class="btn-cancel" onclick="cancelPersonInline()">✕ Cancel</button>
          </div>`;
      } else {
        li.innerHTML = `
          <span class="person-info">${escapeHtml(p.name)} ${escapeHtml(p.surname)} — <span style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#0af0c8;">${escapeHtml(p.username)}</span></span>
          <div class="person-actions">
            <button class="btn-edit"   onclick="startPersonInline(${p.id})">✎ Edit</button>
            <button class="btn-delete" onclick="deletePerson(${p.id})">✕ Delete</button>
          </div>`;
      }
      peopleList.appendChild(li);
    });
  } catch(e) {
    showToast('Failed to load people.', 'error'); console.error(e);
  }
}

function startPersonInline(id)  { editingPersonId = id;   loadPeople(); }
function cancelPersonInline()   { editingPersonId = null; loadPeople(); }

function savePersonInline(id) {
  try {
    const name     = document.getElementById(`ep-name-${id}`)?.value.trim();
    const surname  = document.getElementById(`ep-surname-${id}`)?.value.trim();
    const email    = document.getElementById(`ep-email-${id}`)?.value.trim();
    const username = document.getElementById(`ep-username-${id}`)?.value.trim();

    if (!name)     { showToast('Name cannot be empty.',     'warning'); return; }
    if (!surname)  { showToast('Surname cannot be empty.',  'warning'); return; }
    if (!username) { showToast('Username cannot be empty.', 'warning'); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'warning'); return;
    }

    const people = get('people');
    if (people.find(p => p.id !== id && p.username.toLowerCase() === username.toLowerCase())) {
      showToast('Username already taken.', 'warning'); return;
    }

    const idx = people.findIndex(item => item.id === id);
    if (idx < 0) { showToast('Person not found.', 'error'); return; }
    people[idx] = { ...people[idx], name, surname, email, username };
    set('people', people);
    editingPersonId = null;
    loadPeople(); loadDropdowns();
    showToast('Person updated!');
  } catch(e) {
    showToast('Could not save person: ' + e.message, 'error'); console.error(e);
  }
}

function addPerson() {
  try {
    const name     = document.getElementById('personName').value.trim();
    const surname  = document.getElementById('personSurname').value.trim();
    const email    = document.getElementById('personEmail').value.trim();
    const username = document.getElementById('personUsername').value.trim();
    if (!name)     { showToast('Name is required.',     'warning'); return; }
    if (!surname)  { showToast('Surname is required.',  'warning'); return; }
    if (!username) { showToast('Username is required.', 'warning'); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'warning'); return;
    }
    const people = get('people');
    if (people.find(p => p.username.toLowerCase() === username.toLowerCase())) {
      showToast('Username already taken.', 'warning'); return;
    }
    if (email && people.find(p => p.email && p.email.toLowerCase() === email.toLowerCase())) {
      showToast('This email is already registered.', 'warning'); return;
    }
    people.push({ id: Date.now(), name, surname, email, username });
    set('people', people);
    document.getElementById('personForm').reset();
    loadPeople(); loadDropdowns();
    showToast('Person added!');
  } catch(e) {
    showToast('Failed to add person.', 'error'); console.error(e);
  }
}

function editPerson(id) {
  startPersonInline(id);
}

function deletePerson(id) {
  try {
    const p = get('people').find(item => item.id === id);
    if (!p) throw new Error('Person not found.');
    const linked = get('issues').filter(i => String(i.assignedTo) === String(id)).length;
    if (linked > 0) { showToast(`Cannot delete "${p.name}" — assigned to ${linked} issue(s).`, 'warning'); return; }
    if (confirm(`Delete "${p.name} ${p.surname}"? This cannot be undone.`)) {
      set('people', get('people').filter(item => item.id !== id));
      loadPeople(); loadDropdowns();
      showToast('Person deleted.');
    }
  } catch(e) {
    showToast('Could not delete person: ' + e.message, 'error'); console.error(e);
  }
}

/*  
 LOGOUT
  */
function logout() {
  try {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    }
  } catch(e) {
    showToast('Logout failed.', 'error');
  }
}

/*  
UTILITY
  */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initials(name, surname) {
  return ((name||'')[0]||'').toUpperCase() + ((surname||'')[0]||'').toUpperCase();
}

function dayKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}

/*  
STATS / GRAPHS
  */
// Store chart instances so we can destroy & recreate
const _charts = {};

function destroyChart(id) {
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id]; }
}

// Shared futuristic Chart.js defaults
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 900, easing: 'easeInOutQuart' },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(200,238,255,0.7)',
        font: { family: "'Share Tech Mono', monospace", size: 11 },
        boxWidth: 14, padding: 16
      }
    },
    tooltip: {
      backgroundColor: 'rgba(4,30,55,0.95)',
      borderColor: 'rgba(0,245,255,0.4)',
      borderWidth: 1,
      titleColor: '#00f5ff',
      bodyColor: 'rgba(200,238,255,0.8)',
      titleFont: { family: "'Orbitron', monospace", size: 11 },
      bodyFont:  { family: "'Share Tech Mono', monospace", size: 11 },
      padding: 12, cornerRadius: 0,
      callbacks: {
        title: items => '// ' + items[0].label.toUpperCase()
      }
    }
  }
};

function updateStats() {
  try {
    const issues     = get('issues');
    const total      = issues.length || 1;
    const open       = issues.filter(i => i.status === 'open').length;
    const resolved   = issues.filter(i => i.status === 'resolved').length;
    const overdue    = issues.filter(i => i.status === 'overdue').length;
    const unassigned = issues.filter(i => !i.assignedTo).length;

    document.getElementById('openCount').textContent       = open;
    document.getElementById('progressCount').textContent   = overdue;
    document.getElementById('closedCount').textContent     = resolved;
    document.getElementById('unassignedCount').textContent = unassigned;

    // Legacy hidden bars (backward compat)
    const openBar     = document.getElementById('openBar');
    const progressBar = document.getElementById('progressBar');
    const closedBar   = document.getElementById('closedBar');
    if (openBar)     openBar.style.width     = (open     / total * 100) + '%';
    if (progressBar) progressBar.style.width = (overdue  / total * 100) + '%';
    if (closedBar)   closedBar.style.width   = (resolved / total * 100) + '%';

    renderCharts(issues);
    renderPersonStats(issues);
  } catch(e) {
    console.error('Failed to update stats:', e);
  }
}

function renderCharts(issues) {
  const projects = get('projects');

  /*  STATUS CHART (doughnut)  */
  {
    destroyChart('chart-status');
    const open     = issues.filter(i => i.status === 'open').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const overdue  = issues.filter(i => i.status === 'overdue').length;
    const ctx      = document.getElementById('chart-status').getContext('2d');
    _charts['chart-status'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Open', 'Resolved', 'Overdue'],
        datasets: [{
          data: [open, resolved, overdue],
          backgroundColor: ['rgba(0,245,255,0.75)', 'rgba(0,255,136,0.75)', 'rgba(255,51,102,0.75)'],
          borderColor:     ['#00f5ff', '#00ff88', '#ff3366'],
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        ...chartDefaults,
        cutout: '65%',
        plugins: {
          ...chartDefaults.plugins,
          legend: { ...chartDefaults.plugins.legend, position: 'bottom' }
        }
      }
    });
  }

  /*  PRIORITY CHART (polar area)  */
  {
    destroyChart('chart-priority');
    const high   = issues.filter(i => i.priority === 'high').length;
    const medium = issues.filter(i => i.priority === 'medium').length;
    const low    = issues.filter(i => i.priority === 'low').length;
    const ctx    = document.getElementById('chart-priority').getContext('2d');
    _charts['chart-priority'] = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          data: [high, medium, low],
          backgroundColor: ['rgba(255,51,102,0.6)', 'rgba(255,204,0,0.6)', 'rgba(0,255,136,0.6)'],
          borderColor:     ['#ff3366', '#ffcc00', '#00ff88'],
          borderWidth: 2
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          r: {
            ticks:   { color: 'rgba(200,238,255,0.4)', backdropColor: 'transparent', font: { family: "'Share Tech Mono',monospace", size: 10 } },
            grid:    { color: 'rgba(0,245,255,0.1)' },
            pointLabels: { color: 'rgba(200,238,255,0.6)' }
          }
        },
        plugins: {
          ...chartDefaults.plugins,
          legend: { ...chartDefaults.plugins.legend, position: 'bottom' }
        }
      }
    });
  }

  /*  PROJECT CHART (horizontal bar)  */
  {
    destroyChart('chart-project');
    const projLabels = projects.map(p => p.name);
    const projCounts = projects.map(p => issues.filter(i => String(i.projectId) === String(p.id)).length);
    const ctx = document.getElementById('chart-project').getContext('2d');
    _charts['chart-project'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: projLabels.length ? projLabels : ['No Projects'],
        datasets: [{
          label: 'Issues',
          data: projCounts.length ? projCounts : [0],
          backgroundColor: 'rgba(0,245,255,0.25)',
          borderColor: '#00f5ff',
          borderWidth: 2,
          borderRadius: 2,
          hoverBackgroundColor: 'rgba(0,245,255,0.5)'
        }]
      },
      options: {
        ...chartDefaults,
        indexAxis: 'y',
        scales: {
          x: {
            ticks: { color: 'rgba(200,238,255,0.5)', font: { family: "'Share Tech Mono',monospace", size: 10 }, stepSize: 1 },
            grid:  { color: 'rgba(0,245,255,0.08)' },
            border: { color: 'rgba(0,245,255,0.2)' }
          },
          y: {
            ticks: { color: 'rgba(200,238,255,0.7)', font: { family: "'Share Tech Mono',monospace", size: 10 } },
            grid:  { color: 'rgba(0,245,255,0.05)' },
            border: { color: 'rgba(0,245,255,0.2)' }
          }
        },
        plugins: { ...chartDefaults.plugins, legend: { display: false } }
      }
    });
  }

  /*  ASSIGNED vs UNASSIGNED (doughnut)  */
  {
    destroyChart('chart-assigned');
    const assigned   = issues.filter(i =>  i.assignedTo).length;
    const unassigned = issues.filter(i => !i.assignedTo).length;
    const ctx        = document.getElementById('chart-assigned').getContext('2d');
    _charts['chart-assigned'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Assigned', 'Unassigned'],
        datasets: [{
          data: [assigned, unassigned],
          backgroundColor: ['rgba(10,240,200,0.7)', 'rgba(255,136,0,0.7)'],
          borderColor:     ['#0af0c8', '#ff8800'],
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        ...chartDefaults,
        cutout: '60%',
        plugins: {
          ...chartDefaults.plugins,
          legend: { ...chartDefaults.plugins.legend, position: 'bottom' }
        }
      }
    });
  }

  /*  DAILY CHART (line)  */
  {
    destroyChart('chart-daily');
    const today = new Date();
    const days  = [];
    const counts = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = dayKey(d.toISOString());
      days.push(k);
      counts[k] = 0;
    }
    issues.forEach(iss => {
      // use dateIdentified if available, else creation timestamp
      const raw = iss.dateIdentified ? iss.dateIdentified : new Date(iss.id).toISOString();
      const k   = raw.slice(0, 10);
      if (counts[k] !== undefined) counts[k]++;
    });

    const labels = days.map(k => {
      const d = new Date(k + 'T00:00:00');
      return d.toLocaleDateString('en-ZA', { weekday:'short', day:'2-digit', month:'short' });
    });
    const data = days.map(k => counts[k]);

    const ctx = document.getElementById('chart-daily').getContext('2d');

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, 280);
    grad.addColorStop(0,   'rgba(0,245,255,0.35)');
    grad.addColorStop(1,   'rgba(0,245,255,0.01)');

    _charts['chart-daily'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Issues Created',
          data,
          borderColor: '#00f5ff',
          borderWidth: 2,
          pointBackgroundColor: '#00f5ff',
          pointBorderColor: '#020d18',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#fff',
          fill: true,
          backgroundColor: grad,
          tension: 0.4
        }]
      },
      options: {
        ...chartDefaults,
        scales: {
          x: {
            ticks: { color: 'rgba(200,238,255,0.5)', font: { family: "'Share Tech Mono',monospace", size: 9 }, maxRotation: 45 },
            grid:  { color: 'rgba(0,245,255,0.06)' },
            border:{ color: 'rgba(0,245,255,0.2)' }
          },
          y: {
            ticks: { color: 'rgba(200,238,255,0.5)', font: { family: "'Share Tech Mono',monospace", size: 10 }, stepSize: 1 },
            grid:  { color: 'rgba(0,245,255,0.08)' },
            border:{ color: 'rgba(0,245,255,0.2)' },
            beginAtZero: true
          }
        },
        plugins: {
          ...chartDefaults.plugins,
          legend: { display: false }
        }
      }
    });
  }
}

/*  
PERSON STATS BARS
  */
function renderPersonStats(issues) {
  const people  = get('people');
  const container = document.getElementById('person-stats-list');
  if (!container) return;

  if (!people.length) {
    container.innerHTML = `<div style="color:rgba(200,238,255,0.3);font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:2px;text-align:center;padding:20px;">// NO OPERATORS FOUND</div>`;
    return;
  }

  const maxIssues = Math.max(...people.map(p => issues.filter(i => String(i.assignedTo) === String(p.id)).length), 1);

  container.innerHTML = people.map(p => {
    const myIssues   = issues.filter(i => String(i.assignedTo) === String(p.id));
    const total      = myIssues.length;
    const open       = myIssues.filter(i => i.status === 'open').length;
    const resolved   = myIssues.filter(i => i.status === 'resolved').length;
    const overdue    = myIssues.filter(i => i.status === 'overdue').length;
    const pct        = Math.round((total / maxIssues) * 100);
    const av         = initials(p.name, p.surname);

    return `
      <div class="pcs-row">
        <div class="pcs-avatar">${av}</div>
        <div class="pcs-info">
          <div class="pcs-name">${escapeHtml(p.name)} ${escapeHtml(p.surname)}</div>
          <div class="pcs-bar-wrap"><div class="pcs-bar" style="width:${pct}%;"></div></div>
          <div class="pcs-counts">
            <span class="pcs-count-item">Open: <span>${open}</span></span>
            <span class="pcs-count-item">Resolved: <span>${resolved}</span></span>
            <span class="pcs-count-item">Overdue: <span>${overdue}</span></span>
          </div>
        </div>
        <div class="pcs-total">${total}</div>
      </div>`;
  }).join('');

  // Animate bars in
  setTimeout(() => {
    container.querySelectorAll('.pcs-bar').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      requestAnimationFrame(() => { bar.style.width = w; });
    });
  }, 50);
}

/*  
 
  */
try {
  loadDropdowns();
  loadIssues();
  loadProjects();
  loadPeople();
} catch(e) {
  console.error('Startup error:', e);
}
