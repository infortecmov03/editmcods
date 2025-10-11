class OfflineCodeEditor {
    constructor() {
        this.files = {};
        this.currentFile = null;
        this.openTabs = [];
        this.editors = {};
        this.currentEditor = 'html';
        this.currentFolder = '/';
        this.appVersion = '1.0.0';
        this.isOnline = navigator.onLine;
    // Default repository to check for GitHub Releases when user hasn't configured one
    // Using the repository provided by the user
    this.defaultUpdateRepo = 'infortecmov03/editmcods';
        
        this.init();
    }

    init() {
        // Carregar sistema de arquivos salvo primeiro (se existir)
        this.loadFileSystem();

        // Inicializar estrutura padrão apenas quando necessário
        this.initializeFileSystem();

        // Inicializar editores e eventos
        this.initializeCodeMirror();
        this.setupEventListeners();

        // Renderizar interface e configurar rede/atualizações
        this.renderFileTree();
        this.setupNetworkListener();
        this.checkForUpdates();
        
        // Mostrar informações iniciais no terminal
        this.terminalLog('Sistema iniciado. Versão ' + this.appVersion, 'info');
        this.terminalLog('Digite "help" para ver os comandos disponíveis', 'info');

        // Em dispositivos móveis, manter o preview e terminal ocultos até o usuário clicar Executar
        if (window.innerWidth <= 768) {
            const preview = document.getElementById('preview-frame');
            const terminal = document.getElementById('terminalPanel');
            if (preview) preview.style.display = 'none';
            if (terminal) terminal.style.display = 'none';
        }
    }

    initializeFileSystem() {
        if (!this.files['/']) {
            this.files['/'] = {
                type: 'folder',
                children: {},
                path: '/'
            };
        }

        // Exemplo de projeto
        if (!this.files['/exemplo.html']) {
            const example = {
                type: 'file',
                content: {
                    html: `<!DOCTYPE html>
<html>
<head>
    <title>Meu Projeto</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Olá Mundo!</h1>
    <p>Bem-vindo ao editor de código offline.</p>
    
    <script src="script.js"></script>
</body>
</html>`,
                    css: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    min-height: 100vh;
}

h1 {
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}`,
                    js: `// JavaScript aqui
console.log('Hello World!');

document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.color = this.style.color === 'red' ? 'white' : 'red';
        });
    }
});`
                },
                extension: 'html',
                path: '/exemplo.html'
            };

            // Armazenar referência no mapa geral e também na estrutura de pastas raiz
            this.files['/exemplo.html'] = example;
            this.addToFolderStructure('/', 'exemplo.html', example);
        }
    }

    initializeCodeMirror() {
        const editorConfig = {
            lineNumbers: true,
            theme: 'monokai',
            mode: 'htmlmixed',
            autoCloseTags: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            // ensure large files render and scrolling works reliably
            viewportMargin: Infinity,
            indentUnit: 4,
            indentWithTabs: false,
            electricChars: true,
            extraKeys: {
                "Tab": function(cm) {
                    if (cm.somethingSelected()) {
                        cm.indentSelection("add");
                    } else {
                        cm.replaceSelection("    ", "end");
                    }
                }
            }
        };

        this.editors.html = CodeMirror.fromTextArea(document.getElementById('html-code'), {
            ...editorConfig,
            mode: 'htmlmixed'
        });

        this.editors.css = CodeMirror.fromTextArea(document.getElementById('css-code'), {
            ...editorConfig,
            mode: 'css'
        });

        this.editors.js = CodeMirror.fromTextArea(document.getElementById('js-code'), {
            ...editorConfig,
            mode: 'javascript'
        });

        Object.values(this.editors).forEach(editor => {
            editor.getWrapperElement().style.display = 'none';
        });

        this.showEditor('html');
        // Attach a basic offline autocomplete for each editor (prefix-based)
        const keywords = [
            'function','const','let','var','return','if','else','for','while','document','window','console','addEventListener'
        ];

        const getHints = (cm, options) => {
            const cur = cm.getCursor();
            const token = cm.getTokenAt(cur);
            const start = token.start;
            const end = cur.ch;
            const curWord = token.string.slice(0, end - start);
            if (!curWord || curWord.trim() === '') return null;
            const list = keywords.filter(k => k.indexOf(curWord) === 0).map(k => ({text: k, displayText: k}));
            return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
        };

        Object.values(this.editors).forEach(editor => {
            // Show simple hint on Ctrl-Space or after typing 2 chars
            editor.on('inputRead', (cm, change) => {
                try {
                    if (change.text[0].length >= 2) {
                        const hints = getHints(cm);
                        if (hints && hints.list && hints.list.length) {
                            if (cm.showHint) cm.showHint({hint: () => hints});
                            else this._showFloatingHints(cm, hints.list);
                        }
                    }
                } catch (e) { /* ignore */ }
            });

            // Keyboard shortcut Ctrl-Space
            editor.addKeyMap({
                'Ctrl-Space': function(cm) { if (cm.showHint) cm.showHint({hint: () => getHints(cm)}); }
            });
        });
    }

    // Wrap script content in an IIFE to avoid polluting global scope in preview
    wrapScript(code) {
        try {
            if (!code || !code.trim()) return '';
            // Avoid double-wrapping if already wrapped (naive check)
            const trimmed = code.trim();
            if (/^\(function\s*\(|^\(async\s+function\s*\(|^\(function\s*\(/.test(trimmed) || /^\/\*/.test(trimmed)) {
                return code;
            }
            return `(function(){\n"use strict";\n${code}\n})();`;
        } catch (e) {
            return code;
        }
    }

    // Helper para gerar pequenos SVGs inline para ícones (offline)
    getInlineIcon(name) {
        // name: 'folder', 'file-html', 'file-css', 'file-js', 'new-file', 'run', 'external', 'save'
        switch(name) {
            case 'folder':
                return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="#f0c674"/></svg>';
            case 'file-html':
                return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 3h10l6 6v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#e34c26"/></svg>';
            case 'file-css':
                return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 3h16v18l-8 2-8-2V3z" fill="#264de4"/></svg>';
            case 'file-js':
                return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" fill="#f7df1e"/><path d="M9 8l2 8 3-6" stroke="#000" stroke-width="1.2" fill="none"/></svg>';
            default:
                return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2" stroke="#ddd" stroke-width="1" fill="none"/></svg>';
        }
    }

    // Minimal floating hints UI when CodeMirror's showHint addon isn't available
    _showFloatingHints(cm, list) {
        this._clearFloatingHints();
        if (!list || !list.length) return;
        const cursor = cm.getCursor();
        const coords = cm.cursorCoords(cursor, 'page');
        const container = document.createElement('div');
        container.className = 'floating-hints';
        container.style.position = 'absolute';
        container.style.zIndex = 3000;
        container.style.left = (coords.left) + 'px';
        container.style.top = (coords.bottom) + 'px';
        container.style.background = '#252525';
        container.style.border = '1px solid #404040';
        container.style.padding = '6px';
        container.style.borderRadius = '6px';
        container.style.minWidth = '120px';
        list.slice(0,8).forEach(item => {
            const el = document.createElement('div');
            el.textContent = item.text || item;
            el.style.padding = '6px 8px';
            el.style.cursor = 'pointer';
            el.style.color = '#ddd';
            el.addEventListener('mouseenter', () => el.style.background = '#333');
            el.addEventListener('mouseleave', () => el.style.background = '');
            el.addEventListener('click', () => {
                cm.replaceRange(item.text, cm.getCursor(true), cm.getCursor(false));
                this._clearFloatingHints();
                cm.focus();
            });
            container.appendChild(el);
        });
        document.body.appendChild(container);
        this._floatingHintsEl = container;
        // Close on click elsewhere
        setTimeout(() => {
            const onDoc = (e) => { if (!container.contains(e.target)) this._clearFloatingHints(); };
            document.addEventListener('click', onDoc, {once: true});
        }, 50);
    }

    _clearFloatingHints() {
        if (this._floatingHintsEl) {
            try { this._floatingHintsEl.remove(); } catch(e){}
            this._floatingHintsEl = null;
        }
    }

    setupEventListeners() {
        // Menu Hamburguer
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('closeSidebar').addEventListener('click', () => this.toggleSidebar());

        // Botões de controle
        document.getElementById('runBtn').addEventListener('click', () => this.runCode());
        document.getElementById('runExternalBtn').addEventListener('click', () => this.runExternal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveCurrentFile());
        document.getElementById('refreshBtn').addEventListener('click', () => this.runCode());

        // Menu items
        document.getElementById('menuNewFile').addEventListener('click', () => this.showNewFileModal());
        document.getElementById('menuNewFolder').addEventListener('click', () => this.showNewFolderModal());
        document.getElementById('menuTerminal').addEventListener('click', () => this.toggleTerminal());
        document.getElementById('menuSettings').addEventListener('click', () => this.showSettingsModal());
        document.getElementById('menuCheckUpdate').addEventListener('click', () => this.checkForUpdates(true));

        // Explorer actions
        document.getElementById('explorerNewFile').addEventListener('click', () => this.showNewFileModal());
        document.getElementById('explorerNewFolder').addEventListener('click', () => this.showNewFolderModal());

        // Tabs dos editores
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const editorType = e.target.closest('.panel-tab').dataset.editor;
                this.showEditor(editorType);
            });
        });

        // Preview controls
        document.getElementById('mobileView').addEventListener('click', () => this.setPreviewView('mobile'));
        document.getElementById('desktopView').addEventListener('click', () => this.setPreviewView('desktop'));

        // Settings inputs - salvar e aplicar imediatamente
        const autoSaveInput = document.getElementById('autoSave');
        const lineNumbersInput = document.getElementById('lineNumbers');
        const themeSelect = document.getElementById('themeSelect');
        const fontSizeInput = document.getElementById('fontSize');

        if (autoSaveInput) {
            autoSaveInput.addEventListener('change', (e) => {
                localStorage.setItem('autoSave', e.target.checked ? 'true' : 'false');
                this.terminalLog(`Auto-save ${e.target.checked ? 'ativado' : 'desativado'}`, 'info');
            });
        }

        if (lineNumbersInput) {
            lineNumbersInput.addEventListener('change', (e) => {
                localStorage.setItem('lineNumbers', e.target.checked ? 'true' : 'false');
                this.applySettings();
            });
        }

        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                localStorage.setItem('theme', e.target.value);
                this.applySettings();
            });
        }

        // Update URL settings inputs
        const updateVersionInput = document.getElementById('updateVersionUrl');
        const updateDownloadInput = document.getElementById('updateDownloadUrl');
    const updateRepoInput = document.getElementById('updateRepo');

        if (updateVersionInput) {
            updateVersionInput.addEventListener('change', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('updateVersionUrl', val);
                this.terminalLog('URL de versão salva', 'info');
            });
        }

        if (updateDownloadInput) {
            updateDownloadInput.addEventListener('change', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('updateDownloadUrl', val);
                this.terminalLog('URL de download salva', 'info');
            });
        }

        if (updateRepoInput) {
            updateRepoInput.addEventListener('change', (e) => {
                const val = e.target.value.trim();
                localStorage.setItem('updateRepo', val);
                this.terminalLog('Repositório para checagem salvo', 'info');
            });
        }

        if (fontSizeInput) {
            fontSizeInput.addEventListener('input', (e) => {
                localStorage.setItem('fontSize', e.target.value);
                const valueEl = document.getElementById('fontSizeValue');
                if (valueEl) valueEl.textContent = e.target.value + 'px';
                this.applySettings();
            });
        }

        // Terminal controls
        document.getElementById('clearTerminal').addEventListener('click', () => this.clearTerminal());
        document.getElementById('toggleTerminal').addEventListener('click', () => this.toggleTerminal());
        document.getElementById('terminalInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeTerminalCommand(e.target.value);
                e.target.value = '';
            }
        });

        // Modais
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        document.getElementById('createFileBtn').addEventListener('click', () => this.createFile());
        document.getElementById('createFolderBtn').addEventListener('click', () => this.createFolder());

        // Atualização
        document.getElementById('installUpdate').addEventListener('click', () => this.installUpdate());
        document.getElementById('dismissUpdate').addEventListener('click', () => this.hideUpdateNotification());

        // Auto-save
        Object.values(this.editors).forEach(editor => {
            editor.on('change', () => {
                if (localStorage.getItem('autoSave') === 'true') {
                    this.autoSave();
                }
            });
        });

        // Fechar modais ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentFile();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
        });
    }

    setupNetworkListener() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.terminalLog('Conexão restaurada', 'success');
            this.checkForUpdates();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.terminalLog('Conexão perdida - Modo offline', 'error');
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    showEditor(editorType) {
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.editor === editorType);
        });

        Object.values(this.editors).forEach(editor => {
            editor.getWrapperElement().style.display = 'none';
        });

        this.editors[editorType].getWrapperElement().style.display = 'block';
        this.editors[editorType].refresh();
        this.currentEditor = editorType;
    }

    setPreviewView(view) {
        const previewFrame = document.getElementById('preview-frame');
        const mobileBtn = document.getElementById('mobileView');
        const desktopBtn = document.getElementById('desktopView');

        if (view === 'mobile') {
            previewFrame.classList.add('mobile-view');
            mobileBtn.classList.add('active');
            desktopBtn.classList.remove('active');
        } else {
            previewFrame.classList.remove('mobile-view');
            desktopBtn.classList.add('active');
            mobileBtn.classList.remove('active');
        }
    }

    // Toggle sidebar: on mobile it slides, on desktop allow hide/show to free workspace
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        // If small screen, use mobile sliding behavior
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
            return;
        }
        // Desktop: toggle a collapsed class to hide explorer and expand editor area
        sidebar.classList.toggle('collapsed');
        const fileExplorer = document.querySelector('.file-explorer');
        if (sidebar.classList.contains('collapsed')) {
            fileExplorer.style.display = 'none';
            document.querySelector('.editor-container').style.marginLeft = '0';
        } else {
            fileExplorer.style.display = '';
            document.querySelector('.editor-container').style.marginLeft = '';
        }
    }

    renderFileTree() {
        const fileTree = document.getElementById('fileTree');
        fileTree.innerHTML = this.renderFolder('/', this.files['/']);
        
        // Adicionar eventos aos itens
        this.attachFileTreeEvents();
    }

    renderFolder(path, folder, level = 0) {
        let html = '';
        if (!folder || !folder.children) return html;
        const items = Object.entries(folder.children).sort(([aName, a], [bName, b]) => {
            // Pastas primeiro, depois arquivos
            if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
            return aName.localeCompare(bName);
        });

        for (const [name, item] of items) {
            const fullPath = path === '/' ? `/${name}` : `${path}/${name}`;
            
            if (item.type === 'folder') {
                html += `
                    <div class="folder-item" data-path="${fullPath}" data-level="${level}">
                        <span class="folder-caret">${this.getInlineIcon('')}</span>
                        <span class="folder-svg">${this.getInlineIcon('folder')}</span>
                        <span>${name}</span>
                    </div>
                    <div class="folder-children">
                        ${this.renderFolder(fullPath, item, level + 1)}
                    </div>
                `;
            } else {
                const icon = this.getFileIcon(item.extension);
                const isActive = fullPath === this.currentFile;
                html += `
                    <div class="file-item ${isActive ? 'active' : ''}" data-path="${fullPath}" data-level="${level}">
                        <span class="file-icon-svg">${this.getInlineIcon('file-'+item.extension)}</span>
                        <span>${name}</span>
                    </div>
                `;
            }
        }

        return html;
    }

    attachFileTreeEvents() {
        // Pastas - expandir/recolher
        document.querySelectorAll('.folder-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('fa-caret-right')) {
                    this.navigateToFolder(item.dataset.path);
                }
                item.classList.toggle('expanded');
            });
        });

        // Arquivos - abrir
        document.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                this.openFile(item.dataset.path);
            });
        });
    }

    navigateToFolder(path) {
        this.currentFolder = path;
        this.terminalLog(`Navegando para: ${path}`, 'info');
        // Aqui você pode implementar lógica adicional para navegação em pastas
    }

    getFileIcon(extension) {
        const icons = {
            'html': 'fa-html5',
            'css': 'fa-css3-alt',
            'js': 'fa-js',
            'json': 'fa-code',
            'txt': 'fa-file-alt',
            'md': 'fa-markdown'
        };
        return icons[extension] || 'fa-file';
    }

    showNewFileModal() {
        this.updateLocationSelects();
        document.getElementById('newFileModal').style.display = 'block';
        document.getElementById('fileName').focus();
    }

    showNewFolderModal() {
        this.updateLocationSelects();
        document.getElementById('newFolderModal').style.display = 'block';
        document.getElementById('folderName').focus();
    }

    showSettingsModal() {
        document.getElementById('settingsModal').style.display = 'block';
        this.loadSettings();
    }

    updateLocationSelects() {
        const selects = document.querySelectorAll('#fileLocation, #folderLocation');
        selects.forEach(select => {
            select.innerHTML = '<option value="/">/ (Raiz)</option>';
            this.addFolderOptions(select, '', this.files['/']);
        });
    }

    addFolderOptions(select, currentPath, folder) {
        if (!folder || !folder.children) return;
        for (const [name, item] of Object.entries(folder.children)) {
            if (item.type === 'folder') {
                const folderPath = currentPath ? `${currentPath}/${name}` : `/${name}`;
                select.innerHTML += `<option value="${folderPath}">${folderPath}</option>`;
                this.addFolderOptions(select, folderPath, item);
            }
        }
    }

    createFile() {
        const name = document.getElementById('fileName').value;
        const location = document.getElementById('fileLocation').value;
        const template = document.getElementById('fileTemplate').value;

        if (!name) {
            this.terminalLog('Erro: Digite um nome para o arquivo', 'error');
            return;
        }

        const fullPath = location === '/' ? `/${name}` : `${location}/${name}`;
        const extension = name.split('.').pop();

        // Templates
        const templates = {
            html: {
                html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Novo Projeto</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Olá Mundo!</h1>\n    \n    <script src="script.js"><\/script>\n</body>\n</html>`,
                css: `body {\n    margin: 0;\n    padding: 20px;\n    font-family: Arial, sans-serif;\n}`,
                js: `// Seu JavaScript aqui\nconsole.log('Hello World!');`
            },
            css: {
                html: '',
                css: `/* Seu CSS aqui */\nbody {\n    margin: 0;\n    padding: 20px;\n    font-family: Arial, sans-serif;\n}`,
                js: ''
            },
            js: {
                html: '',
                css: '',
                js: `// Seu JavaScript aqui\nconsole.log('Hello World!');`
            },
            empty: {
                html: '',
                css: '',
                js: ''
            }
        };

        this.files[fullPath] = {
            type: 'file',
            content: templates[template],
            extension: extension,
            path: fullPath
        };

        this.addToFolderStructure(location, name, this.files[fullPath]);
        this.renderFileTree();
        this.openFile(fullPath);
        document.getElementById('newFileModal').style.display = 'none';
        this.saveFileSystem();
        
        this.terminalLog(`Arquivo criado: ${fullPath}`, 'success');
        this.navigateToFolder(location);
    }

    createFolder() {
        const name = document.getElementById('folderName').value;
        const location = document.getElementById('folderLocation').value;

        if (!name) {
            this.terminalLog('Erro: Digite um nome para a pasta', 'error');
            return;
        }

        const fullPath = location === '/' ? `/${name}` : `${location}/${name}`;

        this.files[fullPath] = {
            type: 'folder',
            children: {},
            path: fullPath
        };

        this.addToFolderStructure(location, name, this.files[fullPath]);
        this.renderFileTree();
        document.getElementById('newFolderModal').style.display = 'none';
        this.saveFileSystem();
        
        this.terminalLog(`Pasta criada: ${fullPath}`, 'success');
        this.navigateToFolder(fullPath);
    }

    addToFolderStructure(location, name, item) {
        let currentFolder = this.files['/'];
        
        if (location !== '/') {
            const pathParts = location.split('/').filter(p => p);
            for (const part of pathParts) {
                currentFolder = currentFolder.children[part];
            }
        }

        currentFolder.children[name] = item;
    }

    openFile(path) {
        if (!this.files[path] || this.files[path].type !== 'file') return;

        this.currentFile = path;
        
        // Adicionar tab se não existir
        if (!this.openTabs.includes(path)) {
            this.openTabs.push(path);
            this.renderTabs();
        }

        // Ativar tab
        this.activateTab(path);

        // Carregar conteúdo
        const file = this.files[path];
        this.editors.html.setValue(file.content.html || '');
        this.editors.css.setValue(file.content.css || '');
        this.editors.js.setValue(file.content.js || '');
        // Refresh editors to ensure layout for large content
        try {
            Object.values(this.editors).forEach(ed => { ed.refresh(); });
            // ensure cursor and viewport are visible
            if (this.editors.html) { this.editors.html.setCursor(0,0); this.editors.html.scrollIntoView({line:0,ch:0}); }
        } catch(e){}

        this.terminalLog(`Arquivo aberto: ${path}`, 'success');
    }

    renderTabs() {
        const tabsContainer = document.getElementById('editorTabs');
        tabsContainer.innerHTML = '';

        this.openTabs.forEach(path => {
            const name = path.split('/').pop();
            const isActive = path === this.currentFile;
            const tab = document.createElement('button');
            tab.className = `editor-tab ${isActive ? 'active' : ''}`;
            tab.innerHTML = `
                ${this.getInlineIcon('file-'+this.files[path].extension)}
                <span>${name}</span>
                <button class="tab-close" data-path="${path}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M18 6L6 18M6 6l12 12" stroke="#999" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
            `;
            
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    this.activateTab(path);
                }
            });

            tabsContainer.appendChild(tab);
        });

        // Adicionar eventos para fechar tabs
        document.querySelectorAll('.tab-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeTab(e.target.closest('.tab-close').dataset.path);
            });
        });
    }

    activateTab(path) {
        // Ativa apenas a aba selecionada e atualiza a interface.
        // Evita chamar openFile() aqui para não entrar em recursão com openFile -> activateTab -> openFile...
        if (!this.files[path] || this.files[path].type !== 'file') return;
        this.currentFile = path;
        this.renderTabs();
        // Carregar conteúdo do arquivo na interface (sem adicionar nova tab)
        const file = this.files[path];
        this.editors.html.setValue(file.content.html || '');
        this.editors.css.setValue(file.content.css || '');
        this.editors.js.setValue(file.content.js || '');
        // Force refresh to render large files correctly
        try { Object.values(this.editors).forEach(ed => ed.refresh()); } catch(e){}
    }

    closeTab(path) {
        const index = this.openTabs.indexOf(path);
        if (index > -1) {
            this.openTabs.splice(index, 1);
        }

        if (path === this.currentFile) {
            this.currentFile = this.openTabs[this.openTabs.length - 1] || null;
            if (this.currentFile) {
                this.openFile(this.currentFile);
            } else {
                this.clearEditors();
            }
        }

        this.renderTabs();
        this.terminalLog(`Tab fechado: ${path}`, 'info');
    }

    clearEditors() {
        this.editors.html.setValue('');
        this.editors.css.setValue('');
        this.editors.js.setValue('');
        document.getElementById('preview-frame').src = 'about:blank';
    }

    saveCurrentFile() {
        if (!this.currentFile) {
            this.terminalLog('Erro: Nenhum arquivo aberto para salvar', 'error');
            return;
        }

        this.files[this.currentFile].content = {
            html: this.editors.html.getValue(),
            css: this.editors.css.getValue(),
            js: this.editors.js.getValue()
        };

        this.saveFileSystem();
        this.terminalLog(`Arquivo salvo: ${this.currentFile}`, 'success');
    }

    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveCurrentFile();
        }, 2000);
    }

    async runCode() {
        if (!this.currentFile) {
            this.terminalLog('Erro: Nenhum arquivo aberto para executar', 'error');
            return;
        }

        const html = this.editors.html.getValue();
        const css = this.editors.css.getValue();
        const js = this.editors.js.getValue();

        // Create separate blobs for CSS and JS and produce preview HTML that links them
        // Revoke previous blobs if any
        if (this._previewBlobs) {
            this._previewBlobs.forEach(u => { try { URL.revokeObjectURL(u); } catch(e){} });
        }
        this._previewBlobs = [];

        // Process HTML to extract local link/script references and replace with blob links
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const basePath = this.currentFile.split('/').slice(0, -1).join('/') || '/';

        // Process CSS files referenced in link rel=stylesheet inside the HTML or separate css content
        // create blob for the CSS editor content
        const cssBlob = new Blob([css], {type: 'text/css'});
        const cssUrl = URL.createObjectURL(cssBlob);
        this._previewBlobs.push(cssUrl);

    // Create JS blob (wrap to avoid globals)
    const jsWrapped = this.wrapScript(js);
    const jsBlob = new Blob([jsWrapped], {type: 'text/javascript'});
        const jsUrl = URL.createObjectURL(jsBlob);
        this._previewBlobs.push(jsUrl);

        // Replace any <link rel=stylesheet href="..."> to point to the css blob if it references local file
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href) return;
            if (href.startsWith('http') || href.startsWith('/') || href.startsWith('#')) return;
            // If the file exists in virtual FS, use its css blob; otherwise keep blob generated from editor
            const fullPath = basePath === '/' ? `/${href}` : `${basePath}/${href}`;
            if (this.files[fullPath] && this.files[fullPath].type === 'file') {
                const fileCss = this.files[fullPath].content.css || '';
                const b = URL.createObjectURL(new Blob([fileCss], {type: 'text/css'}));
                this._previewBlobs.push(b);
                link.setAttribute('href', b);
            } else {
                link.setAttribute('href', cssUrl);
            }
        });

        // For any <script src=> replace with blob pointing to referenced file content or to jsUrl
            doc.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src') || '';
            if (!src) return;
            if (src.startsWith('http') || src.startsWith('/') || src.startsWith('#')) return;
            const fullPath = basePath === '/' ? `/${src}` : `${basePath}/${src}`;
            if (this.files[fullPath] && this.files[fullPath].type === 'file') {
                let fileJs = this.files[fullPath].content.js || '';
                fileJs = this.wrapScript(fileJs);
                const b = URL.createObjectURL(new Blob([fileJs], {type: 'text/javascript'}));
                this._previewBlobs.push(b);
                script.setAttribute('src', b);
            } else {
                script.setAttribute('src', jsUrl);
            }
        });

        // Convert inline <script> tags (no src) into separate blob URLs to improve reliability
        // for very large inline scripts and to avoid huge HTML payloads.
        doc.querySelectorAll('script:not([src])').forEach(script => {
            try {
                const code = script.textContent || '';
                if (!code.trim()) return;
                // Wrap inline script to isolate globals
                const wrapped = this.wrapScript(code);
                const b = URL.createObjectURL(new Blob([wrapped], { type: 'text/javascript' }));
                this._previewBlobs.push(b);
                script.setAttribute('src', b);
                // Clear inline content to avoid duplication
                script.textContent = '';
            } catch (e) {
                // ignore and leave inline script as-is
            }
        });

        // Convert inline <style> tags into blob-backed <link rel="stylesheet"> elements
        doc.querySelectorAll('style').forEach(styleTag => {
            try {
                const cssText = styleTag.textContent || '';
                if (!cssText.trim()) return;
                const b = URL.createObjectURL(new Blob([cssText], { type: 'text/css' }));
                this._previewBlobs.push(b);
                const linkEl = doc.createElement('link');
                linkEl.setAttribute('rel', 'stylesheet');
                linkEl.setAttribute('href', b);
                styleTag.parentNode.replaceChild(linkEl, styleTag);
            } catch (e) {
                // ignore and keep inline style
            }
        });

        // If no head link exists, inject the generated CSS link
        if (!doc.querySelector('link[rel="stylesheet"]')) {
            const linkEl = doc.createElement('link');
            linkEl.setAttribute('rel', 'stylesheet');
            linkEl.setAttribute('href', cssUrl);
            doc.head.appendChild(linkEl);
        }

        // If no script tags, append the editor JS at the end
        if (!doc.querySelector('script[src]') && (js && js.trim())) {
            const s = doc.createElement('script');
            s.setAttribute('src', jsUrl);
            doc.body.appendChild(s);
        }

    const previewContent = '<!doctype html>\n' + doc.documentElement.outerHTML;

    // Create a fresh iframe to ensure a clean global scope for each run.
    const oldFrame = document.getElementById('preview-frame');
    const newFrame = document.createElement('iframe');
    newFrame.id = 'preview-frame';
    newFrame.className = (oldFrame && oldFrame.className) ? oldFrame.className : 'preview-frame';
    // Replace old frame in DOM so any previous execution context is discarded
    if (oldFrame && oldFrame.parentNode) {
        oldFrame.parentNode.replaceChild(newFrame, oldFrame);
    } else {
        // If for some reason the old frame is missing, append to container
        const container = document.querySelector('.preview-panel');
        if (container) container.appendChild(newFrame);
    }

    const previewFrame = document.getElementById('preview-frame');
    const blob = new Blob([previewContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this._previewBlobs.push(url);

        // On mobile, reveal preview and terminal when Run is pressed
        if (window.innerWidth <= 768) {
            try {
                const preview = document.querySelector('.preview-panel');
                const terminal = document.getElementById('terminalPanel');
                const previewEl = document.getElementById('preview-frame');
                if (previewEl) previewEl.style.display = 'block';
                if (preview) preview.style.display = '';
                if (terminal) terminal.style.display = '';
            } catch(e){}
        }

    this.terminalLog(`Preview atualizado: ${this.currentFile}`, 'success');
        // Robust write strategy for iframe preview:
        // 1) If supported and suitable, use srcdoc (usually robust for large HTML)
        // 2) For smaller documents, attempt document.write on a fresh iframe
        // 3) Fallback to blob URL
        // 4) If still not rendering after a short timeout, open in external tab

        const MAX_DIRECT_WRITE = 150 * 1024; // 150 KB threshold for document.write
        let didRender = false;

        try {
            // Ensure iframe visible
            try { previewFrame.style.display = 'block'; } catch(e){}

            // Check blob size and prefer blob for large content
            const htmlBlob = new Blob([previewContent], { type: 'text/html' });
            const blobSize = htmlBlob.size || previewContent.length;

            if (blobSize > MAX_DIRECT_WRITE) {
                // For large content prefer blob URL to avoid document.write/srcdoc limits
                try {
                    previewFrame.src = url;
                    didRender = true;
                    this.terminalLog(`Preview usando blob URL (tamanho ${Math.round(blobSize/1024)} KB)`, 'info');
                } catch (e) {
                    didRender = false;
                }
            } else {
                // Try srcdoc first
                if ('srcdoc' in previewFrame) {
                    try {
                        previewFrame.srcdoc = previewContent;
                        didRender = true;
                        this.terminalLog('Preview usando srcdoc (conteúdo pequeno)', 'info');
                    } catch (e) {
                        didRender = false;
                    }
                }

                // If srcdoc wasn't used, try document.write for small payloads
                if (!didRender) {
                    try {
                        const tryWrite = () => {
                            try {
                                const win = previewFrame.contentWindow;
                                const doci = previewFrame.contentDocument || (win && win.document);
                                if (doci) {
                                    doci.open();
                                    doci.write(previewContent);
                                    doci.close();
                                    return true;
                                }
                            } catch (e) {
                                return false;
                            }
                            return false;
                        };

                        // First attempt
                        if (tryWrite()) {
                            didRender = true;
                            this.terminalLog('Preview usando document.write (conteúdo pequeno)', 'info');
                        } else {
                            // short delay and retry once — helps with timing issues on some devices/browsers
                            await new Promise(res => setTimeout(res, 60));
                            if (tryWrite()) {
                                didRender = true;
                                this.terminalLog('Preview document.write retry bem-sucedido', 'info');
                            } else {
                                didRender = false;
                            }
                        }
                    } catch (e) {
                        didRender = false;
                    }
                }

                // Fallback to blob URL if not rendered
                if (!didRender) {
                    try {
                        previewFrame.src = url;
                        didRender = true;
                        this.terminalLog('Preview fallback para blob URL', 'info');
                    } catch (e) { didRender = false; }
                }
            }
        } catch (e) {
            try { previewFrame.src = url; } catch(e2){}
        }

        // If rendering does not show up, open in a new tab after a short timeout as a last-resort fallback.
        setTimeout(() => {
            try {
                const docCheck = previewFrame.contentDocument || (previewFrame.contentWindow && previewFrame.contentWindow.document);
                const body = docCheck && docCheck.body;
                const contentPresent = body && body.children && body.children.length > 0;
                if (!contentPresent) {
                    // Open externally as a fallback
                    const fallbackUrl = url;
                    window.open(fallbackUrl, '_blank');
                    this.terminalLog('Preview não foi renderizado no iframe — abrindo em nova aba como fallback.', 'error');
                }
            } catch (e) {
                try { window.open(url, '_blank'); } catch(e2){}
            }
        }, 1000);
    }

    processRelativeLinks(content, currentFilePath) {
        // Usa DOMParser para processar HTML e substituir links internos por data: URLs
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const basePath = currentFilePath.split('/').slice(0, -1).join('/') || '/';

            // <link rel="stylesheet" href="...">
            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (!href) return;
                if (href.startsWith('http') || href.startsWith('/') || href.startsWith('#')) return;
                const fullPath = basePath === '/' ? `/${href}` : `${basePath}/${href}`;
                if (this.files[fullPath] && this.files[fullPath].type === 'file') {
                    const cssText = this.files[fullPath].content.css || '';
                    const dataUrl = `data:text/css;base64,${btoa(cssText)}`;
                    link.setAttribute('href', dataUrl);
                }
            });

            // <script src="..."></script>
            doc.querySelectorAll('script[src]').forEach(script => {
                const src = script.getAttribute('src');
                if (!src) return;
                if (src.startsWith('http') || src.startsWith('/') || src.startsWith('#')) return;
                const fullPath = basePath === '/' ? `/${src}` : `${basePath}/${src}`;
                if (this.files[fullPath] && this.files[fullPath].type === 'file') {
                    const jsText = this.files[fullPath].content.js || '';
                    const dataUrl = `data:text/javascript;base64,${btoa(jsText)}`;
                    script.setAttribute('src', dataUrl);
                }
            });

            // Retorna o innerHTML do body se contiver body, caso contrário serializa o documento inteiro
            if (doc.body && doc.body.innerHTML.trim()) {
                return doc.body.innerHTML;
            }
            return doc.documentElement.outerHTML;
        } catch (e) {
            // fallback simples: retorna original
            return content;
        }
    }

    runExternal() {
        if (!this.currentFile) {
            this.terminalLog('Erro: Nenhum arquivo aberto para executar', 'error');
            return;
        }

        const html = this.editors.html.getValue();
        const css = this.editors.css.getValue();
        const js = this.editors.js.getValue();

        const fullContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}<\/script>
