// Fallback local databases when running without Eel python backend
if (!window.eel) {
  const fallbackDb = {
    os: {
      "IsInstalled": false,
      "Edition": "",
      "InstalledApps": ["App Store", "Settings", "App Creator"],
      "MemoryUsedBytes": 104857600,
      "TotalMemoryBytes": 17179869184
    },
    apps: [
      {
        "name": "App Store",
        "icon": "🛍️",
        "path": "apps/store.html",
        "license": "HX-CORE-001",
        "IsStarter": true,
        "description": "Browse and install application software onto HX OS."
      },
      {
        "name": "Settings",
        "icon": "⚙️",
        "path": "apps/settings.html",
        "license": "HX-CORE-002",
        "IsStarter": true,
        "description": "Customize your desktop, wallpapers, personalization themes and settings."
      },
      {
        "name": "App Creator",
        "icon": "🛠️",
        "path": "apps/creator.html",
        "license": "HX-DEV-999",
        "IsStarter": true,
        "description": "Create custom app widgets by typing their direct URL pathways."
      },
      {
        "name": "HX Notepad",
        "icon": "📝",
        "path": "apps/notepad.html",
        "license": "HX-FREE-101",
        "IsStarter": false,
        "description": "A robust, modern and sleek light notepad environment."
      },
      {
        "name": "HX Browser",
        "icon": "🌐",
        "path": "apps/browser.html",
        "license": "HX-FREE-202",
        "IsStarter": false,
        "description": "A standard web browser designed to navigate online websites inside the OS."
      }
    ],
    wallpapers: [
      {
        "id": "neon_sunset",
        "name": "Neon Sunset",
        "style": "linear-gradient(135deg, #f72585, #7209b7, #3f37c9)",
        "theme": "dark",
        "accent": "#f72585"
      },
      {
        "id": "aurora_borealis",
        "name": "Aurora Borealis",
        "style": "linear-gradient(135deg, #00b4d8, #0077b6, #03045e)",
        "theme": "dark",
        "accent": "#00b4d8"
      },
      {
        "id": "cyber_sky",
        "name": "Cyber Sky",
        "style": "linear-gradient(135deg, #121212, #24243e, #300030)",
        "theme": "dark",
        "accent": "#9d4edd"
      },
      {
        "id": "misty_morning",
        "name": "Misty Morning",
        "style": "linear-gradient(135deg, #e0aaff, #c77dff, #9d4edd)",
        "theme": "light",
        "accent": "#7b2cbf"
      },
      {
        "id": "spring_breeze",
        "name": "Spring Breeze",
        "style": "linear-gradient(135deg, #a8ff78, #78ffd6)",
        "theme": "light",
        "accent": "#20bf6b"
      }
    ],
    settings: {
      "WallpaperId": "neon_sunset",
      "Theme": "dark",
      "AccentColor": "#f72585"
    },
    websites: [
      {
        "name": "HX Search Engine",
        "url": "online websites/google.html",
        "description": "Simulated web search portal for index databases.",
        "isLocal": true,
        "category": "Search"
      },
      {
        "name": "HX Wikipedia",
        "url": "online websites/wikipedia.html",
        "description": "An offline encyclopedia compiling articles on computing and HX history.",
        "isLocal": true,
        "category": "Reference"
      },
      {
        "name": "HX Arcade",
        "url": "online websites/snake.html",
        "description": "A fully functional retro arcade Snake game.",
        "isLocal": true,
        "category": "Entertainment"
      },
      {
        "name": "HX Dev Blog",
        "url": "online websites/blog.html",
        "description": "Personal developer log compiling hardware logs.",
        "isLocal": true,
        "category": "Social"
      },
      {
        "name": "OpenStreetMap",
        "url": "https://www.openstreetmap.org/export/embed.html",
        "description": "Real-time world mapping navigation platform (Iframe-Safe).",
        "isLocal": false,
        "category": "Utility"
      },
      {
        "name": "Wikipedia (Online Mobile)",
        "url": "https://en.m.wikipedia.org",
        "description": "Real online mobile Wikipedia portal.",
        "isLocal": false,
        "category": "Reference"
      }
    ]
  };

  if (!localStorage.getItem('hx_os')) localStorage.setItem('hx_os', JSON.stringify(fallbackDb.os));
  if (!localStorage.getItem('hx_apps')) localStorage.setItem('hx_apps', JSON.stringify(fallbackDb.apps));
  if (!localStorage.getItem('hx_settings')) localStorage.setItem('hx_settings', JSON.stringify(fallbackDb.settings));
  if (!localStorage.getItem('hx_websites')) localStorage.setItem('hx_websites', JSON.stringify(fallbackDb.websites));

  window.eel = {
    get_os_data: () => () => Promise.resolve(JSON.parse(localStorage.getItem('hx_os'))),
    save_os_data: (data) => () => {
      localStorage.setItem('hx_os', JSON.stringify(data));
      return Promise.resolve(true);
    },
    get_apps: () => () => Promise.resolve(JSON.parse(localStorage.getItem('hx_apps'))),
    save_apps: (data) => () => {
      localStorage.setItem('hx_apps', JSON.stringify(data));
      return Promise.resolve(true);
    },
    get_wallpapers: () => () => Promise.resolve(fallbackDb.wallpapers),
    save_wallpapers: (data) => () => Promise.resolve(true),
    get_settings: () => () => Promise.resolve(JSON.parse(localStorage.getItem('hx_settings'))),
    save_settings: (data) => () => {
      localStorage.setItem('hx_settings', JSON.stringify(data));
      return Promise.resolve(true);
    },
    get_websites: () => () => Promise.resolve(JSON.parse(localStorage.getItem('hx_websites'))),
    save_websites: (data) => () => {
      localStorage.setItem('hx_websites', JSON.stringify(data));
      return Promise.resolve(true);
    }
  };
}

