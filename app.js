(() => {
  const STORAGE_KEY = 'tirandor-cartographer-v09-projects';
  const q = (s, root=document) => root.querySelector(s);
  const qa = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const uid = (p='id') => `${p}_${Math.random().toString(36).slice(2,9)}`;
  const humanize = (id) => id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const APP = q('#app');

  const TYPE_PRESETS = {
    world: { label: 'Мир', width: 3200, height: 2200, grid: false },
    region: { label: 'Регион', width: 2800, height: 1900, grid: false },
    city: { label: 'Город', width: 2400, height: 1800, grid: false },
    dungeon: { label: 'Подземелье', width: 2200, height: 1600, grid: true },
    battlemap: { label: 'Battlemat', width: 2800, height: 2000, grid: true },
  };

  const FONT_PRESETS = [
    { value: 'Cinzel', label: 'Cinzel' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
    { value: 'IM Fell English SC', label: 'IM Fell English SC' },
    { value: 'serif', label: 'Serif' },
  ];

  const PACKS = [
    {
      id: 'terrain', label: 'Ландшафты', sheet: 'terrain_sheet.png', defaultSize: 200,
      rows: [
        ['forest','dark_forest','jungle','plains','hills','mountains','snow_mountains'],
        ['volcano','canyon','cliffs','desert_dunes','oasis','swamp','marsh'],
        ['lake','river_source','waterfall','river_delta','coast','island','glacier'],
        ['tundra','badlands','crystal_field','mushroom_grove','geyser_field','dead_wasteland','enchanted_grove']
      ]
    },
    {
      id: 'ruins', label: 'Руины и места', sheet: 'ruins_sheet.png', defaultSize: 190,
      rows: [
        ['ancient_ruins','excavation_site','abandoned_temple','ruined_tower','broken_bridge','barrow_mound','mausoleum'],
        ['crypt','catacomb_entrance','standing_stones','obelisk','stone_altar','ruined_shrine','ruined_monastery'],
        ['abandoned_fortress','watchtower_ruin','siege_camp','bandit_camp','battlefield_memorial_site','fallen_statue','wizard_tower'],
        ['ancient_portal','alchemists_laboratory','abandoned_mine','quarry','ruined_lighthouse','sunken_temple','village_ruins']
      ]
    },
    {
      id: 'guilds', label: 'Гильдии', sheet: 'guilds_sheet.png', defaultSize: 150,
      rows: [
        ['blacksmiths_guild','miners_guild','inventors_guild','merchants_guild','bankers_guild','sailors_guild','cartographers_guild','scribes_guild','hunters_guild','trackers_guild'],
        ['mercenaries_guild','guards_guild','thieves_guild','assassins_guild','actors_guild','bards_guild','circus_guild','healers_guild','alchemists_guild','scholars_guild'],
        ['mages_guild','seers_guild','elementalists_guild','druids_guild','necromancers_guild','astralists_guild','portalkeepers_guild','enchanters_guild','tamers_guild','herbalists_guild'],
        ['farmers_guild','fishermen_guild','cooks_guild','brewers_guild','builders_guild','shipbuilders_guild','treasure_hunters_guild','translators_guild','diplomats_guild','mediators_guild']
      ]
    },
    {
      id: 'buildings', label: 'Постройки', sheet: 'buildings_sheet.png', defaultSize: 170,
      rows: [
        ['castle','city_walls','keep','town_hall','courthouse','watchtower','barracks','prison','gatehouse','lighthouse'],
        ['cathedral','temple','chapel','monastery','shrine','library','academy','theater','arena','monument'],
        ['peasant_house','house','townhouse','merchant_house','noble_house','tenement','market','blacksmith','workshop','mill','granary','warehouse'],
        ['inn_tavern','roadhouse','caravanserai','stable','cart_shed','docks','farm','barn','windmill','fields','orchard','pasture'],
        ['mine','quarry','smelter','foundry','lumber_camp','oil_derrick','mausoleum','obelisk','fountain','town_square','bridge','ruins']
      ]
    },
    {
      id: 'creatures', label: 'Существа', sheet: 'creatures_sheet.png', defaultSize: 170,
      rows: [
        ['dragon','griffon','wyvern','phoenix','unicorn','pegasus','manticore','chimera','hydra'],
        ['troll','ogre','giant','centaur','satyr','dire_wolf','giant_spider','basilisk','salamander','hell_hound'],
        ['zombie','skeleton_warrior','ghost','banshee','golem','gargoyle','forest_spirit','sea_serpent','kraken'],
        ['leviathan']
      ]
    },
    {
      id: 'races', label: 'Расы', sheet: 'races_sheet.png', defaultSize: 165,
      rows: [
        ['human','dwarf','elf','halfling','gnome','orc','dragonborn','tiefling','goliath','aasimar'],
        ['high_elf','wood_elf','drow','mountain_dwarf','hill_dwarf','forest_gnome','rock_gnome','asmodeus_tiefling']
      ]
    },
    {
      id: 'illustrations', label: 'Рисунки и объекты', sheet: 'mixed_sheet.png', defaultSize: 165,
      rows: [
        ['walled_city','hill_castle','port_city','cathedral_icon','village_windmill','ruins_large'],
        ['watchtower','stone_bridge','lighthouse_icon','mountains','volcano_icon','green_mountains','pine_forest'],
        ['crusader_ship','longship','double_serpent','whale','tuna','sea_serpent_icon'],
        ['red_dragon','griffin_icon','bear','wolf','boar','stag','horse','fox','hare','raven','owl'],
        ['knight','ranger','wizard','bishop','king','sun_deity','demon_lord','gargoyle_statue'],
        ['compass_rose','lion_banner','wolf_banner','crown','war_horn','sword','sun_shield','treasure_chest','hourglass','olive_branch','mushrooms','thistle']
      ]
    }
  ];

  const packMap = Object.fromEntries(PACKS.map(p => [p.id, p]));
  const sheetCache = {};
  const assetCache = new Map();

  const state = {
    screen: 'home',
    projects: loadProjects(),
    modal: null,
    currentId: null,
    tool: 'select',
    activePack: 'terrain',
    assetQuery: '',
    selectedAsset: null,
    placingText: 'Новая надпись',
    view: { zoom: 0.4, x: 60, y: 60 },
    drag: null,
  };

  function loadProjects() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return raw.map(normalizeProject);
    } catch {
      return [];
    }
  }
  function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
  }
  function normalizeProject(p) {
    const preset = TYPE_PRESETS[p.type] || TYPE_PRESETS.world;
    return {
      id: p.id || uid('project'),
      name: p.name || 'Новая карта',
      type: p.type || 'world',
      width: p.width || preset.width,
      height: p.height || preset.height,
      settings: {
        background: p.settings?.background || '#e7dbc1',
        gridVisible: p.settings?.gridVisible ?? preset.grid,
        gridSize: p.settings?.gridSize || 100,
        gridColor: p.settings?.gridColor || 'rgba(70,56,37,0.18)',
        labelFont: p.settings?.labelFont || 'Cinzel',
        labelColor: p.settings?.labelColor || '#3e2c1b',
        paperNoise: true,
      },
      objects: Array.isArray(p.objects) ? p.objects.map(o => ({ opacity: 1, rotation: 0, ...o })) : [],
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  function current() { return state.projects.find(p => p.id === state.currentId) || null; }
  function setCurrent(id){ state.currentId = id; state.screen = 'editor'; render(); }
  function projectLabel(type){ return TYPE_PRESETS[type]?.label || type; }
  function formatDate(iso){ try { return new Date(iso).toLocaleDateString('ru-RU'); } catch { return '—'; } }

  function render() {
    APP.innerHTML = state.screen === 'home' ? renderHome() : renderEditor();
    bindCommon();
    if (state.screen === 'home') bindHome();
    if (state.screen === 'editor') setupEditor();
    if (state.modal) renderModal();
  }

  function renderHome() {
    const cards = state.projects.length ? state.projects.map(p => `
      <article class="card">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="meta">
          <span class="tag">${projectLabel(p.type)}</span>
          <span>${p.width}×${p.height}</span>
          <span>${formatDate(p.updatedAt)}</span>
        </div>
        <div class="card-actions">
          <button class="btn primary" data-open="${p.id}">Открыть</button>
          <button class="btn ghost" data-duplicate="${p.id}">Дубль</button>
          <button class="btn ghost" data-export-project="${p.id}">Экспорт</button>
          <button class="btn ghost" data-delete="${p.id}">Удалить</button>
        </div>
      </article>`).join('') : `<div class="empty">Пока нет проектов. Создай первую карту и начинай собирать мир, регион, город или подземелье.</div>`;
    return `
      <main class="home">
        <section class="hero">
          <div class="brand">
            <h1>Tirandor Cartographer</h1>
            <p>Локальный редактор карт для D&D и печати — с иллюстрированными ассетами на манер карт позднего Средневековья.</p>
          </div>
          <div class="actions">
            <button class="btn primary" id="newProjectBtn">+ Новый проект</button>
            <button class="btn ghost" id="importProjectBtn">Импорт .dndatlas</button>
            <input id="importFileInput" type="file" accept=".dndatlas,.json" class="hidden">
          </div>
        </section>
        <section class="projects">${cards}</section>
      </main>`;
  }

  function renderEditor() {
    const p = current();
    const pack = packMap[state.activePack] || PACKS[0];
    const assetItems = flattenPackItems(pack).filter(a => (a.id + ' ' + humanize(a.id)).toLowerCase().includes(state.assetQuery.toLowerCase()));
    const selectedObj = p?.objects.find(o => o.id === p?.selectedId);
    return `
      <div class="editor">
        <aside class="toolbar">
          <button class="toolbtn ${state.tool==='select'?'active':''}" data-tool="select"><div class="sym">↖</div><span>Выбор</span></button>
          <button class="toolbtn ${state.tool==='asset'?'active':''}" data-tool="asset"><div class="sym">✦</div><span>Ассет</span></button>
          <button class="toolbtn ${state.tool==='text'?'active':''}" data-tool="text"><div class="sym">T</div><span>Текст</span></button>
          <button class="toolbtn" id="fitViewBtn"><div class="sym">⛶</div><span>Вписать</span></button>
          <button class="toolbtn" id="homeBtn"><div class="sym">⌂</div><span>Домой</span></button>
        </aside>
        <section class="canvas-wrap">
          <header class="topbar">
            <div class="topbar-left">
              <div class="titleblock">
                <h2>${escapeHtml(p.name)}</h2>
                <div class="sub">${projectLabel(p.type)} · ${p.width}×${p.height} · ${p.objects.length} объектов</div>
              </div>
            </div>
            <div class="topbar-right">
              <button class="btn ghost" id="saveHomeBtn">К проектам</button>
              <button class="btn ghost" id="exportProjectBtn">Экспорт .dndatlas</button>
              <button class="btn primary" id="exportPngBtn">Экспорт PNG</button>
            </div>
          </header>
          <div class="canvas-stage"><canvas id="mapCanvas"></canvas></div>
        </section>
        <aside class="sidebar">
          <section class="panel">
            <h3>Ассеты</h3>
            <div class="row" style="margin-bottom:10px">
              <select id="packSelect" class="select grow">${PACKS.map(x => `<option value="${x.id}" ${x.id===state.activePack?'selected':''}>${x.label}</option>`).join('')}</select>
              <input id="assetSearch" class="input grow" placeholder="Поиск" value="${escapeHtml(state.assetQuery)}">
            </div>
            <div class="row" style="margin-bottom:10px"><div class="stat">${pack.label}: ${assetItems.length}</div><div class="stat">Инструмент: ${state.tool==='asset'?'Ассет':state.tool==='text'?'Текст':'Выбор'}</div></div>
            <div class="assets-grid">
              ${assetItems.map(a => `<button class="asset-card ${state.selectedAsset===a.key?'active':''}" data-asset-key="${a.key}"><canvas data-preview="${a.key}"></canvas><strong>${humanize(a.id)}</strong><small>${pack.label}</small></button>`).join('')}
            </div>
          </section>
          <section class="panel">
            <h3>Настройки карты</h3>
            <div class="split">
              <div class="field"><label>Ширина</label><input id="mapWidth" class="input" type="number" value="${p.width}" min="600" step="100"></div>
              <div class="field"><label>Высота</label><input id="mapHeight" class="input" type="number" value="${p.height}" min="600" step="100"></div>
            </div>
            <div class="split">
              <div class="field"><label>Сетка</label><select id="gridToggle" class="select"><option value="1" ${p.settings.gridVisible?'selected':''}>Показать</option><option value="0" ${!p.settings.gridVisible?'selected':''}>Скрыть</option></select></div>
              <div class="field"><label>Шаг сетки</label><input id="gridSize" class="input" type="number" value="${p.settings.gridSize}" min="20" max="400"></div>
            </div>
            <div class="field"><label>Шрифт подписей</label><select id="mapLabelFont" class="select">${FONT_PRESETS.map(f=>`<option value="${f.value}" ${p.settings.labelFont===f.value?'selected':''}>${f.label}</option>`).join('')}</select></div>
            <div class="help">Колёсико мыши — масштаб. ЛКМ — поставить ассет или выбрать объект. Перетаскивание на инструменте выбора — перемещение. <span class="kbd">Delete</span> удаляет выбранное.</div>
          </section>
          <section class="panel">
            <h3>Инструмент текста</h3>
            <div class="field"><label>Текст</label><textarea id="draftText" class="textarea" rows="3">${escapeHtml(state.placingText)}</textarea></div>
            <div class="split">
              <div class="field"><label>Шрифт</label><select id="draftFont" class="select">${FONT_PRESETS.map(f=>`<option value="${f.value}" ${p.settings.labelFont===f.value?'selected':''}>${f.label}</option>`).join('')}</select></div>
              <div class="field"><label>Цвет</label><input id="draftColor" class="input" type="color" value="${toColorValue(p.settings.labelColor)}"></div>
            </div>
          </section>
          <section class="panel">
            <h3>Инспектор</h3>
            ${selectedObj ? renderInspector(selectedObj, p) : '<div class="muted">Выбери объект на карте, чтобы настроить его размер, поворот и другие параметры.</div>'}
          </section>
          <section class="panel">
            <h3>Источники и пакеты</h3>
            <div class="muted">В проект встроены 7 иллюстрированных листов ассетов: ландшафты, руины, гильдии, постройки, существа, расы и декоративные картографические объекты. Извлечение и предпросмотры выполняются локально в браузере.</div>
          </section>
        </aside>
      </div>`;
  }

  function renderInspector(obj, project) {
    if (obj.kind === 'asset') {
      return `
        <div class="field"><label>Название</label><div class="stat">${humanize(obj.itemId)}</div></div>
        <div class="split">
          <div class="field"><label>Размер</label><input id="objSize" class="input" type="number" min="40" max="900" value="${Math.round(obj.size||160)}"></div>
          <div class="field"><label>Поворот</label><input id="objRotation" class="input" type="number" min="-180" max="180" value="${Math.round(obj.rotation||0)}"></div>
        </div>
        <div class="field"><label>Прозрачность</label><div class="range"><input id="objOpacity" type="range" min="0.1" max="1" step="0.05" value="${obj.opacity ?? 1}"><span>${((obj.opacity ?? 1)*100)|0}%</span></div></div>
        <div class="row"><button class="btn ghost grow" id="duplicateObjBtn">Дублировать</button><button class="btn ghost grow" id="deleteObjBtn">Удалить</button></div>`;
    }
    return `
      <div class="field"><label>Текст</label><textarea id="objText" class="textarea" rows="3">${escapeHtml(obj.text || '')}</textarea></div>
      <div class="split">
        <div class="field"><label>Размер</label><input id="objFontSize" class="input" type="number" min="12" max="160" value="${obj.fontSize || 48}"></div>
        <div class="field"><label>Шрифт</label><select id="objFontFamily" class="select">${FONT_PRESETS.map(f=>`<option value="${f.value}" ${obj.fontFamily===f.value?'selected':''}>${f.label}</option>`).join('')}</select></div>
      </div>
      <div class="split">
        <div class="field"><label>Цвет</label><input id="objColor" class="input" type="color" value="${toColorValue(obj.color || project.settings.labelColor)}"></div>
        <div class="field"><label>Поворот</label><input id="objTextRotation" class="input" type="number" min="-180" max="180" value="${Math.round(obj.rotation||0)}"></div>
      </div>
      <div class="row"><button class="btn ghost grow" id="duplicateObjBtn">Дублировать</button><button class="btn ghost grow" id="deleteObjBtn">Удалить</button></div>`;
  }

  function renderModal() {
    const m = document.createElement('div');
    m.className = 'modal-backdrop';
    if (state.modal === 'new') {
      m.innerHTML = `
        <div class="modal">
          <div class="modal-head"><div><h2>Новый проект</h2><div class="muted">Подготовь холст и сразу переходи к работе.</div></div><button class="close" data-close-modal>&times;</button></div>
          <div class="field"><label>Название</label><input id="newProjectName" class="input" value="Новая карта"></div>
          <div class="field"><label>Тип карты</label><div class="grid-types">${Object.entries(TYPE_PRESETS).map(([id,p],i)=>`<button class="type-btn ${i===0?'active':''}" data-type-btn="${id}"><strong>${p.label}</strong><small>${p.width}×${p.height}</small></button>`).join('')}</div></div>
          <div class="modal-actions"><button class="btn ghost" data-close-modal>Отмена</button><button id="createProjectConfirm" class="btn primary">Создать карту</button></div>
        </div>`;
    }
    APP.appendChild(m);
    m.addEventListener('click', (e) => { if (e.target === m || e.target.hasAttribute('data-close-modal')) { state.modal = null; render(); } });
    if (state.modal === 'new') {
      let selectedType = 'world';
      qa('[data-type-btn]', m).forEach(btn => btn.onclick = () => {
        selectedType = btn.dataset.typeBtn;
        qa('[data-type-btn]', m).forEach(x => x.classList.toggle('active', x === btn));
      });
      q('#createProjectConfirm', m).onclick = () => {
        const preset = TYPE_PRESETS[selectedType];
        const p = normalizeProject({ id: uid('project'), name: q('#newProjectName', m).value.trim() || 'Новая карта', type: selectedType, width: preset.width, height: preset.height, settings: { gridVisible: preset.grid } });
        state.projects.unshift(p); saveProjects(); state.modal = null; setCurrent(p.id);
      };
    }
  }

  function bindCommon() {}
  function bindHome() {
    q('#newProjectBtn').onclick = () => { state.modal = 'new'; render(); };
    q('#importProjectBtn').onclick = () => q('#importFileInput').click();
    q('#importFileInput').onchange = async (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      const text = await file.text();
      try {
        const p = normalizeProject(JSON.parse(text));
        p.id = uid('project'); p.name += ' (import)';
        state.projects.unshift(p); saveProjects(); render();
      } catch { alert('Не удалось импортировать файл проекта.'); }
      e.target.value = '';
    };
    qa('[data-open]').forEach(b => b.onclick = () => setCurrent(b.dataset.open));
    qa('[data-delete]').forEach(b => b.onclick = () => {
      if (!confirm('Удалить проект?')) return;
      state.projects = state.projects.filter(p => p.id !== b.dataset.delete); saveProjects(); render();
    });
    qa('[data-duplicate]').forEach(b => b.onclick = () => {
      const src = state.projects.find(p => p.id === b.dataset.duplicate); if (!src) return;
      const clone = structuredClone(src); clone.id = uid('project'); clone.name += ' — копия'; clone.updatedAt = new Date().toISOString();
      state.projects.unshift(clone); saveProjects(); render();
    });
    qa('[data-export-project]').forEach(b => b.onclick = () => downloadProject(state.projects.find(p => p.id === b.dataset.exportProject)));
  }

  function setupEditor() {
    const project = current();
    if (!project) { state.screen = 'home'; render(); return; }
    const canvas = q('#mapCanvas');
    const stage = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    const resize = () => { canvas.width = stage.clientWidth * devicePixelRatio; canvas.height = stage.clientHeight * devicePixelRatio; canvas.style.width = stage.clientWidth + 'px'; canvas.style.height = stage.clientHeight + 'px'; draw(); };
    new ResizeObserver(resize).observe(stage); resize();

    function worldFromClient(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * devicePixelRatio;
      const y = (e.clientY - rect.top) * devicePixelRatio;
      return { x: (x - state.view.x*devicePixelRatio) / state.view.zoom / devicePixelRatio, y: (y - state.view.y*devicePixelRatio) / state.view.zoom / devicePixelRatio };
    }
    function screenFromWorld(pt) {
      return { x: pt.x * state.view.zoom + state.view.x, y: pt.y * state.view.zoom + state.view.y };
    }
    function sortObjects() { project.objects.sort((a,b)=> (a.z||0)-(b.z||0)); }
    sortObjects();

    function draw() {
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#0d0b09'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      drawPaper(ctx, canvas.width/devicePixelRatio, canvas.height/devicePixelRatio);
      ctx.save();
      ctx.translate(state.view.x, state.view.y);
      ctx.scale(state.view.zoom, state.view.zoom);
      ctx.fillStyle = project.settings.background; ctx.fillRect(0,0,project.width,project.height);
      drawParchmentTexture(ctx, project.width, project.height);
      if (project.settings.gridVisible) drawGrid(ctx, project);
      ctx.strokeStyle = 'rgba(45,32,22,.35)'; ctx.lineWidth = 4 / state.view.zoom; ctx.strokeRect(0,0,project.width,project.height);
      for (const obj of project.objects) drawObject(ctx, obj, project);
      const selected = project.objects.find(o => o.id === project.selectedId);
      if (selected) drawSelection(ctx, selected, project);
      ctx.restore();
    }

    const hitTest = (world) => {
      for (let i = project.objects.length - 1; i >= 0; i--) {
        const obj = project.objects[i];
        const b = objectBounds(obj, project);
        if (world.x >= b.x && world.x <= b.x + b.w && world.y >= b.y && world.y <= b.y + b.h) return obj;
      }
      return null;
    };

    canvas.onmousedown = async (e) => {
      const world = worldFromClient(e);
      if (state.tool === 'asset' && state.selectedAsset) {
        const item = getAssetByKey(state.selectedAsset);
        if (!item) return;
        project.objects.push({ id: uid('obj'), kind: 'asset', packId: item.packId, itemId: item.id, x: world.x, y: world.y, size: packMap[item.packId].defaultSize, rotation: 0, opacity: 1 });
        project.selectedId = project.objects.at(-1).id;
        touch(project); saveProjects(); render();
        return;
      }
      if (state.tool === 'text') {
        project.objects.push({ id: uid('obj'), kind: 'text', text: state.placingText || 'Новая надпись', x: world.x, y: world.y, fontSize: 48, fontFamily: q('#draftFont')?.value || project.settings.labelFont, color: q('#draftColor')?.value || project.settings.labelColor, rotation: 0, opacity: 1 });
        project.selectedId = project.objects.at(-1).id; touch(project); saveProjects(); render();
        return;
      }
      const hit = hitTest(world);
      project.selectedId = hit?.id || null;
      if (hit) state.drag = { kind: 'move', id: hit.id, dx: world.x - hit.x, dy: world.y - hit.y };
      else state.drag = { kind: 'pan', sx: e.clientX, sy: e.clientY, ox: state.view.x, oy: state.view.y };
      render();
    };
    canvas.onmousemove = (e) => {
      if (!state.drag) return;
      if (state.drag.kind === 'move') {
        const obj = project.objects.find(o => o.id === state.drag.id); if (!obj) return;
        const world = worldFromClient(e); obj.x = world.x - state.drag.dx; obj.y = world.y - state.drag.dy; touch(project); draw();
      } else {
        state.view.x = state.drag.ox + (e.clientX - state.drag.sx);
        state.view.y = state.drag.oy + (e.clientY - state.drag.sy);
        draw();
      }
    };
    window.onmouseup = () => { if (state.drag && current()) { saveProjects(); } state.drag = null; };
    canvas.onwheel = (e) => {
      e.preventDefault();
      const before = worldFromClient(e);
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      state.view.zoom = clamp(state.view.zoom * factor, 0.12, 3.8);
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      state.view.x = mx - before.x * state.view.zoom;
      state.view.y = my - before.y * state.view.zoom;
      draw();
    };

    q('#packSelect').onchange = e => { state.activePack = e.target.value; state.selectedAsset = null; render(); };
    q('#assetSearch').oninput = e => { state.assetQuery = e.target.value; render(); };
    qa('[data-asset-key]').forEach(btn => {
      btn.onclick = () => { state.selectedAsset = btn.dataset.assetKey; state.tool = 'asset'; render(); };
      renderAssetPreview(btn.dataset.assetKey, q('canvas', btn));
    });
    qa('[data-tool]').forEach(btn => btn.onclick = () => { state.tool = btn.dataset.tool; render(); });
    q('#fitViewBtn').onclick = () => { fitView(project, stage); draw(); };
    q('#homeBtn').onclick = () => { saveProjects(); state.screen = 'home'; render(); };
    q('#saveHomeBtn').onclick = () => { saveProjects(); state.screen = 'home'; render(); };
    q('#exportProjectBtn').onclick = () => downloadProject(project);
    q('#exportPngBtn').onclick = () => exportPng(project);
    q('#mapWidth').onchange = e => { project.width = clamp(+e.target.value||project.width, 600, 12000); touch(project); saveProjects(); draw(); };
    q('#mapHeight').onchange = e => { project.height = clamp(+e.target.value||project.height, 600, 12000); touch(project); saveProjects(); draw(); };
    q('#gridToggle').onchange = e => { project.settings.gridVisible = e.target.value === '1'; touch(project); saveProjects(); draw(); };
    q('#gridSize').onchange = e => { project.settings.gridSize = clamp(+e.target.value||100, 20, 400); touch(project); saveProjects(); draw(); };
    q('#mapLabelFont').onchange = e => { project.settings.labelFont = e.target.value || 'Cinzel'; touch(project); saveProjects(); draw(); };
    q('#draftText').oninput = e => { state.placingText = e.target.value; };

    bindInspector(project, draw);
    window.onkeydown = (e) => {
      if (e.key === 'Delete' && project.selectedId) {
        project.objects = project.objects.filter(o => o.id !== project.selectedId); project.selectedId = null; touch(project); saveProjects(); render();
      }
    };

    window.__tcRedraw = draw;
    if (!state.view.initializedForProject || state.view.initializedForProject !== project.id) { fitView(project, stage); state.view.initializedForProject = project.id; }
    draw();
  }

  function bindInspector(project, draw) {
    const selected = project.objects.find(o => o.id === project.selectedId); if (!selected) return;
    q('#duplicateObjBtn')?.addEventListener('click', () => {
      const clone = structuredClone(selected); clone.id = uid('obj'); clone.x += 80; clone.y += 80; project.objects.push(clone); project.selectedId = clone.id; touch(project); saveProjects(); render();
    });
    q('#deleteObjBtn')?.addEventListener('click', () => {
      project.objects = project.objects.filter(o => o.id !== selected.id); project.selectedId = null; touch(project); saveProjects(); render();
    });
    if (selected.kind === 'asset') {
      q('#objSize').onchange = e => { selected.size = clamp(+e.target.value||selected.size, 40, 900); touch(project); saveProjects(); draw(); };
      q('#objRotation').onchange = e => { selected.rotation = clamp(+e.target.value||0, -180, 180); touch(project); saveProjects(); draw(); };
      q('#objOpacity').oninput = e => { selected.opacity = clamp(+e.target.value||1, 0.1, 1); touch(project); saveProjects(); render(); };
    } else {
      q('#objText').oninput = e => { selected.text = e.target.value; touch(project); saveProjects(); draw(); };
      q('#objFontSize').onchange = e => { selected.fontSize = clamp(+e.target.value||selected.fontSize, 12, 160); touch(project); saveProjects(); draw(); };
      q('#objFontFamily').onchange = e => { selected.fontFamily = e.target.value || 'Cinzel'; touch(project); saveProjects(); draw(); };
      q('#objColor').onchange = e => { selected.color = e.target.value; touch(project); saveProjects(); draw(); };
      q('#objTextRotation').onchange = e => { selected.rotation = clamp(+e.target.value||0, -180, 180); touch(project); saveProjects(); draw(); };
    }
  }

  function fitView(project, stage) {
    const pad = 40;
    const sx = (stage.clientWidth - pad*2) / project.width;
    const sy = (stage.clientHeight - pad*2) / project.height;
    state.view.zoom = clamp(Math.min(sx, sy), 0.12, 2.5);
    state.view.x = (stage.clientWidth - project.width * state.view.zoom) / 2;
    state.view.y = (stage.clientHeight - project.height * state.view.zoom) / 2;
  }

  function touch(project) { project.updatedAt = new Date().toISOString(); saveProjects(); }
  function toColorValue(c) { return c?.startsWith('#') ? c : '#3e2c1b'; }
  function escapeHtml(s='') { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function drawPaper(ctx,w,h){ const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'#120e0a'); g.addColorStop(.5,'#090806'); g.addColorStop(1,'#0d0b08'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); }
  function drawParchmentTexture(ctx,w,h){ ctx.save(); ctx.globalAlpha=.08; for(let i=0;i<220;i++){ ctx.fillStyle = i%2 ? '#d2c09e' : '#f3e8d0'; const x=Math.random()*w,y=Math.random()*h,r=Math.random()*24+6; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); } ctx.restore(); }
  function drawGrid(ctx,p){ ctx.save(); ctx.strokeStyle = p.settings.gridColor; ctx.lineWidth = 1/state.view.zoom; for(let x=0;x<=p.width;x+=p.settings.gridSize){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,p.height);ctx.stroke();} for(let y=0;y<=p.height;y+=p.settings.gridSize){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(p.width,y);ctx.stroke();} ctx.restore(); }

  function drawObject(ctx,obj,project){
    ctx.save();
    ctx.globalAlpha = obj.opacity ?? 1;
    ctx.translate(obj.x,obj.y);
    ctx.rotate((obj.rotation||0) * Math.PI/180);
    if (obj.kind === 'asset') {
      const asset = getAssetByKey(`${obj.packId}:${obj.itemId}`);
      if (!asset) { ctx.restore(); return; }
      getExtractedAsset(asset).then(canvas => { obj._ratio = canvas.width / canvas.height; });
      if (obj._canvas) {
        const w = obj.size || asset.pack.defaultSize;
        const h = w / (obj._ratio || 1);
        ctx.drawImage(obj._canvas, -w/2, -h/2, w, h);
      } else {
        const s = obj.size || asset.pack.defaultSize;
        ctx.fillStyle = 'rgba(80,60,36,.18)'; ctx.fillRect(-s/2,-s/2,s,s);
        ctx.strokeStyle = '#7f633f'; ctx.strokeRect(-s/2,-s/2,s,s);
      }
    } else {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = obj.color || project.settings.labelColor;
      ctx.font = `${obj.fontSize || 48}px "${obj.fontFamily || project.settings.labelFont || 'Cinzel'}"`;
      const lines = (obj.text || '').split('\n');
      const lineH = (obj.fontSize || 48) * 1.05;
      lines.forEach((line, i) => ctx.fillText(line, 0, (i - (lines.length-1)/2) * lineH));
    }
    ctx.restore();
  }

  function drawSelection(ctx,obj,project){
    const b = objectBounds(obj, project);
    ctx.save(); ctx.strokeStyle='#b88f50'; ctx.lineWidth = 3/state.view.zoom; ctx.setLineDash([10/state.view.zoom,7/state.view.zoom]); ctx.strokeRect(b.x,b.y,b.w,b.h); ctx.restore();
  }

  function objectBounds(obj, project){
    if (obj.kind === 'asset') {
      const size = obj.size || 160; const ratio = obj._ratio || 1; const h = size / ratio; return { x: obj.x - size/2, y: obj.y - h/2, w: size, h };
    }
    const font = `${obj.fontSize || 48}px "${obj.fontFamily || project.settings.labelFont || 'Cinzel'}"`;
    const measure = measureTextBlock(obj.text || '', font);
    return { x: obj.x - measure.w/2, y: obj.y - measure.h/2, w: measure.w, h: measure.h };
  }

  const _measureCanvas = document.createElement('canvas');
  function measureTextBlock(text, font){ const cx = _measureCanvas.getContext('2d'); cx.font = font; const lines = String(text).split('\n'); const widths = lines.map(x=>cx.measureText(x).width); const size = parseInt(font,10) || 48; return { w: Math.max(...widths, 0), h: Math.max(size * lines.length * 1.05, size) }; }

  function flattenPackItems(pack){
    const out=[]; pack.rows.forEach((row,rowIndex)=>row.forEach((id,colIndex)=>out.push({ key:`${pack.id}:${id}`, packId:pack.id, id, rowIndex, colIndex, rowCols:row.length }))); return out;
  }
  function getAssetByKey(key){
    const [packId,itemId] = key.split(':'); const pack = packMap[packId]; if(!pack) return null; const item = flattenPackItems(pack).find(x=>x.id===itemId); return item ? { ...item, pack } : null;
  }

  async function loadSheet(pack){
    if (sheetCache[pack.id]) return sheetCache[pack.id];
    sheetCache[pack.id] = new Promise((resolve,reject)=>{
      const img = new Image(); img.onload = ()=>resolve(img); img.onerror = reject; img.src = `./assets/sheets/${pack.sheet}`;
    });
    return sheetCache[pack.id];
  }

  async function getExtractedAsset(asset){
    const key = `${asset.packId}:${asset.id}`; if (assetCache.has(key)) return assetCache.get(key);
    const p = (async()=>{
      const img = await loadSheet(asset.pack);
      const rows = asset.pack.rows.length;
      const rowHeight = img.height / rows;
      const colWidth = img.width / asset.rowCols;
      const marginX = colWidth * 0.08, marginY = rowHeight * 0.12;
      const sx = asset.colIndex * colWidth + marginX;
      const sy = asset.rowIndex * rowHeight + marginY;
      const sw = colWidth - marginX*2;
      const sh = rowHeight - marginY*2;
      const cut = document.createElement('canvas'); cut.width = sw; cut.height = sh;
      const c = cut.getContext('2d', { willReadFrequently: true });
      c.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      removeBackground(c, cut.width, cut.height);
      const trimmed = trimCanvas(cut, 10);
      return trimmed;
    })();
    assetCache.set(key,p);
    p.then(canvas=>{
      const proj = current();
      if (proj) {
        proj.objects.forEach(o=>{ if(o.kind==='asset' && o.packId===asset.packId && o.itemId===asset.id){ o._canvas = canvas; o._ratio = canvas.width / canvas.height; }});
      }
      if (typeof window.__tcRedraw === 'function') window.__tcRedraw();
    });
    return p;
  }

  function removeBackground(ctx, w, h){
    const img = ctx.getImageData(0,0,w,h);
    const data = img.data;
    const bg = sampleBackground(data, w, h);
    for (let i=0;i<data.length;i+=4){
      const dr = data[i]-bg[0], dg = data[i+1]-bg[1], db = data[i+2]-bg[2];
      const dist = Math.sqrt(dr*dr + dg*dg + db*db);
      if (dist < 24) data[i+3] = 0;
      else if (dist < 40) data[i+3] = Math.round(data[i+3] * ((dist-24)/16));
    }
    ctx.putImageData(img,0,0);
  }
  function sampleBackground(data,w,h){
    const pts=[[4,4],[w-5,4],[4,h-5],[w-5,h-5],[w/2|0,4],[w/2|0,h-5]]; let r=0,g=0,b=0,n=0;
    for(const [x,y] of pts){ const i=(y*w+x)*4; r+=data[i]; g+=data[i+1]; b+=data[i+2]; n++; }
    return [r/n,g/n,b/n];
  }
  function trimCanvas(source,pad=0){
    const ctx=source.getContext('2d',{willReadFrequently:true}); const {width:w,height:h}=source; const img=ctx.getImageData(0,0,w,h).data;
    let minX=w,minY=h,maxX=0,maxY=0,found=false;
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const a=img[(y*w+x)*4+3]; if(a>12){ found=true; if(x<minX)minX=x; if(y<minY)minY=y; if(x>maxX)maxX=x; if(y>maxY)maxY=y; } }
    if(!found) return source;
    minX=Math.max(0,minX-pad); minY=Math.max(0,minY-pad); maxX=Math.min(w-1,maxX+pad); maxY=Math.min(h-1,maxY+pad);
    const out=document.createElement('canvas'); out.width=maxX-minX+1; out.height=maxY-minY+1; out.getContext('2d').drawImage(source,minX,minY,out.width,out.height,0,0,out.width,out.height); return out;
  }

  function renderAssetPreview(key, canvas){
    const asset = getAssetByKey(key); if(!asset || !canvas) return;
    canvas.width = 160; canvas.height = 112;
    const c = canvas.getContext('2d'); c.clearRect(0,0,canvas.width,canvas.height);
    c.fillStyle='#eadcc2'; c.fillRect(0,0,canvas.width,canvas.height);
    getExtractedAsset(asset).then(img=>{
      const s = Math.min((canvas.width-18)/img.width, (canvas.height-18)/img.height);
      const w = img.width*s, h = img.height*s;
      c.clearRect(0,0,canvas.width,canvas.height); c.fillStyle='#eadcc2'; c.fillRect(0,0,canvas.width,canvas.height);
      c.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
    }).catch(()=>{});
  }

  function downloadProject(project){
    if(!project) return; const blob = new Blob([JSON.stringify(project,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${slug(project.name)}.dndatlas`; a.click(); URL.revokeObjectURL(a.href);
  }
  function slug(s){ return s.toLowerCase().replace(/[^a-zа-я0-9]+/gi,'-').replace(/^-+|-+$/g,''); }

  async function exportPng(project){
    const c = document.createElement('canvas'); c.width = project.width; c.height = project.height; const ctx = c.getContext('2d');
    ctx.fillStyle = project.settings.background; ctx.fillRect(0,0,c.width,c.height); drawParchmentTexture(ctx,c.width,c.height); if(project.settings.gridVisible) drawGrid(ctx,{...project, settings: {...project.settings}, width:project.width,height:project.height});
    for(const obj of project.objects){ if(obj.kind==='asset'){ const asset=getAssetByKey(`${obj.packId}:${obj.itemId}`); const img=await getExtractedAsset(asset); obj._canvas=img; obj._ratio=img.width/img.height; } drawObject(ctx,obj,project); }
    const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download=`${slug(project.name)}.png`; a.click();
  }

  render();
})();