</body>
</html>`;

        const blob = new Blob([fullContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Abrir em nova janela/aba
        window.open(url, '_blank');
        this.terminalLog(`Abrindo no navegador externo: ${this.currentFile}`, 'success');
    }

    // Terminal Functions
    terminalLog(message, type = 'info') {
        const terminal = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = `> ${message}`;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }

    clearTerminal() {
        document.getElementById('terminalOutput').innerHTML = 
            '<div class="terminal-line">Terminal limpo. Digite "help" para ver os comandos.</div>';
    }

    toggleTerminal() {
        const terminal = document.getElementById('terminalPanel');
        const toggleBtn = document.getElementById('toggleTerminal');
        
        terminal.classList.toggle('collapsed');
        const svg = document.getElementById('toggleTerminalSvg');
        if (terminal.classList.contains('collapsed')) {
            // chevron up
            if (svg) svg.innerHTML = '<path d="M18 15l-6-6-6 6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>';
        } else {
            // chevron down
            if (svg) svg.innerHTML = '<path d="M6 9l6 6 6-6" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path>';
        }
    }

    executeTerminalCommand(command) {
        if (!command.trim()) return;

        this.terminalLog(command, 'info');
        
        const args = command.trim().split(' ');
        const cmd = args[0].toLowerCase();

        switch (cmd) {
            case 'help':
                this.terminalLog('Comandos disponíveis:', 'info');
                this.terminalLog('  ls - Listar arquivos', 'info');
                this.terminalLog('  cd [pasta] - Navegar para pasta', 'info');
                this.terminalLog('  clear - Limpar terminal', 'info');
                this.terminalLog('  version - Mostrar versão', 'info');
                this.terminalLog('  status - Status do sistema', 'info');
                break;
                
            case 'ls':
                this.listFiles();
                break;
                
            case 'cd':
                if (args[1]) {
                    this.navigateToFolder(args[1]);
                } else {
                    this.terminalLog('Uso: cd [pasta]', 'error');
                }
                break;
                
            case 'clear':
                this.clearTerminal();
                break;
                
            case 'version':
                this.terminalLog(`Versão do Editor: ${this.appVersion}`, 'success');
                break;
                
            case 'status':
                this.terminalLog(`Online: ${this.isOnline}`, 'info');
                this.terminalLog(`Arquivo atual: ${this.currentFile || 'Nenhum'}`, 'info');
                this.terminalLog(`Pasta atual: ${this.currentFolder}`, 'info');
                break;
                
            default:
                this.terminalLog(`Comando não encontrado: ${cmd}`, 'error');
        }
    }

    listFiles() {
        const currentFolder = this.getFolderByPath(this.currentFolder);
        if (currentFolder && currentFolder.children) {
            for (const [name, item] of Object.entries(currentFolder.children)) {
                const type = item.type === 'folder' ? '[DIR]' : '[FILE]';
                this.terminalLog(`${type} ${name}`, 'info');
            }
        }
    }

    getFolderByPath(path) {
        if (path === '/') return this.files['/'];
        
        const parts = path.split('/').filter(p => p);
        let current = this.files['/'];
        
        for (const part of parts) {
            if (current.children[part] && current.children[part].type === 'folder') {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    // Update System
    async checkForUpdates(manual = false) {
        // Prefer GitHub Releases when a repo is configured, otherwise fallback to versionUrl
        const versionUrl = localStorage.getItem('updateVersionUrl') || '';
        const downloadUrl = localStorage.getItem('updateDownloadUrl') || '';
    const repo = localStorage.getItem('updateRepo') || this.defaultUpdateRepo || '';

        if (!this.isOnline) {
            if (manual) this.terminalLog('Sem conexão para verificar atualizações', 'error');
            return;
        }

        // If repo is configured, attempt GitHub Releases API first
        if (repo) {
            if (manual) this.terminalLog(`Consultando GitHub Releases para ${repo}...`, 'info');
            try {
                const release = await this.getLatestReleaseFromGithub(repo);
                if (release && release.tag_name) {
                    const latestVersion = release.tag_name.replace(/^v/, '').trim();
                    const cmp = this.compareVersions(latestVersion, this.appVersion);
                    if (cmp > 0) {
                        // choose first asset if exists or fallback to html_url
                    // Prefer APK/AAB assets when present, then ZIP, otherwise first asset
                    let asset = null;
                    if (release.assets && release.assets.length) {
                        const assets = release.assets;
                        // priority: .apk, .aab, .zip
                        asset = assets.find(a => a.name && a.name.toLowerCase().endsWith('.apk'))
                        || assets.find(a => a.name && a.name.toLowerCase().endsWith('.aab'))
                        || assets.find(a => a.name && a.name.toLowerCase().endsWith('.zip'))
                        || assets[0];
                    }
                    this._latestRemoteVersion = latestVersion;
                    this._latestDownloadUrl = asset ? asset.browser_download_url : (downloadUrl || release.zipball_url || release.tarball_url || '');
                    this._latestAssetName = asset ? asset.name : '';
                    this._latestAssetType = asset && asset.name ? (asset.name.split('.').pop().toLowerCase()) : '';
                        this.showUpdateNotification(latestVersion);
                        if (manual) this.terminalLog(`Nova versão disponível: ${latestVersion}`, 'success');
                        return;
                    } else {
                        if (manual) this.terminalLog('Você está na versão mais recente', 'success');
                        return;
                    }
                }
            } catch (err) {
                if (manual) this.terminalLog('Erro ao consultar GitHub Releases: ' + err.message, 'error');
                // fallthrough to raw version URL if provided
            }
        }

        // Fallback: check a raw version file
        if (!versionUrl) {
            if (manual) this.terminalLog('URL de versão ou repositório GitHub não configurado em Configurações', 'error');
            return;
        }

        if (manual) this.terminalLog('Verificando atualizações em ' + versionUrl, 'info');

        try {
            const res = await fetch(versionUrl, {cache: 'no-store'});
            if (!res.ok) throw new Error('Falha ao buscar versão: ' + res.status);
            const txt = (await res.text()).trim();
            const latestVersion = txt.split('\n')[0].trim();
            if (!latestVersion) throw new Error('Versão inválida recebida');
            const cmp = this.compareVersions(latestVersion, this.appVersion);
            if (cmp > 0) {
                // Save the discovered latest version for UI
                this._latestRemoteVersion = latestVersion;
                this._latestDownloadUrl = downloadUrl;
                this._latestAssetName = '';
                this.showUpdateNotification(latestVersion);
                if (manual) this.terminalLog(`Nova versão disponível: ${latestVersion}`, 'success');
            } else {
                if (manual) this.terminalLog('Você está na versão mais recente', 'success');
            }
        } catch (err) {
            if (manual) this.terminalLog('Erro ao verificar atualizações: ' + err.message, 'error');
        }
    }

    async getLatestReleaseFromGithub(repo) {
        // repo = 'owner/name'
        if (!repo || !repo.includes('/')) throw new Error('Repositório inválido');
        const url = `https://api.github.com/repos/${repo}/releases/latest`;
        const res = await fetch(url, {cache: 'no-store'});
        if (!res.ok) {
            if (res.status === 404) throw new Error('Repositório ou releases não encontrado');
            if (res.status === 403) throw new Error('API do GitHub recusou a requisição (rate limit ou CORS)');
            throw new Error('Falha na API do GitHub: ' + res.status);
        }
        const data = await res.json();
        return data;
    }

    async downloadReleaseAsset(url) {
        if (!url) throw new Error('URL de download inválida');
        // UI elements
        const notif = document.getElementById('updateNotification');
        const progressWrap = document.getElementById('updateProgress');
        const progressBar = document.getElementById('updateProgressBar');
        try {
            progressWrap.style.display = 'block';
            progressBar.style.width = '0%';
        } catch (e) {}

        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao baixar: ' + res.status);

        const contentLength = res.headers.get('content-length');
        if (!res.body || !window.ReadableStream || !contentLength) {
            // simple fallback: read as blob and open
            const blob = await res.blob();
            const bUrl = URL.createObjectURL(blob);
            window.open(bUrl, '_blank');
            this.terminalLog('Download concluído (fallback). Abra a aba de download para instalar.', 'success');
            try { progressBar.style.width = '100%'; } catch(e){}
            this.hideUpdateNotification();
            return;
        }

        // Stream and report progress
        const total = parseInt(contentLength, 10);
        let loaded = 0;
        const reader = res.body.getReader();
        const chunks = [];
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            loaded += value.length;
            const pct = Math.min(100, Math.round((loaded / total) * 100));
            try { progressBar.style.width = pct + '%'; } catch(e){}
        }

        // concatenate
        let blob;
        try {
            const merged = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
            let offset = 0;
            for (const c of chunks) {
                merged.set(c, offset);
                offset += c.length;
            }
            blob = new Blob([merged]);
        } catch (e) {
            // fallback to reading as blob
            blob = await res.blob();
        }

        const bUrl = URL.createObjectURL(blob);
        window.open(bUrl, '_blank');
        this.terminalLog('Download concluído. Abra a aba de download para instalar manualmente.', 'success');
        try { progressBar.style.width = '100%'; } catch(e){}
        this.hideUpdateNotification();
    }

    compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            if (part1 !== part2) {
                return part1 - part2;
            }
        }
        return 0;
    }

    showUpdateNotification(version) {
        const notification = document.getElementById('updateNotification');
        const message = document.getElementById('updateMessage');
        const assetNameEl = document.getElementById('updateAssetName');
        const installBtn = document.getElementById('installUpdate');

        message.textContent = `Nova versão ${version} disponível!`;
        if (assetNameEl) assetNameEl.textContent = this._latestAssetName ? `Asset: ${this._latestAssetName}` : '';
        if (installBtn) {
            if (this._latestAssetType === 'apk' || this._latestAssetType === 'aab') installBtn.textContent = 'Instalar APK';
            else if (this._latestAssetName) installBtn.textContent = 'Baixar';
            else installBtn.textContent = 'Instalar';
        }
        notification.classList.remove('hidden');
    }

    hideUpdateNotification() {
        document.getElementById('updateNotification').classList.add('hidden');
    }

    async installUpdate() {
        // Install update: only download if _latestRemoteVersion > current
        const latest = this._latestRemoteVersion;
        if (!latest) {
            this.terminalLog('Nenhuma versão detectada para instalar. Clique em Verificar Atualizações primeiro.', 'error');
            return;
        }

        // Determine download URL preference: stored download URL (settings) -> latest discovered -> empty
        const configured = localStorage.getItem('updateDownloadUrl') || '';
        const downloadUrl = configured || this._latestDownloadUrl || '';

        if (!downloadUrl) {
            this.terminalLog('URL de download não configurada. Configure em Configurações ou informe um repositório com assets.', 'error');
            return;
        }

        this.terminalLog(`Baixando versão ${latest} de ${downloadUrl}`, 'info');
        // Use streaming download with progress where possible
        try {
            await this.downloadReleaseAsset(downloadUrl);
        } catch (err) {
            this.terminalLog('Erro ao baixar update: ' + err.message, 'error');
        }
    }

    // Settings
    loadSettings() {
        const autoSave = localStorage.getItem('autoSave') === 'true';
        const lineNumbers = localStorage.getItem('lineNumbers') !== 'false';
        const theme = localStorage.getItem('theme') || 'monokai';
        const fontSize = localStorage.getItem('fontSize') || '14';
        const updateVersionUrl = localStorage.getItem('updateVersionUrl') || '';
        const updateDownloadUrl = localStorage.getItem('updateDownloadUrl') || '';

        document.getElementById('autoSave').checked = autoSave;
        document.getElementById('lineNumbers').checked = lineNumbers;
        document.getElementById('themeSelect').value = theme;
        document.getElementById('fontSize').value = fontSize;
        document.getElementById('fontSizeValue').textContent = fontSize + 'px';

    // preencher campos de atualização
    const updateVersionInput = document.getElementById('updateVersionUrl');
    const updateDownloadInput = document.getElementById('updateDownloadUrl');
    const updateRepoInput = document.getElementById('updateRepo');
    if (updateVersionInput) updateVersionInput.value = updateVersionUrl;
    if (updateDownloadInput) updateDownloadInput.value = updateDownloadUrl;
    if (updateRepoInput) updateRepoInput.value = localStorage.getItem('updateRepo') || this.defaultUpdateRepo || '';

        // Aplicar configurações
        this.applySettings();
    }

    applySettings() {
        const fontSize = localStorage.getItem('fontSize') || '14';
        const theme = localStorage.getItem('theme') || 'monokai';
        const lineNumbers = localStorage.getItem('lineNumbers') !== 'false';

        Object.values(this.editors).forEach(editor => {
            editor.setOption('lineNumbers', lineNumbers);
            editor.setOption('theme', theme);
            editor.getWrapperElement().style.fontSize = fontSize + 'px';
            editor.refresh();
        });
    }

    saveFileSystem() {
        localStorage.setItem('fileSystem', JSON.stringify(this.files));
    }

    loadFileSystem() {
        const saved = localStorage.getItem('fileSystem');
        if (saved) {
            try {
                this.files = JSON.parse(saved);
            } catch (e) {
                this.terminalLog('Erro ao carregar sistema de arquivos', 'error');
            }
        }
    }
}

// Inicializar quando o DOM estiver pronto (também funciona se o script for carregado dinamicamente)
function initEditorApp() {
    try {
        new OfflineCodeEditor();
    } catch (err) {
        console.error('Falha ao inicializar OfflineCodeEditor:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorApp);
} else {
    // DOM já carregado — inicializa imediatamente
    initEditorApp();
}

// Service Worker para funcionalidade offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha no ServiceWorker: ', error);
            });
    });
}