let selectedEdition = '';
let currentZIndex = 100;
let activeWindows = {};

// 1. Initial System Boot Initialization
window.addEventListener('DOMContentLoaded', () => {
  bootInitialSequence();
  startClock();
});

async function bootInitialSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const installer = document.getElementById('installer-overlay');
  const desktop = document.getElementById('desktop-shell');
  const terminal = document.getElementById('terminal-shell');

  if (window.eel) {
    try {
      // Fetch OS configuration
      const osData = await eel.get_os_data()();
      
      if (!osData.IsInstalled) {
        // Run setup wizard
        setTimeout(() => {
          bootScreen.style.opacity = 0;
          setTimeout(() => {
            bootScreen.style.display = 'none';
            installer.style.display = 'flex';
            goToStep('welcome');
          }, 800);
        }, 1200);
      } else {
        // Boot registered OS edition
        applySettings();
        
        setTimeout(() => {
          bootScreen.style.opacity = 0;
          setTimeout(() => {
            bootScreen.style.display = 'none';
            
            if (osData.Edition === 'HX super computer') {
              terminal.classList.add('active');
              focusTerminal();
              printTerminalSplash();
            } else {
              desktop.style.display = 'flex';
              syncDesktop();
            }
          }, 800);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to load OS data from Eel:", err);
      // Fallback for standalone preview
      bootScreen.style.display = 'none';
      installer.style.display = 'flex';
    }
  } else {
    // Standard static fallback
    bootScreen.style.display = 'none';
    installer.style.display = 'flex';
  }
}

// 2. Setup Wizard (Installer) Logic
function goToStep(step) {
  document.getElementById('wizard-step-welcome').style.display = 'none';
  document.getElementById('wizard-step-editions').style.display = 'none';
  document.getElementById('wizard-step-progress').style.display = 'none';
  document.getElementById('wizard-step-complete').style.display = 'none';

  if (step === 'welcome') {
    document.getElementById('wizard-step-welcome').style.display = 'block';
  } else if (step === 'editions') {
    document.getElementById('wizard-step-editions').style.display = 'block';
  } else if (step === 'progress') {
    document.getElementById('wizard-step-progress').style.display = 'block';
  } else if (step === 'complete') {
    document.getElementById('wizard-step-complete').style.display = 'block';
  }
}

function selectEdition(edition) {
  selectedEdition = edition;
  
  // Highlight card
  const cards = document.querySelectorAll('.edition-card');
  cards.forEach(c => c.classList.remove('selected'));
  
  let targetId = '';
  if (edition === 'HX education') targetId = 'ed-education';
  else if (edition === 'HX student') targetId = 'ed-student';
  else if (edition === 'HX school') targetId = 'ed-school';
  else if (edition === 'HX university') targetId = 'ed-university';
  else if (edition === 'HX home') targetId = 'ed-home';
  else if (edition === 'HX pro') targetId = 'ed-pro';
  else if (edition === 'HX super computer') targetId = 'ed-supercomputer';
  
  document.getElementById(targetId).classList.add('selected');
  document.getElementById('btn-edition-next').removeAttribute('disabled');
}

function startInstallation() {
  goToStep('progress');
  
  const bar = document.getElementById('wizard-progress-bar');
  const log = document.getElementById('wizard-progress-log');
  const logs = [
    "Mounting virtual HDD partition...",
    "Configuring partition block mapping...",
    "Unpacking filesystem core packages...",
    "Installing kernel binaries...",
    "Registering standard software modules...",
    "Registering system app licenses...",
    "Initializing shell services...",
    "Generating OS.json boot settings...",
    "Mounting system tray clocks...",
    "Finalizing boot environment configurations..."
  ];
  
  let pct = 0;
  let logIdx = 0;
  
  const interval = setInterval(async () => {
    pct += 2;
    bar.style.width = `${pct}%`;
    
    if (pct % 10 === 0 && logIdx < logs.length) {
      log.innerText = logs[logIdx];
      logIdx++;
    }
    
    if (pct >= 100) {
      clearInterval(interval);
      
      // Save installed properties to OS.json
      if (window.eel) {
        try {
          const osData = await eel.get_os_data()();
          osData.IsInstalled = true;
          osData.Edition = selectedEdition;
          
          // Switch settings based on edition (super computer accent is bright green)
          if (selectedEdition === 'HX super computer') {
            const settings = await eel.get_settings()();
            settings.AccentColor = '#39ff14';
            await eel.save_settings(settings)();
          }
          
          await eel.save_os_data(osData)();
        } catch (err) {
          console.error("Error updating installation status:", err);
        }
      }
      
      goToStep('complete');
    }
  }, 60);
}

function bootSystem() {
  // Reload environment to load proper OS shell
  window.location.reload();
}

// 3. System Personalization / Theme sync
async function applySettings() {
  if (!window.eel) return;
  try {
    const settings = await eel.get_settings()();
    const wallpapers = await eel.get_wallpapers()();
    const osData = await eel.get_os_data()();
    
    // Apply styling parameters
    const wp = wallpapers.find(w => w.id === settings.WallpaperId);
    
    // Set wallpaper background
    const bgDiv = document.getElementById('os-background');
    if (bgDiv && wp) {
      bgDiv.style.background = wp.style;
    }
    
    // Toggle dark/light theme
    const themeClass = `theme-${settings.Theme}`;
    document.body.className = themeClass;
    
    // Set custom accent variables
    const accentColor = settings.AccentColor;
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Convert hex to rgb for opacity styles
    let r = 247, g = 37, b = 133; // default neon_sunset
    if (accentColor.startsWith('#')) {
      const hex = accentColor.slice(1);
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    
    // Synchronize UI information labels
    const userRole = document.getElementById('user-role-label');
    const userEd = document.getElementById('user-edition-label');
    const avatar = document.getElementById('avatar-char');
    
    if (userRole && osData) {
      userRole.innerText = "HX Administrator";
      avatar.innerText = "A";
      userEd.innerText = osData.Edition;
    }
  } catch (err) {
    console.error("Error loading personalization settings:", err);
  }
}

// 4. Desktop grid and App launchers
async function syncDesktop() {
  if (!window.eel) return;
  try {
    const osData = await eel.get_os_data()();
    const apps = await eel.get_apps()();
    
    const iconContainer = document.getElementById('desktop-icons');
    const startGrid = document.getElementById('start-apps-grid');
    const shortcutContainer = document.getElementById('taskbar-shortcuts');
    
    iconContainer.innerHTML = '';
    startGrid.innerHTML = '';
    shortcutContainer.innerHTML = '';
    
    apps.forEach(app => {
      // Check if installed
      const isInstalled = osData.InstalledApps.includes(app.name);
      if (!isInstalled && !app.IsStarter) return;
      
      // Select appropriate icon or emoji fallback
      let iconHtml = '';
      if (app.icon.endsWith('.png') || app.icon.startsWith('apps/icons')) {
        let emoji = '❓';
        if (app.name.toLowerCase().includes('store')) emoji = '🛍️';
        else if (app.name.toLowerCase().includes('settings')) emoji = '⚙️';
        else if (app.name.toLowerCase().includes('creator')) emoji = '🛠️';
        else if (app.name.toLowerCase().includes('notepad')) emoji = '📝';
        else if (app.name.toLowerCase().includes('browser')) emoji = '🌐';
        iconHtml = `<div class="emoji-icon-fallback">${emoji}</div>`;
      } else {
        iconHtml = `<div class="emoji-icon-fallback">${app.icon}</div>`;
      }
      
      // Draw Desktop Icon
      const desktopDiv = document.createElement('div');
      desktopDiv.className = 'desktop-app-icon';
      desktopDiv.ondblclick = () => launchApp(app.name);
      // Support tap on touchscreen
      desktopDiv.onclick = () => {
        // Highlight active icon
        document.querySelectorAll('.desktop-app-icon').forEach(i => i.style.background = 'transparent');
        desktopDiv.style.background = 'rgba(255, 255, 255, 0.1)';
      };
      desktopDiv.innerHTML = `
        ${iconHtml}
        <span>${app.name}</span>
      `;
      iconContainer.appendChild(desktopDiv);
      
      // Draw Start Menu Icon
      const startDiv = document.createElement('div');
      startDiv.className = 'start-app-item';
      startDiv.onclick = () => {
        toggleStartMenu();
        launchApp(app.name);
      };
      startDiv.innerHTML = `
        ${iconHtml}
        <span>${app.name}</span>
      `;
      startGrid.appendChild(startDiv);
      
      // Draw Taskbar Shortcuts for Starter core apps
      if (app.IsStarter) {
        let scEmoji = '❓';
        if (app.name.toLowerCase().includes('store')) scEmoji = '🛍️';
        else if (app.name.toLowerCase().includes('settings')) scEmoji = '⚙️';
        else if (app.name.toLowerCase().includes('creator')) scEmoji = '🛠️';
        
        const taskDiv = document.createElement('div');
        taskDiv.className = 'taskbar-icon';
        taskDiv.onclick = () => launchApp(app.name);
        taskDiv.innerHTML = `<span style="font-size: 1.3rem;">${scEmoji}</span>`;
        taskDiv.setAttribute('title', app.name);
        shortcutContainer.appendChild(taskDiv);
      }
    });
  } catch (err) {
    console.error("Error drawing desktop icons:", err);
  }
}

// 5. Window Drag and Resize Engine
async function launchApp(appName) {
  if (activeWindows[appName]) {
    // Bring window to focus
    focusWindow(appName);
    // If minimized, restore
    const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
    if (win) win.classList.remove('minimized');
    return;
  }
  
  if (!window.eel) return;
  try {
    const apps = await eel.get_apps()();
    const app = apps.find(a => a.name === appName);
    if (!app) return;
    
    // Create new window structure
    const winId = `win-${appName.replace(/\s+/g, '_')}`;
    const workspace = document.getElementById('desktop-workspace') || document.body;
    
    const winDiv = document.createElement('div');
    winDiv.id = winId;
    winDiv.className = 'app-window glass-panel active';
    winDiv.style.width = '750px';
    winDiv.style.height = '500px';
    winDiv.style.top = `${80 + Math.random() * 60}px`;
    winDiv.style.left = `${150 + Math.random() * 120}px`;
    winDiv.style.zIndex = ++currentZIndex;
    
    // Fallback emoji icon
    let headerEmoji = '❓';
    if (appName.toLowerCase().includes('store')) headerEmoji = '🛍️';
    else if (appName.toLowerCase().includes('settings')) headerEmoji = '⚙️';
    else if (appName.toLowerCase().includes('creator')) headerEmoji = '🛠️';
    else if (appName.toLowerCase().includes('notepad')) headerEmoji = '📝';
    else if (appName.toLowerCase().includes('browser')) headerEmoji = '🌐';
    else if (app.icon && !app.icon.endsWith('.png')) headerEmoji = app.icon;
    
    winDiv.innerHTML = `
      <div class="window-titlebar" onmousedown="dragWindowStart(event, '${appName}')" ondblclick="toggleMaximize('${appName}')">
        <div class="window-info">
          <span>${headerEmoji}</span>
          <span>${appName}</span>
        </div>
        <div class="window-controls">
          <button class="window-btn minimize" onclick="minimizeWindow('${appName}')" title="Minimize"></button>
          <button class="window-btn maximize" onclick="toggleMaximize('${appName}')" title="Maximize"></button>
          <button class="window-btn close" onclick="closeWindow('${appName}')" title="Close"></button>
        </div>
      </div>
      <!-- Cover overlay to block iframe mouse intercepts during drag/resize -->
      <div class="window-content">
        <div class="iframe-shield" style="position:absolute; top:0; left:0; width:100%; height:100%; display:none; z-index:1000;"></div>
        <iframe src="${app.path}"></iframe>
      </div>
      <!-- Custom visual resize anchor -->
      <div class="resize-handle" onmousedown="resizeWindowStart(event, '${appName}')" style="position:absolute; bottom:0; right:0; width:16px; height:16px; cursor:nwse-resize; background: transparent; z-index:1100; display:flex; align-items:flex-end; justify-content:flex-end; padding:2px;">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--text-muted)"><path d="M10 0 L0 10 L10 10 Z"/></svg>
      </div>
    `;
    
    workspace.appendChild(winDiv);
    activeWindows[appName] = {
      id: winId,
      maximized: false,
      top: winDiv.style.top,
      left: winDiv.style.left,
      width: winDiv.style.width,
      height: winDiv.style.height
    };
    
    // Add click handler to focus window on workspace tap
    winDiv.addEventListener('mousedown', () => {
      focusWindow(appName);
    });
  } catch (err) {
    console.error("Error launching app:", err);
  }
}

function focusWindow(appName) {
  // Clear focus styling from other windows
  document.querySelectorAll('.app-window').forEach(w => w.classList.remove('active'));
  
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  if (win) {
    win.classList.add('active');
    win.style.zIndex = ++currentZIndex;
  }
}

function closeWindow(appName) {
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  if (win) {
    win.remove();
    delete activeWindows[appName];
  }
}

function minimizeWindow(appName) {
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  if (win) {
    win.classList.add('minimized');
  }
}

function toggleMaximize(appName) {
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  const data = activeWindows[appName];
  if (win && data) {
    if (data.maximized) {
      win.classList.remove('maximized');
      win.style.top = data.top;
      win.style.left = data.left;
      win.style.width = data.width;
      win.style.height = data.height;
      data.maximized = false;
    } else {
      // Save current frame settings
      data.top = win.style.top;
      data.left = win.style.left;
      data.width = win.style.width;
      data.height = win.style.height;
      
      win.classList.add('maximized');
      data.maximized = true;
    }
  }
}

// Custom Drag Handler Logic
let dragObj = null;
function dragWindowStart(e, appName) {
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  const data = activeWindows[appName];
  if (!win || data.maximized) return;
  
  focusWindow(appName);
  
  // Show all iframe shields to allow smooth dragging over iframes
  document.querySelectorAll('.iframe-shield').forEach(s => s.style.display = 'block');
  
  dragObj = {
    el: win,
    appName: appName,
    startX: e.clientX,
    startY: e.clientY,
    startLeft: parseInt(win.style.left),
    startTop: parseInt(win.style.top)
  };
  
  document.addEventListener('mousemove', dragWindowMove);
  document.addEventListener('mouseup', dragWindowEnd);
}

function dragWindowMove(e) {
  if (!dragObj) return;
  const dx = e.clientX - dragObj.startX;
  const dy = e.clientY - dragObj.startY;
  
  let newLeft = dragObj.startLeft + dx;
  let newTop = dragObj.startTop + dy;
  
  // Enforce boundary logic
  if (newTop < 0) newTop = 0;
  
  dragObj.el.style.left = `${newLeft}px`;
  dragObj.el.style.top = `${newTop}px`;
}

function dragWindowEnd() {
  if (!dragObj) return;
  // Save position
  const data = activeWindows[dragObj.appName];
  if (data) {
    data.left = dragObj.el.style.left;
    data.top = dragObj.el.style.top;
  }
  
  // Hide shields
  document.querySelectorAll('.iframe-shield').forEach(s => s.style.display = 'none');
  
  document.removeEventListener('mousemove', dragWindowMove);
  document.removeEventListener('mouseup', dragWindowEnd);
  dragObj = null;
}

// Custom Resize Handler Logic
let resizeObj = null;
function resizeWindowStart(e, appName) {
  e.stopPropagation();
  e.preventDefault();
  const win = document.getElementById(`win-${appName.replace(/\s+/g, '_')}`);
  const data = activeWindows[appName];
  if (!win || data.maximized) return;
  
  focusWindow(appName);
  
  // Show all shields
  document.querySelectorAll('.iframe-shield').forEach(s => s.style.display = 'block');
  
  resizeObj = {
    el: win,
    appName: appName,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: parseInt(win.style.width),
    startHeight: parseInt(win.style.height)
  };
  
  document.addEventListener('mousemove', resizeWindowMove);
  document.addEventListener('mouseup', resizeWindowEnd);
}

function resizeWindowMove(e) {
  if (!resizeObj) return;
  const dx = e.clientX - resizeObj.startX;
  const dy = e.clientY - resizeObj.startY;
  
  let w = resizeObj.startWidth + dx;
  let h = resizeObj.startHeight + dy;
  
  if (w < 320) w = 320;
  if (h < 240) h = 240;
  
  resizeObj.el.style.width = `${w}px`;
  resizeObj.el.style.height = `${h}px`;
}

function resizeWindowEnd() {
  if (!resizeObj) return;
  // Save dims
  const data = activeWindows[resizeObj.appName];
  if (data) {
    data.width = resizeObj.el.style.width;
    data.height = resizeObj.el.style.height;
  }
  
  // Hide shields
  document.querySelectorAll('.iframe-shield').forEach(s => s.style.display = 'none');
  
  document.removeEventListener('mousemove', resizeWindowMove);
  document.removeEventListener('mouseup', resizeWindowEnd);
  resizeObj = null;
}

// 6. Start Menu and Shortcuts Drawer
function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  menu.classList.toggle('open');
  if (menu.classList.contains('open')) {
    document.getElementById('start-search').focus();
  }
}

// Close Start Menu if clicked outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const startBtn = document.querySelector('.start-btn');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && e.target !== startBtn) {
    menu.classList.remove('open');
  }
});

async function filterStartApps() {
  const query = document.getElementById('start-search').value.toLowerCase();
  const items = document.querySelectorAll('.start-app-item');
  
  items.forEach(item => {
    const text = item.querySelector('span').innerText.toLowerCase();
    if (text.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function shutdownSystem() {
  if (confirm("Shutdown / Reboot HX OS? All configurations will remain persistent, but this workspace is loaded from fresh cycles.")) {
    window.location.reload();
  }
}

// Periodical Taskbar Clock
function startClock() {
  const clock = document.getElementById('system-clock');
  if (!clock) return;
  
  const update = () => {
    const d = new Date();
    let hours = d.getHours();
    let mins = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 is 12
    mins = mins < 10 ? '0' + mins : mins;
    
    clock.innerText = `${hours}:${mins} ${ampm}`;
  };
  
  update();
  setInterval(update, 1000);
}

// 7. HX SUPER COMPUTER Mode: Retro CRT Terminal Controller
function focusTerminal() {
  const input = document.getElementById('terminal-input');
  if (input) input.focus();
}

function printTerminalSplash() {
  const log = document.getElementById('terminal-log');
  if (!log) return;
  
  log.innerHTML = `
██╗  ██╗██╗  ██╗     ██████╗ ███████╗
██║  ██║╚██╗██╔╝    ██╔═══██╗██╔════╝
███████║ ╚███╔╝     ██║   ██║███████╗
██╔══██║ ██╔██╗     ██║   ██║╚════██║
██║  ██║██╔╝ ██╗    ╚██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝     ╚═════╝ ╚══════╝
                                    
HX OS [Version 3.01.54] - Super Computer Monolithic Kernel
Secure boot verification sequence complete. Green CRT monitor online.
Type 'help' to review catalog of valid terminal command instructions.
  `;
}

async function handleTerminalCommand(e) {
  if (e.key !== 'Enter') return;
  
  const inputEl = document.getElementById('terminal-input');
  const rawCmd = inputEl.value;
  inputEl.value = '';
  
  const log = document.getElementById('terminal-log');
  log.innerHTML += `\n<span style="color:#ffffff;">HX_SUPER_COMPUTER@OS:~# ${rawCmd}</span>\n`;
  
  const parts = rawCmd.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ');
  
  if (cmd === '') return;
  
  if (cmd === 'help') {
    log.innerHTML += `
Core OS terminal instructions:
  help                    Display instructions matrix.
  apps                    Display catalog of registered software.
  run &lt;app_name&gt;         Execute software inside graphical desktop window overlay.
  install &lt;app_name&gt;     Register software package from App Store.
  uninstall &lt;app_name&gt;   Remove software package from partition data.
  neofetch                Display detailed hardware and kernel specifications.
  theme &lt;dark/light&gt;      Adjust UI contrast mode instantly.
  clear                   Flush terminal history log.
  reboot                  Re-execute boot loader.
  exit                    Shutdown terminal window frame.
    `;
  } else if (cmd === 'apps') {
    if (!window.eel) return;
    try {
      const apps = await eel.get_apps()();
      const osData = await eel.get_os_data()();
      
      log.innerHTML += `Registered applications:\n`;
      apps.forEach(app => {
        const isInstalled = osData.InstalledApps.includes(app.name) || app.IsStarter;
        const color = isInstalled ? '#2ecc71' : '#ff5f56';
        const label = isInstalled ? '[Installed]' : '[Not Installed - Install from store]';
        log.innerHTML += ` - <span style="color:${color};">${app.name}</span> (${app.license}) ${label}\n`;
      });
    } catch (err) {
      log.innerHTML += `Error: Could not query registry from server.\n`;
    }
  } else if (cmd === 'run') {
    if (!arg) {
      log.innerHTML += `<span style="color:#ff5f56;">Syntax Error: run &lt;app_name&gt;</span>\n`;
      return;
    }
    
    if (!window.eel) return;
    try {
      const apps = await eel.get_apps()();
      const osData = await eel.get_os_data()();
      
      const matched = apps.find(a => a.name.toLowerCase() === arg.toLowerCase());
      if (!matched) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Application "${arg}" not found in registry catalog.</span>\n`;
        return;
      }
      
      const isInstalled = osData.InstalledApps.includes(matched.name) || matched.IsStarter;
      if (!isInstalled) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Application "${matched.name}" is not installed yet. Type 'install ${matched.name}' to mount it.</span>\n`;
        return;
      }
      
      log.innerHTML += `<span style="color:#2ecc71;">Launching graphical window: ${matched.name}...</span>\n`;
      launchApp(matched.name);
    } catch (err) {
      log.innerHTML += `Error: Launch sequence interrupted.\n`;
    }
  } else if (cmd === 'install') {
    if (!arg) {
      log.innerHTML += `<span style="color:#ff5f56;">Syntax Error: install &lt;app_name&gt;</span>\n`;
      return;
    }
    
    if (!window.eel) return;
    try {
      const apps = await eel.get_apps()();
      const osData = await eel.get_os_data()();
      
      const matched = apps.find(a => a.name.toLowerCase() === arg.toLowerCase());
      if (!matched) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Application "${arg}" not found.</span>\n`;
        return;
      }
      
      if (osData.InstalledApps.includes(matched.name)) {
        log.innerHTML += `Info: Application "${matched.name}" is already installed.\n`;
        return;
      }
      
      osData.InstalledApps.push(matched.name);
      osData.MemoryUsedBytes += 25489000;
      await eel.save_os_data(osData)();
      
      log.innerHTML += `<span style="color:#2ecc71;">Success: Mounted "${matched.name}" to memory blocks.</span>\n`;
    } catch (err) {
      log.innerHTML += `Error: Mounting sequence defected.\n`;
    }
  } else if (cmd === 'uninstall') {
    if (!arg) {
      log.innerHTML += `<span style="color:#ff5f56;">Syntax Error: uninstall &lt;app_name&gt;</span>\n`;
      return;
    }
    
    if (!window.eel) return;
    try {
      const apps = await eel.get_apps()();
      const osData = await eel.get_os_data()();
      
      const matched = apps.find(a => a.name.toLowerCase() === arg.toLowerCase());
      if (!matched) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Application "${arg}" not found.</span>\n`;
        return;
      }
      
      if (matched.IsStarter) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Cannot uninstall system-protected kernel packages.</span>\n`;
        return;
      }
      
      const idx = osData.InstalledApps.indexOf(matched.name);
      if (idx === -1) {
        log.innerHTML += `<span style="color:#ff5f56;">Error: Application is not currently installed.</span>\n`;
        return;
      }
      
      osData.InstalledApps.splice(idx, 1);
      osData.MemoryUsedBytes = Math.max(104857600, osData.MemoryUsedBytes - 25489000);
      await eel.save_os_data(osData)();
      
      // Close window if open
      closeWindow(matched.name);
      
      log.innerHTML += `<span style="color:#2ecc71;">Success: Unmounted "${matched.name}" packages.</span>\n`;
    } catch (err) {
      log.innerHTML += `Error: Dismount script failed.\n`;
    }
  } else if (cmd === 'neofetch') {
    if (!window.eel) return;
    try {
      const osData = await eel.get_os_data()();
      const usedMB = (osData.MemoryUsedBytes / (1024*1024)).toFixed(1);
      const totalGB = (osData.TotalMemoryBytes / (1024*1024*1024)).toFixed(0);
      
      log.innerHTML += `
<span style="color:#39ff14;">   /\\_/\\     </span>   <span style="color:#ffffff;">HX_SUPER_COMPUTER@OS</span>
<span style="color:#39ff14;">  ( o.o )    </span>   ------------------------
<span style="color:#39ff14;">   > ^ <     </span>   OS: Monolithic HX OS Simulation v3.01
                Edition: ${osData.Edition}
                Kernel: Monolithic x86_64
                Processor: HX-9 Core Silicon Processor @ 4.80GHz
                Active Storage: ${usedMB} MB / ${totalGB} GB (Simulated)
                Installed Apps: [${osData.InstalledApps.join(', ')}]
                Shell: Custom Javascript Terminal
      \n`;
    } catch (err) {
      log.innerHTML += `Error: spec-fetch failed.\n`;
    }
  } else if (cmd === 'theme') {
    if (!arg || (arg !== 'dark' && arg !== 'light')) {
      log.innerHTML += `<span style="color:#ff5f56;">Syntax Error: theme &lt;dark/light&gt;</span>\n`;
      return;
    }
    
    if (!window.eel) return;
    try {
      const settings = await eel.get_settings()();
      settings.Theme = arg;
      await eel.save_settings(settings)();
      applySettings();
      log.innerHTML += `Theme shifted to ${arg} successfully.\n`;
    } catch (err) {
      log.innerHTML += `Error: settings write locked.\n`;
    }
  } else if (cmd === 'clear') {
    log.innerHTML = '';
  } else if (cmd === 'reboot') {
    log.innerHTML += `System reboot sequence initiated...\n`;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else if (cmd === 'exit') {
    log.innerHTML += `Kernel session termination requested. System halt.\n`;
    if (confirm("Shutdown / Close workspace window?")) {
      window.close();
    }
  } else {
    log.innerHTML += `<span style="color:#ff5f56;">Error: Command "${cmd}" is not recognized in this kernel session. Type 'help' to see catalog.</span>\n`;
  }
  
  // Auto scroll down
  const container = document.getElementById('terminal-container');
  container.scrollTop = container.scrollHeight;
}
