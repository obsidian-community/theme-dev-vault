'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const DEFAULT_SETTINGS = {
    styleLists: false,
    debug: false,
    stickCursor: true,
    betterEnter: true,
    selectAll: true,
    disableZoomNotification: false,
    hideWarning: false,
};
class SettingsService {
    constructor(storage) {
        this.storage = storage;
        this.handlers = new Map();
    }
    get styleLists() {
        return this.values.styleLists;
    }
    set styleLists(value) {
        this.set("styleLists", value);
    }
    get debug() {
        return this.values.debug;
    }
    set debug(value) {
        this.set("debug", value);
    }
    get stickCursor() {
        return this.values.stickCursor;
    }
    set stickCursor(value) {
        this.set("stickCursor", value);
    }
    get betterEnter() {
        return this.values.betterEnter;
    }
    set betterEnter(value) {
        this.set("betterEnter", value);
    }
    get selectAll() {
        return this.values.selectAll;
    }
    set selectAll(value) {
        this.set("selectAll", value);
    }
    get disableZoomNotification() {
        return this.values.disableZoomNotification;
    }
    set disableZoomNotification(value) {
        this.set("disableZoomNotification", value);
    }
    get hideWarning() {
        return this.values.hideWarning;
    }
    set hideWarning(value) {
        this.set("hideWarning", value);
    }
    onChange(key, cb) {
        if (!this.handlers.has(key)) {
            this.handlers.set(key, new Set());
        }
        this.handlers.get(key).add(cb);
    }
    removeCallback(key, cb) {
        const handlers = this.handlers.get(key);
        if (handlers) {
            handlers.delete(cb);
        }
    }
    reset() {
        for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
            this.set(k, v);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.values = Object.assign({}, DEFAULT_SETTINGS, yield this.storage.loadData());
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.saveData(this.values);
        });
    }
    set(key, value) {
        this.values[key] = value;
        const callbacks = this.handlers.get(key);
        if (!callbacks) {
            return;
        }
        for (const cb of callbacks.values()) {
            cb(value);
        }
    }
}
class ObsidianOutlinerPluginSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin, settings) {
        super(app, plugin);
        this.settings = settings;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName("Improve the style of your lists")
            .setDesc("Styles are only compatible with built-in Obsidian themes and may not be compatible with other themes. Styles only work well with tab size 4.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.styleLists).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.styleLists = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Stick the cursor to the content")
            .setDesc("Don't let the cursor move to the bullet position.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.stickCursor).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.stickCursor = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Enter key")
            .setDesc("Make the Enter key behave the same as other outliners.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.betterEnter).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.betterEnter = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Enhance the Ctrl+A or Cmd+A behavior")
            .setDesc("Press the hotkey once to select the current list item. Press the hotkey twice to select the entire list.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.selectAll).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.selectAll = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Disable notification about Obsidian Zoom plugin")
            .addToggle((toggle) => {
            toggle
                .setValue(this.settings.disableZoomNotification)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.disableZoomNotification = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Hide the warning about four-space tabs")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.hideWarning).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.hideWarning = value;
                yield this.settings.save();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName("Debug mode")
            .setDesc("Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs.")
            .addToggle((toggle) => {
            toggle.setValue(this.settings.debug).onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.settings.debug = value;
                yield this.settings.save();
            }));
        });
    }
}

class ObsidianService {
    constructor(app) {
        this.app = app;
    }
    getObsidianTabsSettigns() {
        return Object.assign({ useTab: true, tabSize: 4 }, this.app.vault.config);
    }
    getObsidianFoldSettigns() {
        return Object.assign({ foldIndent: false }, this.app.vault.config);
    }
    getActiveLeafDisplayText() {
        return this.app.workspace.activeLeaf.getDisplayText();
    }
    createCommandCallback(cb) {
        return () => {
            const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!view) {
                return;
            }
            const editor = view.sourceMode.cmEditor;
            const shouldStopPropagation = cb(editor);
            if (!shouldStopPropagation &&
                window.event &&
                window.event.type === "keydown") {
                editor.triggerOnKeyDown(window.event);
            }
        };
    }
}

function cmpPos(a, b) {
    return a.line - b.line || a.ch - b.ch;
}
function maxPos(a, b) {
    return cmpPos(a, b) < 0 ? b : a;
}
function minPos(a, b) {
    return cmpPos(a, b) < 0 ? a : b;
}
class List {
    constructor(root, indent, bullet, firstLine, folded) {
        this.root = root;
        this.indent = indent;
        this.bullet = bullet;
        this.folded = folded;
        this.parent = null;
        this.children = [];
        this.notesIndent = null;
        this.lines = [];
        this.lines.push(firstLine);
    }
    getNotesIndent() {
        return this.notesIndent;
    }
    setNotesIndent(notesIndent) {
        if (this.notesIndent !== null) {
            throw new Error(`Notes indent already provided`);
        }
        this.notesIndent = notesIndent;
    }
    addLine(text) {
        if (this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines.push(text);
    }
    replaceLines(lines) {
        if (lines.length > 1 && this.notesIndent === null) {
            throw new Error(`Unable to add line, notes indent should be provided first`);
        }
        this.lines = lines;
    }
    getLineCount() {
        return this.lines.length;
    }
    getRoot() {
        return this.root;
    }
    getChildren() {
        return this.children.concat();
    }
    getLinesInfo() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return this.lines.map((row, i) => {
            const line = startLine + i;
            const startCh = i === 0 ? this.getContentStartCh() : this.notesIndent.length;
            const endCh = startCh + row.length;
            return {
                text: row,
                from: { line, ch: startCh },
                to: { line, ch: endCh },
            };
        });
    }
    getLines() {
        return this.lines.concat();
    }
    getFirstLineContentStart() {
        const startLine = this.root.getContentLinesRangeOf(this)[0];
        return {
            line: startLine,
            ch: this.getContentStartCh(),
        };
    }
    getLastLineContentEnd() {
        const endLine = this.root.getContentLinesRangeOf(this)[1];
        const endCh = this.lines.length === 1
            ? this.getContentStartCh() + this.lines[0].length
            : this.notesIndent.length + this.lines[this.lines.length - 1].length;
        return {
            line: endLine,
            ch: endCh,
        };
    }
    getContentStartCh() {
        return this.indent.length + this.bullet.length + 1;
    }
    isFolded() {
        if (this.folded) {
            return true;
        }
        if (this.parent) {
            return this.parent.isFolded();
        }
        return false;
    }
    isFoldRoot() {
        let parent = this.getParent();
        while (parent) {
            if (parent.folded) {
                return false;
            }
            parent = parent.getParent();
        }
        return this.folded;
    }
    getLevel() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.getLevel() + 1;
    }
    unindentContent(from, till) {
        this.indent = this.indent.slice(0, from) + this.indent.slice(till);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, from) + this.notesIndent.slice(till);
        }
        for (const child of this.children) {
            child.unindentContent(from, till);
        }
    }
    indentContent(indentPos, indentChars) {
        this.indent =
            this.indent.slice(0, indentPos) +
                indentChars +
                this.indent.slice(indentPos);
        if (this.notesIndent !== null) {
            this.notesIndent =
                this.notesIndent.slice(0, indentPos) +
                    indentChars +
                    this.notesIndent.slice(indentPos);
        }
        for (const child of this.children) {
            child.indentContent(indentPos, indentChars);
        }
    }
    getFirstLineIndent() {
        return this.indent;
    }
    getBullet() {
        return this.bullet;
    }
    replateBullet(bullet) {
        this.bullet = bullet;
    }
    getParent() {
        return this.parent;
    }
    addBeforeAll(list) {
        this.children.unshift(list);
        list.parent = this;
    }
    addAfterAll(list) {
        this.children.push(list);
        list.parent = this;
    }
    removeChild(list) {
        const i = this.children.indexOf(list);
        this.children.splice(i, 1);
        list.parent = null;
    }
    addBefore(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i, 0, list);
        list.parent = this;
    }
    addAfter(before, list) {
        const i = this.children.indexOf(before);
        this.children.splice(i + 1, 0, list);
        list.parent = this;
    }
    getPrevSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i > 0 ? this.children[i - 1] : null;
    }
    getNextSiblingOf(list) {
        const i = this.children.indexOf(list);
        return i >= 0 && i < this.children.length ? this.children[i + 1] : null;
    }
    isEmpty() {
        return this.children.length === 0;
    }
    print() {
        let res = "";
        for (let i = 0; i < this.lines.length; i++) {
            res += i === 0 ? this.indent + this.bullet + " " : this.notesIndent;
            res += this.lines[i];
            res += "\n";
        }
        for (const child of this.children) {
            res += child.print();
        }
        return res;
    }
}
class Root {
    constructor(start, end, selections) {
        this.start = start;
        this.end = end;
        this.rootList = new List(this, "", "", "", false);
        this.selections = [];
        this.replaceSelections(selections);
    }
    getRootList() {
        return this.rootList;
    }
    getRange() {
        return [Object.assign({}, this.start), Object.assign({}, this.end)];
    }
    getSelections() {
        return this.selections.map((s) => ({
            anchor: Object.assign({}, s.anchor),
            head: Object.assign({}, s.head),
        }));
    }
    hasSingleCursor() {
        if (!this.hasSingleSelection()) {
            return false;
        }
        const selection = this.selections[0];
        return (selection.anchor.line === selection.head.line &&
            selection.anchor.ch === selection.head.ch);
    }
    hasSingleSelection() {
        return this.selections.length === 1;
    }
    getCursor() {
        return Object.assign({}, this.selections[this.selections.length - 1].head);
    }
    replaceCursor(cursor) {
        this.selections = [{ anchor: cursor, head: cursor }];
    }
    replaceSelections(selections) {
        if (selections.length < 1) {
            throw new Error(`Unable to create Root without selections`);
        }
        this.selections = selections;
    }
    getListUnderCursor() {
        return this.getListUnderLine(this.getCursor().line);
    }
    getListUnderLine(line) {
        if (line < this.start.line || line > this.end.line) {
            return;
        }
        let result = null;
        let index = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = index;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (line >= listFromLine && line <= listTillLine) {
                    result = l;
                }
                else {
                    index = listTillLine + 1;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    getContentLinesRangeOf(list) {
        let result = null;
        let line = this.start.line;
        const visitArr = (ll) => {
            for (const l of ll) {
                const listFromLine = line;
                const listTillLine = listFromLine + l.getLineCount() - 1;
                if (l === list) {
                    result = [listFromLine, listTillLine];
                }
                else {
                    line = listTillLine + 1;
                    visitArr(l.getChildren());
                }
                if (result !== null) {
                    return;
                }
            }
        };
        visitArr(this.rootList.getChildren());
        return result;
    }
    getChildren() {
        return this.rootList.getChildren();
    }
    print() {
        let res = "";
        for (const child of this.rootList.getChildren()) {
            res += child.print();
        }
        return res.replace(/\n$/, "");
    }
}

const bulletSign = `(?:[-*+]|\\d+\\.)`;
const listItemWithoutSpacesRe = new RegExp(`^${bulletSign} `);
const listItemRe = new RegExp(`^[ \t]*${bulletSign} `);
const stringWithSpacesRe = new RegExp(`^[ \t]+`);
const parseListItemRe = new RegExp(`^([ \t]*)(${bulletSign}) (.*)$`);
class ListsService {
    constructor(loggerService, obsidianService) {
        this.loggerService = loggerService;
        this.obsidianService = obsidianService;
    }
    evalOperation(root, op, editor) {
        op.perform();
        if (op.shouldUpdate()) {
            this.applyChanges(editor, root);
        }
        return {
            shouldUpdate: op.shouldUpdate(),
            shouldStopPropagation: op.shouldStopPropagation(),
        };
    }
    performOperation(cb, editor, cursor = editor.getCursor()) {
        const root = this.parseList(editor, cursor);
        if (!root) {
            return { shouldUpdate: false, shouldStopPropagation: false };
        }
        const op = cb(root);
        return this.evalOperation(root, op, editor);
    }
    parseList(editor, cursor = editor.getCursor()) {
        const d = this.loggerService.bind("parseList");
        const error = (msg) => {
            d(msg);
            return null;
        };
        const line = editor.getLine(cursor.line);
        let listLookingPos = null;
        if (this.isListItem(line)) {
            listLookingPos = cursor.line;
        }
        else if (this.isLineWithIndent(line)) {
            let listLookingPosSearch = cursor.line - 1;
            while (listLookingPosSearch >= editor.firstLine()) {
                const line = editor.getLine(listLookingPosSearch);
                if (this.isListItem(line)) {
                    listLookingPos = listLookingPosSearch;
                    break;
                }
                else if (this.isLineWithIndent(line)) {
                    listLookingPosSearch--;
                }
                else {
                    break;
                }
            }
        }
        if (listLookingPos == null) {
            return null;
        }
        let listStartLine = null;
        let listStartLineLookup = listLookingPos;
        while (listStartLineLookup >= editor.firstLine()) {
            const line = editor.getLine(listStartLineLookup);
            if (!this.isListItem(line) && !this.isLineWithIndent(line)) {
                break;
            }
            if (this.isListItemWithoutSpaces(line)) {
                listStartLine = listStartLineLookup;
            }
            listStartLineLookup--;
        }
        if (listStartLine === null) {
            return null;
        }
        let listEndLine = listLookingPos;
        let listEndLineLookup = listLookingPos;
        while (listEndLineLookup <= editor.lastLine()) {
            const line = editor.getLine(listEndLineLookup);
            if (!this.isListItem(line) && !this.isLineWithIndent(line)) {
                break;
            }
            if (!this.isEmptyLine(line)) {
                listEndLine = listEndLineLookup;
            }
            listEndLineLookup++;
        }
        if (listStartLine > cursor.line || listEndLine < cursor.line) {
            return null;
        }
        const root = new Root({ line: listStartLine, ch: 0 }, { line: listEndLine, ch: editor.getLine(listEndLine).length }, editor.listSelections().map((r) => ({
            anchor: { line: r.anchor.line, ch: r.anchor.ch },
            head: { line: r.head.line, ch: r.head.ch },
        })));
        let currentParent = root.getRootList();
        let currentList = null;
        let currentIndent = "";
        for (let l = listStartLine; l <= listEndLine; l++) {
            const line = editor.getLine(l);
            const matches = parseListItemRe.exec(line);
            if (matches) {
                const [_, indent, bullet, content] = matches;
                const compareLength = Math.min(currentIndent.length, indent.length);
                const indentSlice = indent.slice(0, compareLength);
                const currentIndentSlice = currentIndent.slice(0, compareLength);
                if (indentSlice !== currentIndentSlice) {
                    const expected = currentIndentSlice
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    const got = indentSlice.replace(/ /g, "S").replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (indent.length > currentIndent.length) {
                    currentParent = currentList;
                    currentIndent = indent;
                }
                else if (indent.length < currentIndent.length) {
                    while (currentParent.getFirstLineIndent().length >= indent.length &&
                        currentParent.getParent()) {
                        currentParent = currentParent.getParent();
                    }
                    currentIndent = indent;
                }
                const folded = !!editor.isFolded({
                    line: Math.min(l + 1, listEndLine),
                    ch: 0,
                });
                currentList = new List(root, indent, bullet, content, folded);
                currentParent.addAfterAll(currentList);
            }
            else if (this.isLineWithIndent(line)) {
                if (!currentList) {
                    return error(`Unable to parse list: expected list item, got empty line`);
                }
                const indentToCheck = currentList.getNotesIndent() || currentIndent;
                if (line.indexOf(indentToCheck) !== 0) {
                    const expected = indentToCheck.replace(/ /g, "S").replace(/\t/g, "T");
                    const got = line
                        .match(/^[ \t]*/)[0]
                        .replace(/ /g, "S")
                        .replace(/\t/g, "T");
                    return error(`Unable to parse list: expected indent "${expected}", got "${got}"`);
                }
                if (!currentList.getNotesIndent()) {
                    const matches = line.match(/^[ \t]+/);
                    if (!matches || matches[0].length <= currentIndent.length) {
                        return error(`Unable to parse list: expected some indent, got no indent`);
                    }
                    currentList.setNotesIndent(matches[0]);
                }
                currentList.addLine(line.slice(currentList.getNotesIndent().length));
            }
            else {
                return error(`Unable to parse list: expected list item or note, got "${line}"`);
            }
        }
        return root;
    }
    applyChanges(editor, root) {
        const rootRange = root.getRange();
        const oldString = editor.getRange(rootRange[0], rootRange[1]);
        const newString = root.print();
        const fromLine = rootRange[0].line;
        const toLine = rootRange[1].line;
        for (let l = fromLine; l <= toLine; l++) {
            editor.foldCode(l, null, "unfold");
        }
        let changeFrom = Object.assign({}, rootRange[0]);
        let changeTo = Object.assign({}, rootRange[1]);
        let oldTmp = oldString;
        let newTmp = newString;
        while (true) {
            const nlIndex = oldTmp.indexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(0, nlIndex + 1);
            const newLine = newTmp.slice(0, oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            changeFrom.line++;
            oldTmp = oldTmp.slice(oldLine.length);
            newTmp = newTmp.slice(oldLine.length);
        }
        while (true) {
            const nlIndex = oldTmp.lastIndexOf("\n");
            if (nlIndex < 0) {
                break;
            }
            const oldLine = oldTmp.slice(nlIndex);
            const newLine = newTmp.slice(-oldLine.length);
            if (oldLine !== newLine) {
                break;
            }
            oldTmp = oldTmp.slice(0, -oldLine.length);
            newTmp = newTmp.slice(0, -oldLine.length);
            const nlIndex2 = oldTmp.lastIndexOf("\n");
            changeTo.ch =
                nlIndex2 >= 0 ? oldTmp.length - nlIndex2 - 1 : oldTmp.length;
            changeTo.line--;
        }
        if (oldTmp !== newTmp) {
            editor.replaceRange(newTmp, changeFrom, changeTo);
        }
        editor.setSelections(root.getSelections());
        // TODO: lines could be different because of deletetion
        for (let l = fromLine; l <= toLine; l++) {
            const line = root.getListUnderLine(l);
            if (line && line.isFoldRoot()) {
                editor.foldCode(l);
            }
        }
    }
    getDefaultIndentChars() {
        const { useTab, tabSize } = this.obsidianService.getObsidianTabsSettigns();
        return useTab ? "\t" : new Array(tabSize).fill(" ").join("");
    }
    isEmptyLine(line) {
        return line.length === 0;
    }
    isLineWithIndent(line) {
        return stringWithSpacesRe.test(line);
    }
    isListItem(line) {
        return listItemRe.test(line);
    }
    isListItemWithoutSpaces(line) {
        return listItemWithoutSpacesRe.test(line);
    }
}

class LoggerService {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    log(method, ...args) {
        if (!this.settingsService.debug) {
            return;
        }
        console.info(method, ...args);
    }
    bind(method) {
        return (...args) => this.log(method, ...args);
    }
}

const STATUS_BAR_TEXT = `Outliner styles only work with four-space tabs. Please check Obsidian settings.`;
class ListsStylesFeature {
    constructor(plugin, settingsService, obsidianService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.obsidianService = obsidianService;
        this.onStyleListsSettingChange = (styleLists) => {
            if (styleLists) {
                this.addListsStyles();
            }
            else {
                this.removeListsStyles();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settingsService.styleLists) {
                this.addListsStyles();
            }
            this.settingsService.onChange("styleLists", this.onStyleListsSettingChange);
            this.addStatusBarText();
            this.startStatusBarInterval();
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.interval);
            if (this.statusBarText.parentElement) {
                this.statusBarText.parentElement.removeChild(this.statusBarText);
            }
            this.settingsService.removeCallback("styleLists", this.onStyleListsSettingChange);
            this.removeListsStyles();
        });
    }
    startStatusBarInterval() {
        let visible = false;
        this.interval = window.setInterval(() => {
            const { tabSize } = this.obsidianService.getObsidianTabsSettigns();
            const shouldBeVisible = this.settingsService.styleLists &&
                !(tabSize === 4) &&
                !this.settingsService.hideWarning;
            if (shouldBeVisible && !visible) {
                this.statusBarText.style.display = "block";
                visible = true;
            }
            else if (!shouldBeVisible && visible) {
                this.statusBarText.style.display = "none";
                visible = false;
            }
        }, 1000);
    }
    addStatusBarText() {
        this.statusBarText = this.plugin.addStatusBarItem();
        this.statusBarText.style.color = "red";
        this.statusBarText.style.display = "none";
        this.statusBarText.setText(STATUS_BAR_TEXT);
    }
    addListsStyles() {
        document.body.classList.add("outliner-plugin-bls");
    }
    removeListsStyles() {
        document.body.classList.remove("outliner-plugin-bls");
    }
}

function recalculateNumericBullets(root) {
    function visit(parent) {
        let index = 1;
        for (const child of parent.getChildren()) {
            if (/\d+\./.test(child.getBullet())) {
                child.replateBullet(`${index++}.`);
            }
            visit(child);
        }
    }
    visit(root);
}

class MoveLeftOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        if (!grandParent) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentRmFrom = parent.getFirstLineIndent().length;
        const indentRmTill = list.getFirstLineIndent().length;
        parent.removeChild(list);
        grandParent.addAfter(parent, list);
        list.unindentContent(indentRmFrom, indentRmTill);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const chDiff = indentRmTill - indentRmFrom;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch - chDiff,
        });
        recalculateNumericBullets(root);
    }
}

function isEmptyLineOrEmptyCheckbox(line) {
    return line === "" || line === "[ ] ";
}

class OutdentIfLineIsEmptyOperation {
    constructor(root) {
        this.root = root;
        this.moveLeftOp = new MoveLeftOperation(root);
    }
    shouldStopPropagation() {
        return this.moveLeftOp.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.moveLeftOp.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLines();
        if (lines.length > 1 ||
            !isEmptyLineOrEmptyCheckbox(lines[0]) ||
            list.getLevel() === 1) {
            return;
        }
        this.moveLeftOp.perform();
    }
}

function isEnter$1(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterOutdentIfLineIsEmptyFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter ||
                !isEnter$1(e) ||
                this.imeService.isIMEOpened()) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new OutdentIfLineIsEmptyOperation(root), cm);
            if (shouldStopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class CreateNewItemOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        if (lines.length === 1 && isEmptyLineOrEmptyCheckbox(lines[0].text)) {
            return;
        }
        const cursor = root.getCursor();
        const lineUnderCursor = lines.find((l) => l.from.line === cursor.line);
        if (cursor.ch < lineUnderCursor.from.ch) {
            return;
        }
        const { oldLines, newLines } = lines.reduce((acc, line) => {
            if (cursor.line > line.from.line) {
                acc.oldLines.push(line.text);
            }
            else if (cursor.line === line.from.line) {
                const a = line.text.slice(0, cursor.ch - line.from.ch);
                const b = line.text.slice(cursor.ch - line.from.ch);
                acc.oldLines.push(a);
                acc.newLines.push(b);
            }
            else if (cursor.line < line.from.line) {
                acc.newLines.push(line.text);
            }
            return acc;
        }, {
            oldLines: [],
            newLines: [],
        });
        const codeBlockBacticks = oldLines.join("\n").split("```").length - 1;
        const isInsideCodeblock = codeBlockBacticks > 0 && codeBlockBacticks % 2 !== 0;
        if (isInsideCodeblock) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const endPos = list.getLastLineContentEnd();
        const onChildLevel = !list.isEmpty() && cursor.line === endPos.line && cursor.ch === endPos.ch;
        const indent = onChildLevel
            ? list.getChildren()[0].getFirstLineIndent()
            : list.getFirstLineIndent();
        const bullet = onChildLevel
            ? list.getChildren()[0].getBullet()
            : list.getBullet();
        const prefix = oldLines[0].match(/^\[[ x]\]/) ? "[ ] " : "";
        const newList = new List(list.getRoot(), indent, bullet, prefix + newLines.shift(), false);
        if (newLines.length > 0) {
            newList.setNotesIndent(list.getNotesIndent());
            for (const line of newLines) {
                newList.addLine(line);
            }
        }
        if (onChildLevel) {
            list.addBeforeAll(newList);
        }
        else {
            const children = list.getChildren();
            for (const child of children) {
                list.removeChild(child);
                newList.addAfterAll(child);
            }
            list.getParent().addAfter(list, newList);
        }
        list.replaceLines(oldLines);
        const newListStart = newList.getFirstLineContentStart();
        root.replaceCursor({
            line: newListStart.line,
            ch: newListStart.ch + prefix.length,
        });
        recalculateNumericBullets(root);
    }
}

function isEnter(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class EnterShouldCreateNewItemFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter ||
                !isEnter(e) ||
                this.imeService.isIMEOpened()) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new CreateNewItemOperation(root), cm);
            if (shouldStopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class MoveCursorToPreviousUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = this.root.getListUnderCursor();
        const cursor = this.root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.moveCursorToPreviousUnfoldedItem(root, cursor);
        }
        else if (lineNo > 0) {
            this.moveCursorToPreviousNoteLine(root, lines, lineNo);
        }
    }
    moveCursorToPreviousNoteLine(root, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        root.replaceCursor(lines[lineNo - 1].to);
    }
    moveCursorToPreviousUnfoldedItem(root, cursor) {
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (prev.isFolded()) {
            let foldRoot = prev;
            while (!foldRoot.isFoldRoot()) {
                foldRoot = foldRoot.getParent();
            }
            const firstLineEnd = foldRoot.getLinesInfo()[0].to;
            root.replaceCursor(firstLineEnd);
        }
        else {
            root.replaceCursor(prev.getLastLineContentEnd());
        }
    }
}

function isArrowLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlArrowLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
class MoveCursorToPreviousUnfoldedLineFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor || this.imeService.isIMEOpened()) {
                return;
            }
            if (isArrowLeft(event) || (!obsidian.Platform.isMacOS && isCtrlArrowLeft(event))) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveCursorToPreviousUnfoldedLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class EnsureCursorInListContentOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const linePrefix = contentStart.line === cursor.line
            ? contentStart.ch
            : list.getNotesIndent().length;
        if (cursor.ch < linePrefix) {
            this.updated = true;
            root.replaceCursor({
                line: cursor.line,
                ch: linePrefix,
            });
        }
    }
}

class EnsureCursorIsInUnfoldedLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        if (!list.isFolded()) {
            return;
        }
        let foldRoot = list;
        while (!foldRoot.isFoldRoot()) {
            foldRoot = foldRoot.getParent();
        }
        const firstLineEnd = foldRoot.getLinesInfo()[0].to;
        if (cursor.line > firstLineEnd.line) {
            this.updated = true;
            root.replaceCursor(firstLineEnd);
        }
    }
}

class EnsureCursorInListContentFeature {
    constructor(plugin, settingsService, listsService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.handleCursorActivity = (cm) => {
            if (!this.settingsService.stickCursor) {
                return;
            }
            this.listsService.performOperation((root) => new EnsureCursorIsInUnfoldedLineOperation(root), cm);
            this.listsService.performOperation((root) => new EnsureCursorInListContentOperation(root), cm);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("cursorActivity", this.handleCursorActivity);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("cursorActivity", this.handleCursorActivity);
            });
        });
    }
}

class DeleteAndMergeWithPreviousLineOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.from.ch && cursor.line === l.from.line);
        if (lineNo === 0) {
            this.mergeWithPreviousItem(root, cursor, list);
        }
        else if (lineNo > 0) {
            this.mergeNotes(root, cursor, list, lines, lineNo);
        }
    }
    mergeNotes(root, cursor, list, lines, lineNo) {
        this.stopPropagation = true;
        this.updated = true;
        const prevLineNo = lineNo - 1;
        root.replaceCursor({
            line: cursor.line - 1,
            ch: lines[prevLineNo].text.length + lines[prevLineNo].from.ch,
        });
        lines[prevLineNo].text += lines[lineNo].text;
        lines.splice(lineNo, 1);
        list.replaceLines(lines.map((l) => l.text));
    }
    mergeWithPreviousItem(root, cursor, list) {
        if (root.getChildren()[0] === list && list.getChildren().length === 0) {
            return;
        }
        this.stopPropagation = true;
        const prev = root.getListUnderLine(cursor.line - 1);
        if (!prev) {
            return;
        }
        const bothAreEmpty = prev.isEmpty() && list.isEmpty();
        const prevIsEmptyAndSameLevel = prev.isEmpty() && !list.isEmpty() && prev.getLevel() == list.getLevel();
        const listIsEmptyAndPrevIsParent = list.isEmpty() && prev.getLevel() == list.getLevel() - 1;
        if (bothAreEmpty || prevIsEmptyAndSameLevel || listIsEmptyAndPrevIsParent) {
            this.updated = true;
            const parent = list.getParent();
            const prevEnd = prev.getLastLineContentEnd();
            if (!prev.getNotesIndent() && list.getNotesIndent()) {
                prev.setNotesIndent(prev.getFirstLineIndent() +
                    list.getNotesIndent().slice(list.getFirstLineIndent().length));
            }
            const oldLines = prev.getLines();
            const newLines = list.getLines();
            oldLines[oldLines.length - 1] += newLines[0];
            const resultLines = oldLines.concat(newLines.slice(1));
            prev.replaceLines(resultLines);
            parent.removeChild(list);
            for (const c of list.getChildren()) {
                list.removeChild(c);
                prev.addAfterAll(c);
            }
            root.replaceCursor(prevEnd);
            recalculateNumericBullets(root);
        }
    }
}

class DeleteAndMergeWithNextLineOperation {
    constructor(root) {
        this.root = root;
        this.deleteAndMergeWithPrevious =
            new DeleteAndMergeWithPreviousLineOperation(root);
    }
    shouldStopPropagation() {
        return this.deleteAndMergeWithPrevious.shouldStopPropagation();
    }
    shouldUpdate() {
        return this.deleteAndMergeWithPrevious.shouldUpdate();
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const list = root.getListUnderCursor();
        const cursor = root.getCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => cursor.ch === l.to.ch && cursor.line === l.to.line);
        if (lineNo === lines.length - 1) {
            const nextLine = lines[lineNo].to.line + 1;
            const nextList = root.getListUnderLine(nextLine);
            root.replaceCursor(nextList.getFirstLineContentStart());
            this.deleteAndMergeWithPrevious.perform();
        }
        else if (lineNo >= 0) {
            root.replaceCursor(lines[lineNo + 1].from);
            this.deleteAndMergeWithPrevious.perform();
        }
    }
}

class DeleteTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        lines[lineNo].text = lines[lineNo].text.slice(cursor.ch - lines[lineNo].from.ch);
        list.replaceLines(lines.map((l) => l.text));
        root.replaceCursor(lines[lineNo].from);
    }
}

function isBackspace(e) {
    return ((e.keyCode === 8 || e.code === "Backspace") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCmdBackspace(e) {
    return ((e.keyCode === 8 || e.code === "Backspace") &&
        e.shiftKey === false &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isDelete(e) {
    return ((e.keyCode === 46 || e.code === "Delete") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class DeleteShouldIgnoreBulletsFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor || this.imeService.isIMEOpened()) {
                return;
            }
            if (isBackspace(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteAndMergeWithPreviousLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            if (obsidian.Platform.isMacOS && isCmdBackspace(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteTillLineStartOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
            if (isDelete(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new DeleteAndMergeWithNextLineOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class SelectTillLineStartOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lines = list.getLinesInfo();
        const lineNo = lines.findIndex((l) => l.from.line === cursor.line);
        root.replaceSelections([{ head: lines[lineNo].from, anchor: cursor }]);
    }
}

function isCmdShiftLeft(e) {
    return ((e.keyCode === 37 || e.code === "ArrowLeft") &&
        e.shiftKey === true &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class SelectionShouldIgnoreBulletsFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.stickCursor || this.imeService.isIMEOpened()) {
                return;
            }
            if (obsidian.Platform.isMacOS && isCmdShiftLeft(event)) {
                const { shouldStopPropagation } = this.listsService.performOperation((root) => new SelectTillLineStartOperation(root), cm);
                if (shouldStopPropagation) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

function isCmdDotOrCmdShiftDot(e) {
    return ((e.keyCode === 190 || e.code === "Period") &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlDotOrCtrlShiftDot(e) {
    return ((e.keyCode === 190 || e.code === "Period") &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
function isModDotOrModShiftDot(e) {
    return obsidian.Platform.isMacOS
        ? isCmdDotOrCmdShiftDot(e)
        : isCtrlDotOrCtrlShiftDot(e);
}
class ZoomFeature {
    constructor(plugin, settingsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, e) => {
            if (window.ObsidianZoomPlugin ||
                this.settingsService.disableZoomNotification ||
                !isModDotOrModShiftDot(e) ||
                this.imeService.isIMEOpened()) {
                return;
            }
            new obsidian.Notice(`Zooming support has been removed from the Obsidian Outliner plugin. Please install the Obsidian Zoom plugin.`, 5000);
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class FoldFeature {
    constructor(plugin, obsidianService) {
        this.plugin = plugin;
        this.obsidianService = obsidianService;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "fold",
                name: "Fold the list",
                callback: this.obsidianService.createCommandCallback(this.fold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "unfold",
                name: "Unfold the list",
                callback: this.obsidianService.createCommandCallback(this.unfold.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod"],
                        key: "ArrowDown",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    setFold(editor, type) {
        if (!this.obsidianService.getObsidianFoldSettigns().foldIndent) {
            new obsidian.Notice(`Unable to ${type} because folding is disabled. Please enable "Fold indent" in Obsidian settings.`, 5000);
            return true;
        }
        editor.foldCode(editor.getCursor(), null, type);
        return true;
    }
    fold(editor) {
        return this.setFold(editor, "fold");
    }
    unfold(editor) {
        return this.setFold(editor, "unfold");
    }
}

class SelectAllOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleSelection()) {
            return;
        }
        const selection = root.getSelections()[0];
        const [rootStart, rootEnd] = root.getRange();
        const selectionFrom = minPos(selection.anchor, selection.head);
        const selectionTo = maxPos(selection.anchor, selection.head);
        if (selectionFrom.line < rootStart.line ||
            selectionTo.line > rootEnd.line) {
            return false;
        }
        if (selectionFrom.line === rootStart.line &&
            selectionFrom.ch === rootStart.ch &&
            selectionTo.line === rootEnd.line &&
            selectionTo.ch === rootEnd.ch) {
            return false;
        }
        const list = root.getListUnderCursor();
        const contentStart = list.getFirstLineContentStart();
        const contentEnd = list.getLastLineContentEnd();
        if (selectionFrom.line < contentStart.line ||
            selectionTo.line > contentEnd.line) {
            return false;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (selectionFrom.line === contentStart.line &&
            selectionFrom.ch === contentStart.ch &&
            selectionTo.line === contentEnd.line &&
            selectionTo.ch === contentEnd.ch) {
            // select all list
            root.replaceSelections([{ anchor: rootStart, head: rootEnd }]);
        }
        else {
            // select all line
            root.replaceSelections([{ anchor: contentStart, head: contentEnd }]);
        }
        return true;
    }
}

function isCmdA(e) {
    return ((e.keyCode === 65 || e.code === "KeyA") &&
        e.shiftKey === false &&
        e.metaKey === true &&
        e.altKey === false &&
        e.ctrlKey === false);
}
function isCtrlA(e) {
    return ((e.keyCode === 65 || e.code === "KeyA") &&
        e.shiftKey === false &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === true);
}
function isSelectAll(e) {
    return obsidian.Platform.isMacOS ? isCmdA(e) : isCtrlA(e);
}
class SelectAllFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, event) => {
            if (!this.settingsService.selectAll ||
                !isSelectAll(event) ||
                this.imeService.isIMEOpened()) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new SelectAllOperation(root), cm);
            if (shouldStopPropagation) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class MoveRightOperation {
    constructor(root, defaultIndentChars) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const prev = parent.getPrevSiblingOf(list);
        if (!prev) {
            return;
        }
        this.updated = true;
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        const indentPos = list.getFirstLineIndent().length;
        let indentChars = "";
        if (indentChars === "" && !prev.isEmpty()) {
            indentChars = prev
                .getChildren()[0]
                .getFirstLineIndent()
                .slice(prev.getFirstLineIndent().length);
        }
        if (indentChars === "") {
            indentChars = list
                .getFirstLineIndent()
                .slice(parent.getFirstLineIndent().length);
        }
        if (indentChars === "" && !list.isEmpty()) {
            indentChars = list.getChildren()[0].getFirstLineIndent();
        }
        if (indentChars === "") {
            indentChars = this.defaultIndentChars;
        }
        parent.removeChild(list);
        prev.addAfterAll(list);
        list.indentContent(indentPos, indentChars);
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch + indentChars.length,
        });
        recalculateNumericBullets(root);
    }
}

class MoveDownOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const next = parent.getNextSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!next && grandParent) {
            const newParent = grandParent.getNextSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addBeforeAll(list);
            }
        }
        else if (next) {
            this.updated = true;
            parent.removeChild(list);
            parent.addAfter(next, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
        recalculateNumericBullets(root);
    }
}

class MoveUpOperation {
    constructor(root) {
        this.root = root;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        this.stopPropagation = true;
        const list = root.getListUnderCursor();
        const parent = list.getParent();
        const grandParent = parent.getParent();
        const prev = parent.getPrevSiblingOf(list);
        const listStartLineBefore = root.getContentLinesRangeOf(list)[0];
        if (!prev && grandParent) {
            const newParent = grandParent.getPrevSiblingOf(parent);
            if (newParent) {
                this.updated = true;
                parent.removeChild(list);
                newParent.addAfterAll(list);
            }
        }
        else if (prev) {
            this.updated = true;
            parent.removeChild(list);
            parent.addBefore(prev, list);
        }
        if (!this.updated) {
            return;
        }
        const listStartLineAfter = root.getContentLinesRangeOf(list)[0];
        const lineDiff = listStartLineAfter - listStartLineBefore;
        const cursor = root.getCursor();
        root.replaceCursor({
            line: cursor.line + lineDiff,
            ch: cursor.ch,
        });
        recalculateNumericBullets(root);
    }
}

class MoveItemsFeature {
    constructor(plugin, obsidianService, listsService, imeService) {
        this.plugin = plugin;
        this.obsidianService = obsidianService;
        this.listsService = listsService;
        this.imeService = imeService;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.addCommand({
                id: "move-list-item-up",
                name: "Move list and sublists up",
                callback: this.obsidianService.createCommandCallback(this.moveListElementUp.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowUp",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "move-list-item-down",
                name: "Move list and sublists down",
                callback: this.obsidianService.createCommandCallback(this.moveListElementDown.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Mod", "Shift"],
                        key: "ArrowDown",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "indent-list",
                name: "Indent the list and sublists",
                callback: this.obsidianService.createCommandCallback(this.moveListElementRight.bind(this)),
                hotkeys: [
                    {
                        modifiers: [],
                        key: "Tab",
                    },
                ],
            });
            this.plugin.addCommand({
                id: "outdent-list",
                name: "Outdent the list and sublists",
                callback: this.obsidianService.createCommandCallback(this.moveListElementLeft.bind(this)),
                hotkeys: [
                    {
                        modifiers: ["Shift"],
                        key: "Tab",
                    },
                ],
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    moveListElementDown(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveDownOperation(root), editor);
        return shouldStopPropagation;
    }
    moveListElementUp(editor) {
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveUpOperation(root), editor);
        return shouldStopPropagation;
    }
    moveListElementRight(editor) {
        if (this.imeService.isIMEOpened()) {
            return true;
        }
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveRightOperation(root, this.listsService.getDefaultIndentChars()), editor);
        return shouldStopPropagation;
    }
    moveListElementLeft(editor) {
        if (this.imeService.isIMEOpened()) {
            return true;
        }
        const { shouldStopPropagation } = this.listsService.performOperation((root) => new MoveLeftOperation(root), editor);
        return shouldStopPropagation;
    }
}

class CreateNoteLineOperation {
    constructor(root, defaultIndentChars) {
        this.root = root;
        this.defaultIndentChars = defaultIndentChars;
        this.stopPropagation = false;
        this.updated = false;
    }
    shouldStopPropagation() {
        return this.stopPropagation;
    }
    shouldUpdate() {
        return this.updated;
    }
    perform() {
        const { root } = this;
        if (!root.hasSingleCursor()) {
            return;
        }
        const cursor = root.getCursor();
        const list = root.getListUnderCursor();
        const lineUnderCursor = list
            .getLinesInfo()
            .find((l) => l.from.line === cursor.line);
        if (cursor.ch < lineUnderCursor.from.ch) {
            return;
        }
        this.stopPropagation = true;
        this.updated = true;
        if (!list.getNotesIndent()) {
            const indent = list.isEmpty()
                ? list.getFirstLineIndent() + this.defaultIndentChars
                : list.getChildren()[0].getFirstLineIndent();
            list.setNotesIndent(indent);
        }
        const lines = list.getLinesInfo().reduce((acc, line) => {
            if (cursor.line === line.from.line) {
                acc.push(line.text.slice(0, cursor.ch - line.from.ch));
                acc.push(line.text.slice(cursor.ch - line.from.ch));
            }
            else {
                acc.push(line.text);
            }
            return acc;
        }, []);
        list.replaceLines(lines);
        root.replaceCursor({
            line: cursor.line + 1,
            ch: list.getNotesIndent().length,
        });
    }
}

function isShiftEnter(e) {
    return ((e.keyCode === 13 || e.code === "Enter") &&
        e.shiftKey === true &&
        e.metaKey === false &&
        e.altKey === false &&
        e.ctrlKey === false);
}
class ShiftEnterShouldCreateNoteFeature {
    constructor(plugin, settingsService, listsService, imeService) {
        this.plugin = plugin;
        this.settingsService = settingsService;
        this.listsService = listsService;
        this.imeService = imeService;
        this.onKeyDown = (cm, e) => {
            if (!this.settingsService.betterEnter ||
                !isShiftEnter(e) ||
                this.imeService.isIMEOpened()) {
                return;
            }
            const { shouldStopPropagation } = this.listsService.performOperation((root) => new CreateNoteLineOperation(root, this.listsService.getDefaultIndentChars()), cm);
            if (shouldStopPropagation) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.registerCodeMirror((cm) => {
                cm.on("keydown", this.onKeyDown);
            });
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.plugin.app.workspace.iterateCodeMirrors((cm) => {
                cm.off("keydown", this.onKeyDown);
            });
        });
    }
}

class IMEService {
    constructor() {
        this.composition = false;
        this.onCompositionStart = () => {
            this.composition = true;
        };
        this.onCompositionEnd = () => {
            this.composition = false;
        };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            document.addEventListener("compositionstart", this.onCompositionStart);
            document.addEventListener("compositionend", this.onCompositionEnd);
        });
    }
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            document.removeEventListener("compositionend", this.onCompositionEnd);
            document.removeEventListener("compositionstart", this.onCompositionStart);
        });
    }
    isIMEOpened() {
        return this.composition;
    }
}

class ObsidianOutlinerPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Loading obsidian-outliner`);
            this.settingsService = new SettingsService(this);
            yield this.settingsService.load();
            this.loggerService = new LoggerService(this.settingsService);
            this.obsidianService = new ObsidianService(this.app);
            this.listsService = new ListsService(this.loggerService, this.obsidianService);
            this.imeService = new IMEService();
            yield this.imeService.load();
            this.addSettingTab(new ObsidianOutlinerPluginSettingTab(this.app, this, this.settingsService));
            this.features = [
                new ListsStylesFeature(this, this.settingsService, this.obsidianService),
                new EnterOutdentIfLineIsEmptyFeature(this, this.settingsService, this.listsService, this.imeService),
                new EnterShouldCreateNewItemFeature(this, this.settingsService, this.listsService, this.imeService),
                new EnsureCursorInListContentFeature(this, this.settingsService, this.listsService),
                new MoveCursorToPreviousUnfoldedLineFeature(this, this.settingsService, this.listsService, this.imeService),
                new DeleteShouldIgnoreBulletsFeature(this, this.settingsService, this.listsService, this.imeService),
                new SelectionShouldIgnoreBulletsFeature(this, this.settingsService, this.listsService, this.imeService),
                new ZoomFeature(this, this.settingsService, this.imeService),
                new FoldFeature(this, this.obsidianService),
                new SelectAllFeature(this, this.settingsService, this.listsService, this.imeService),
                new MoveItemsFeature(this, this.obsidianService, this.listsService, this.imeService),
                new ShiftEnterShouldCreateNoteFeature(this, this.settingsService, this.listsService, this.imeService),
            ];
            for (const feature of this.features) {
                yield feature.load();
            }
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Unloading obsidian-outliner`);
            yield this.imeService.unload();
            for (const feature of this.features) {
                yield feature.unload();
            }
        });
    }
}

module.exports = ObsidianOutlinerPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInNyYy9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UudHMiLCJzcmMvc2VydmljZXMvT2JzaWRpYW5TZXJ2aWNlLnRzIiwic3JjL3Jvb3QvaW5kZXgudHMiLCJzcmMvc2VydmljZXMvTGlzdHNTZXJ2aWNlLnRzIiwic3JjL3NlcnZpY2VzL0xvZ2dlclNlcnZpY2UudHMiLCJzcmMvZmVhdHVyZXMvTGlzdHNTdHlsZXNGZWF0dXJlLnRzIiwic3JjL3Jvb3QvcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cy50cyIsInNyYy9vcGVyYXRpb25zL01vdmVMZWZ0T3BlcmF0aW9uLnRzIiwic3JjL3V0aWxzL2lzRW1wdHlMaW5lT3JFbXB0eUNoZWNrYm94LnRzIiwic3JjL29wZXJhdGlvbnMvT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvRW50ZXJPdXRkZW50SWZMaW5lSXNFbXB0eUZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9DcmVhdGVOZXdJdGVtT3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL0VudGVyU2hvdWxkQ3JlYXRlTmV3SXRlbU9uQ2hpbGRMZXZlbEZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9FbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL0RlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbi50cyIsInNyYy9vcGVyYXRpb25zL0RlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lT3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9EZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL1NlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvWm9vbUZlYXR1cmUudHMiLCJzcmMvZmVhdHVyZXMvRm9sZEZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9TZWxlY3RBbGxPcGVyYXRpb24udHMiLCJzcmMvZmVhdHVyZXMvU2VsZWN0QWxsRmVhdHVyZS50cyIsInNyYy9vcGVyYXRpb25zL01vdmVSaWdodE9wZXJhdGlvbi50cyIsInNyYy9vcGVyYXRpb25zL01vdmVEb3duT3BlcmF0aW9uLnRzIiwic3JjL29wZXJhdGlvbnMvTW92ZVVwT3BlcmF0aW9uLnRzIiwic3JjL2ZlYXR1cmVzL01vdmVJdGVtc0ZlYXR1cmUudHMiLCJzcmMvb3BlcmF0aW9ucy9DcmVhdGVOb3RlTGluZU9wZXJhdGlvbi50cyIsInNyYy9mZWF0dXJlcy9TaGlmdEVudGVyU2hvdWxkQ3JlYXRlTm90ZUZlYXR1cmUudHMiLCJzcmMvc2VydmljZXMvSU1FU2VydmljZS50cyIsInNyYy9PYnNpZGlhbk91dGxpbmVyUGx1Z2luLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBQbHVnaW5fMiwgU2V0dGluZyB9IGZyb20gXCJvYnNpZGlhblwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHN0eWxlTGlzdHM6IGJvb2xlYW47XG4gIGRlYnVnOiBib29sZWFuO1xuICBzdGlja0N1cnNvcjogYm9vbGVhbjtcbiAgYmV0dGVyRW50ZXI6IGJvb2xlYW47XG4gIHNlbGVjdEFsbDogYm9vbGVhbjtcbiAgZGlzYWJsZVpvb21Ob3RpZmljYXRpb246IGJvb2xlYW47XG4gIGhpZGVXYXJuaW5nOiBib29sZWFuO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3MgPSB7XG4gIHN0eWxlTGlzdHM6IGZhbHNlLFxuICBkZWJ1ZzogZmFsc2UsXG4gIHN0aWNrQ3Vyc29yOiB0cnVlLFxuICBiZXR0ZXJFbnRlcjogdHJ1ZSxcbiAgc2VsZWN0QWxsOiB0cnVlLFxuICBkaXNhYmxlWm9vbU5vdGlmaWNhdGlvbjogZmFsc2UsXG4gIGhpZGVXYXJuaW5nOiBmYWxzZSxcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gIGxvYWREYXRhKCk6IFByb21pc2U8T2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdzPjtcbiAgc2F2ZURhdGEoc2V0dGlnbnM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyk6IFByb21pc2U8dm9pZD47XG59XG5cbnR5cGUgSyA9IGtleW9mIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbnR5cGUgVjxUIGV4dGVuZHMgSz4gPSBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ3NbVF07XG50eXBlIENhbGxiYWNrPFQgZXh0ZW5kcyBLPiA9IChjYjogVjxUPikgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzU2VydmljZSBpbXBsZW1lbnRzIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncyB7XG4gIHByaXZhdGUgc3RvcmFnZTogU3RvcmFnZTtcbiAgcHJpdmF0ZSB2YWx1ZXM6IE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5ncztcbiAgcHJpdmF0ZSBoYW5kbGVyczogTWFwPEssIFNldDxDYWxsYmFjazxLPj4+O1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2U6IFN0b3JhZ2UpIHtcbiAgICB0aGlzLnN0b3JhZ2UgPSBzdG9yYWdlO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBnZXQgc3R5bGVMaXN0cygpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuc3R5bGVMaXN0cztcbiAgfVxuICBzZXQgc3R5bGVMaXN0cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic3R5bGVMaXN0c1wiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmRlYnVnO1xuICB9XG4gIHNldCBkZWJ1Zyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiZGVidWdcIiwgdmFsdWUpO1xuICB9XG5cbiAgZ2V0IHN0aWNrQ3Vyc29yKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zdGlja0N1cnNvcjtcbiAgfVxuICBzZXQgc3RpY2tDdXJzb3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldChcInN0aWNrQ3Vyc29yXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBiZXR0ZXJFbnRlcigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuYmV0dGVyRW50ZXI7XG4gIH1cbiAgc2V0IGJldHRlckVudGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJiZXR0ZXJFbnRlclwiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2VsZWN0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlcy5zZWxlY3RBbGw7XG4gIH1cbiAgc2V0IHNlbGVjdEFsbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwic2VsZWN0QWxsXCIsIHZhbHVlKTtcbiAgfVxuXG4gIGdldCBkaXNhYmxlWm9vbU5vdGlmaWNhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXMuZGlzYWJsZVpvb21Ob3RpZmljYXRpb247XG4gIH1cbiAgc2V0IGRpc2FibGVab29tTm90aWZpY2F0aW9uKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zZXQoXCJkaXNhYmxlWm9vbU5vdGlmaWNhdGlvblwiLCB2YWx1ZSk7XG4gIH1cblxuICBnZXQgaGlkZVdhcm5pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzLmhpZGVXYXJuaW5nO1xuICB9XG4gIHNldCBoaWRlV2FybmluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0KFwiaGlkZVdhcm5pbmdcIiwgdmFsdWUpO1xuICB9XG5cbiAgb25DaGFuZ2U8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KSB7XG4gICAgaWYgKCF0aGlzLmhhbmRsZXJzLmhhcyhrZXkpKSB7XG4gICAgICB0aGlzLmhhbmRsZXJzLnNldChrZXksIG5ldyBTZXQoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVycy5nZXQoa2V5KS5hZGQoY2IpO1xuICB9XG5cbiAgcmVtb3ZlQ2FsbGJhY2s8VCBleHRlbmRzIEs+KGtleTogVCwgY2I6IENhbGxiYWNrPFQ+KTogdm9pZCB7XG4gICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzLmdldChrZXkpO1xuXG4gICAgaWYgKGhhbmRsZXJzKSB7XG4gICAgICBoYW5kbGVycy5kZWxldGUoY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKERFRkFVTFRfU0VUVElOR1MpKSB7XG4gICAgICB0aGlzLnNldChrLCB2KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMudmFsdWVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgREVGQVVMVF9TRVRUSU5HUyxcbiAgICAgIGF3YWl0IHRoaXMuc3RvcmFnZS5sb2FkRGF0YSgpXG4gICAgKTtcbiAgfVxuXG4gIGFzeW5jIHNhdmUoKSB7XG4gICAgYXdhaXQgdGhpcy5zdG9yYWdlLnNhdmVEYXRhKHRoaXMudmFsdWVzKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0PFQgZXh0ZW5kcyBLPihrZXk6IFQsIHZhbHVlOiBWPEs+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNba2V5XSA9IHZhbHVlO1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMuaGFuZGxlcnMuZ2V0KGtleSk7XG5cbiAgICBpZiAoIWNhbGxiYWNrcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2Igb2YgY2FsbGJhY2tzLnZhbHVlcygpKSB7XG4gICAgICBjYih2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBQbHVnaW5fMiwgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICB9XG5cbiAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJJbXByb3ZlIHRoZSBzdHlsZSBvZiB5b3VyIGxpc3RzXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJTdHlsZXMgYXJlIG9ubHkgY29tcGF0aWJsZSB3aXRoIGJ1aWx0LWluIE9ic2lkaWFuIHRoZW1lcyBhbmQgbWF5IG5vdCBiZSBjb21wYXRpYmxlIHdpdGggb3RoZXIgdGhlbWVzLiBTdHlsZXMgb25seSB3b3JrIHdlbGwgd2l0aCB0YWIgc2l6ZSA0LlwiXG4gICAgICApXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3R5bGVMaXN0cykub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5zdHlsZUxpc3RzID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiU3RpY2sgdGhlIGN1cnNvciB0byB0aGUgY29udGVudFwiKVxuICAgICAgLnNldERlc2MoXCJEb24ndCBsZXQgdGhlIGN1cnNvciBtb3ZlIHRvIHRoZSBidWxsZXQgcG9zaXRpb24uXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc3RpY2tDdXJzb3IgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBFbnRlciBrZXlcIilcbiAgICAgIC5zZXREZXNjKFwiTWFrZSB0aGUgRW50ZXIga2V5IGJlaGF2ZSB0aGUgc2FtZSBhcyBvdGhlciBvdXRsaW5lcnMuXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuYmV0dGVyRW50ZXIgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJFbmhhbmNlIHRoZSBDdHJsK0Egb3IgQ21kK0EgYmVoYXZpb3JcIilcbiAgICAgIC5zZXREZXNjKFxuICAgICAgICBcIlByZXNzIHRoZSBob3RrZXkgb25jZSB0byBzZWxlY3QgdGhlIGN1cnJlbnQgbGlzdCBpdGVtLiBQcmVzcyB0aGUgaG90a2V5IHR3aWNlIHRvIHNlbGVjdCB0aGUgZW50aXJlIGxpc3QuXCJcbiAgICAgIClcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGUuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5zZWxlY3RBbGwpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3Muc2VsZWN0QWxsID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgIC5zZXROYW1lKFwiRGlzYWJsZSBub3RpZmljYXRpb24gYWJvdXQgT2JzaWRpYW4gWm9vbSBwbHVnaW5cIilcbiAgICAgIC5hZGRUb2dnbGUoKHRvZ2dsZSkgPT4ge1xuICAgICAgICB0b2dnbGVcbiAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5kaXNhYmxlWm9vbU5vdGlmaWNhdGlvbilcbiAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmRpc2FibGVab29tTm90aWZpY2F0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAuc2V0TmFtZShcIkhpZGUgdGhlIHdhcm5pbmcgYWJvdXQgZm91ci1zcGFjZSB0YWJzXCIpXG4gICAgICAuYWRkVG9nZ2xlKCh0b2dnbGUpID0+IHtcbiAgICAgICAgdG9nZ2xlLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuaGlkZVdhcm5pbmcpLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuaGlkZVdhcm5pbmcgPSB2YWx1ZTtcbiAgICAgICAgICBhd2FpdCB0aGlzLnNldHRpbmdzLnNhdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgLnNldE5hbWUoXCJEZWJ1ZyBtb2RlXCIpXG4gICAgICAuc2V0RGVzYyhcbiAgICAgICAgXCJPcGVuIERldlRvb2xzIChDb21tYW5kK09wdGlvbitJIG9yIENvbnRyb2wrU2hpZnQrSSkgdG8gY29weSB0aGUgZGVidWcgbG9ncy5cIlxuICAgICAgKVxuICAgICAgLmFkZFRvZ2dsZSgodG9nZ2xlKSA9PiB7XG4gICAgICAgIHRvZ2dsZS5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmRlYnVnKS5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLnNldHRpbmdzLmRlYnVnID0gdmFsdWU7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zZXR0aW5ncy5zYXZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFwcCwgTWFya2Rvd25WaWV3IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9ic2lkaWFuVGFic1NldHRpZ25zIHtcbiAgdXNlVGFiOiBib29sZWFuO1xuICB0YWJTaXplOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9ic2lkaWFuRm9sZFNldHRpZ25zIHtcbiAgZm9sZEluZGVudDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIE9ic2lkaWFuU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBwOiBBcHApIHt9XG5cbiAgZ2V0T2JzaWRpYW5UYWJzU2V0dGlnbnMoKTogSU9ic2lkaWFuVGFic1NldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlVGFiOiB0cnVlLFxuICAgICAgdGFiU2l6ZTogNCxcbiAgICAgIC4uLih0aGlzLmFwcC52YXVsdCBhcyBhbnkpLmNvbmZpZyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0T2JzaWRpYW5Gb2xkU2V0dGlnbnMoKTogSU9ic2lkaWFuRm9sZFNldHRpZ25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgZm9sZEluZGVudDogZmFsc2UsXG4gICAgICAuLi4odGhpcy5hcHAudmF1bHQgYXMgYW55KS5jb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIGdldEFjdGl2ZUxlYWZEaXNwbGF5VGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYuZ2V0RGlzcGxheVRleHQoKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbW1hbmRDYWxsYmFjayhjYjogKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpID0+IGJvb2xlYW4pIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XG5cbiAgICAgIGlmICghdmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IHZpZXcuc291cmNlTW9kZS5jbUVkaXRvcjtcblxuICAgICAgY29uc3Qgc2hvdWxkU3RvcFByb3BhZ2F0aW9uID0gY2IoZWRpdG9yKTtcblxuICAgICAgaWYgKFxuICAgICAgICAhc2hvdWxkU3RvcFByb3BhZ2F0aW9uICYmXG4gICAgICAgIHdpbmRvdy5ldmVudCAmJlxuICAgICAgICB3aW5kb3cuZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCJcbiAgICAgICkge1xuICAgICAgICAoZWRpdG9yIGFzIGFueSkudHJpZ2dlck9uS2V5RG93bih3aW5kb3cuZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjbXBQb3MoYTogSVBvc2l0aW9uLCBiOiBJUG9zaXRpb24pIHtcbiAgcmV0dXJuIGEubGluZSAtIGIubGluZSB8fCBhLmNoIC0gYi5jaDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1heFBvcyhhOiBJUG9zaXRpb24sIGI6IElQb3NpdGlvbikge1xuICByZXR1cm4gY21wUG9zKGEsIGIpIDwgMCA/IGIgOiBhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWluUG9zKGE6IElQb3NpdGlvbiwgYjogSVBvc2l0aW9uKSB7XG4gIHJldHVybiBjbXBQb3MoYSwgYikgPCAwID8gYSA6IGI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBvc2l0aW9uIHtcbiAgY2g6IG51bWJlcjtcbiAgbGluZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMaXN0TGluZSB7XG4gIHRleHQ6IHN0cmluZztcbiAgZnJvbTogSVBvc2l0aW9uO1xuICB0bzogSVBvc2l0aW9uO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSYW5nZSB7XG4gIGFuY2hvcjogSVBvc2l0aW9uO1xuICBoZWFkOiBJUG9zaXRpb247XG59XG5cbmV4cG9ydCBjbGFzcyBMaXN0IHtcbiAgcHJpdmF0ZSBwYXJlbnQ6IExpc3QgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogTGlzdFtdID0gW107XG4gIHByaXZhdGUgbm90ZXNJbmRlbnQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm9vdDogUm9vdCxcbiAgICBwcml2YXRlIGluZGVudDogc3RyaW5nLFxuICAgIHByaXZhdGUgYnVsbGV0OiBzdHJpbmcsXG4gICAgZmlyc3RMaW5lOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBmb2xkZWQ6IGJvb2xlYW5cbiAgKSB7XG4gICAgdGhpcy5saW5lcy5wdXNoKGZpcnN0TGluZSk7XG4gIH1cblxuICBnZXROb3Rlc0luZGVudCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5ub3Rlc0luZGVudDtcbiAgfVxuXG4gIHNldE5vdGVzSW5kZW50KG5vdGVzSW5kZW50OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5ub3Rlc0luZGVudCAhPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3RlcyBpbmRlbnQgYWxyZWFkeSBwcm92aWRlZGApO1xuICAgIH1cbiAgICB0aGlzLm5vdGVzSW5kZW50ID0gbm90ZXNJbmRlbnQ7XG4gIH1cblxuICBhZGRMaW5lKHRleHQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLm5vdGVzSW5kZW50ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gYWRkIGxpbmUsIG5vdGVzIGluZGVudCBzaG91bGQgYmUgcHJvdmlkZWQgZmlyc3RgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMubGluZXMucHVzaCh0ZXh0KTtcbiAgfVxuXG4gIHJlcGxhY2VMaW5lcyhsaW5lczogc3RyaW5nW10pIHtcbiAgICBpZiAobGluZXMubGVuZ3RoID4gMSAmJiB0aGlzLm5vdGVzSW5kZW50ID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gYWRkIGxpbmUsIG5vdGVzIGluZGVudCBzaG91bGQgYmUgcHJvdmlkZWQgZmlyc3RgXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMubGluZXMgPSBsaW5lcztcbiAgfVxuXG4gIGdldExpbmVDb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcy5sZW5ndGg7XG4gIH1cblxuICBnZXRSb290KCkge1xuICAgIHJldHVybiB0aGlzLnJvb3Q7XG4gIH1cblxuICBnZXRDaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5jb25jYXQoKTtcbiAgfVxuXG4gIGdldExpbmVzSW5mbygpOiBJTGlzdExpbmVbXSB7XG4gICAgY29uc3Qgc3RhcnRMaW5lID0gdGhpcy5yb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YodGhpcylbMF07XG5cbiAgICByZXR1cm4gdGhpcy5saW5lcy5tYXAoKHJvdywgaSkgPT4ge1xuICAgICAgY29uc3QgbGluZSA9IHN0YXJ0TGluZSArIGk7XG4gICAgICBjb25zdCBzdGFydENoID1cbiAgICAgICAgaSA9PT0gMCA/IHRoaXMuZ2V0Q29udGVudFN0YXJ0Q2goKSA6IHRoaXMubm90ZXNJbmRlbnQubGVuZ3RoO1xuICAgICAgY29uc3QgZW5kQ2ggPSBzdGFydENoICsgcm93Lmxlbmd0aDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGV4dDogcm93LFxuICAgICAgICBmcm9tOiB7IGxpbmUsIGNoOiBzdGFydENoIH0sXG4gICAgICAgIHRvOiB7IGxpbmUsIGNoOiBlbmRDaCB9LFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldExpbmVzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcy5jb25jYXQoKTtcbiAgfVxuXG4gIGdldEZpcnN0TGluZUNvbnRlbnRTdGFydCgpIHtcbiAgICBjb25zdCBzdGFydExpbmUgPSB0aGlzLnJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZih0aGlzKVswXTtcblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBzdGFydExpbmUsXG4gICAgICBjaDogdGhpcy5nZXRDb250ZW50U3RhcnRDaCgpLFxuICAgIH07XG4gIH1cblxuICBnZXRMYXN0TGluZUNvbnRlbnRFbmQoKSB7XG4gICAgY29uc3QgZW5kTGluZSA9IHRoaXMucm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKHRoaXMpWzFdO1xuICAgIGNvbnN0IGVuZENoID1cbiAgICAgIHRoaXMubGluZXMubGVuZ3RoID09PSAxXG4gICAgICAgID8gdGhpcy5nZXRDb250ZW50U3RhcnRDaCgpICsgdGhpcy5saW5lc1swXS5sZW5ndGhcbiAgICAgICAgOiB0aGlzLm5vdGVzSW5kZW50Lmxlbmd0aCArIHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogZW5kTGluZSxcbiAgICAgIGNoOiBlbmRDaCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb250ZW50U3RhcnRDaCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRlbnQubGVuZ3RoICsgdGhpcy5idWxsZXQubGVuZ3RoICsgMTtcbiAgfVxuXG4gIGlzRm9sZGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmZvbGRlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuaXNGb2xkZWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0ZvbGRSb290KCkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLmdldFBhcmVudCgpO1xuXG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgaWYgKHBhcmVudC5mb2xkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBwYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZm9sZGVkO1xuICB9XG5cbiAgZ2V0TGV2ZWwoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0TGV2ZWwoKSArIDE7XG4gIH1cblxuICB1bmluZGVudENvbnRlbnQoZnJvbTogbnVtYmVyLCB0aWxsOiBudW1iZXIpIHtcbiAgICB0aGlzLmluZGVudCA9IHRoaXMuaW5kZW50LnNsaWNlKDAsIGZyb20pICsgdGhpcy5pbmRlbnQuc2xpY2UodGlsbCk7XG4gICAgaWYgKHRoaXMubm90ZXNJbmRlbnQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMubm90ZXNJbmRlbnQgPVxuICAgICAgICB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKDAsIGZyb20pICsgdGhpcy5ub3Rlc0luZGVudC5zbGljZSh0aWxsKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnVuaW5kZW50Q29udGVudChmcm9tLCB0aWxsKTtcbiAgICB9XG4gIH1cblxuICBpbmRlbnRDb250ZW50KGluZGVudFBvczogbnVtYmVyLCBpbmRlbnRDaGFyczogc3RyaW5nKSB7XG4gICAgdGhpcy5pbmRlbnQgPVxuICAgICAgdGhpcy5pbmRlbnQuc2xpY2UoMCwgaW5kZW50UG9zKSArXG4gICAgICBpbmRlbnRDaGFycyArXG4gICAgICB0aGlzLmluZGVudC5zbGljZShpbmRlbnRQb3MpO1xuICAgIGlmICh0aGlzLm5vdGVzSW5kZW50ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLm5vdGVzSW5kZW50ID1cbiAgICAgICAgdGhpcy5ub3Rlc0luZGVudC5zbGljZSgwLCBpbmRlbnRQb3MpICtcbiAgICAgICAgaW5kZW50Q2hhcnMgK1xuICAgICAgICB0aGlzLm5vdGVzSW5kZW50LnNsaWNlKGluZGVudFBvcyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBjaGlsZC5pbmRlbnRDb250ZW50KGluZGVudFBvcywgaW5kZW50Q2hhcnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldEZpcnN0TGluZUluZGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRlbnQ7XG4gIH1cblxuICBnZXRCdWxsZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVsbGV0O1xuICB9XG5cbiAgcmVwbGF0ZUJ1bGxldChidWxsZXQ6IHN0cmluZykge1xuICAgIHRoaXMuYnVsbGV0ID0gYnVsbGV0O1xuICB9XG5cbiAgZ2V0UGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgfVxuXG4gIGFkZEJlZm9yZUFsbChsaXN0OiBMaXN0KSB7XG4gICAgdGhpcy5jaGlsZHJlbi51bnNoaWZ0KGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGFkZEFmdGVyQWxsKGxpc3Q6IExpc3QpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2gobGlzdCk7XG4gICAgbGlzdC5wYXJlbnQgPSB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlQ2hpbGQobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSwgMSk7XG4gICAgbGlzdC5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgYWRkQmVmb3JlKGJlZm9yZTogTGlzdCwgbGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYmVmb3JlKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNwbGljZShpLCAwLCBsaXN0KTtcbiAgICBsaXN0LnBhcmVudCA9IHRoaXM7XG4gIH1cblxuICBhZGRBZnRlcihiZWZvcmU6IExpc3QsIGxpc3Q6IExpc3QpIHtcbiAgICBjb25zdCBpID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGJlZm9yZSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zcGxpY2UoaSArIDEsIDAsIGxpc3QpO1xuICAgIGxpc3QucGFyZW50ID0gdGhpcztcbiAgfVxuXG4gIGdldFByZXZTaWJsaW5nT2YobGlzdDogTGlzdCkge1xuICAgIGNvbnN0IGkgPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YobGlzdCk7XG4gICAgcmV0dXJuIGkgPiAwID8gdGhpcy5jaGlsZHJlbltpIC0gMV0gOiBudWxsO1xuICB9XG5cbiAgZ2V0TmV4dFNpYmxpbmdPZihsaXN0OiBMaXN0KSB7XG4gICAgY29uc3QgaSA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihsaXN0KTtcbiAgICByZXR1cm4gaSA+PSAwICYmIGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aCA/IHRoaXMuY2hpbGRyZW5baSArIDFdIDogbnVsbDtcbiAgfVxuXG4gIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgcHJpbnQoKSB7XG4gICAgbGV0IHJlcyA9IFwiXCI7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyArPSBpID09PSAwID8gdGhpcy5pbmRlbnQgKyB0aGlzLmJ1bGxldCArIFwiIFwiIDogdGhpcy5ub3Rlc0luZGVudDtcbiAgICAgIHJlcyArPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgcmVzICs9IFwiXFxuXCI7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICByZXMgKz0gY2hpbGQucHJpbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb290IHtcbiAgcHJpdmF0ZSByb290TGlzdCA9IG5ldyBMaXN0KHRoaXMsIFwiXCIsIFwiXCIsIFwiXCIsIGZhbHNlKTtcbiAgcHJpdmF0ZSBzZWxlY3Rpb25zOiBJUmFuZ2VbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RhcnQ6IElQb3NpdGlvbixcbiAgICBwcml2YXRlIGVuZDogSVBvc2l0aW9uLFxuICAgIHNlbGVjdGlvbnM6IElSYW5nZVtdXG4gICkge1xuICAgIHRoaXMucmVwbGFjZVNlbGVjdGlvbnMoc2VsZWN0aW9ucyk7XG4gIH1cblxuICBnZXRSb290TGlzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290TGlzdDtcbiAgfVxuXG4gIGdldFJhbmdlKCk6IFtJUG9zaXRpb24sIElQb3NpdGlvbl0ge1xuICAgIHJldHVybiBbeyAuLi50aGlzLnN0YXJ0IH0sIHsgLi4udGhpcy5lbmQgfV07XG4gIH1cblxuICBnZXRTZWxlY3Rpb25zKCk6IElSYW5nZVtdIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25zLm1hcCgocykgPT4gKHtcbiAgICAgIGFuY2hvcjogeyAuLi5zLmFuY2hvciB9LFxuICAgICAgaGVhZDogeyAuLi5zLmhlYWQgfSxcbiAgICB9KSk7XG4gIH1cblxuICBoYXNTaW5nbGVDdXJzb3IoKSB7XG4gICAgaWYgKCF0aGlzLmhhc1NpbmdsZVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb25zWzBdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHNlbGVjdGlvbi5hbmNob3IubGluZSA9PT0gc2VsZWN0aW9uLmhlYWQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uLmFuY2hvci5jaCA9PT0gc2VsZWN0aW9uLmhlYWQuY2hcbiAgICApO1xuICB9XG5cbiAgaGFzU2luZ2xlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbnMubGVuZ3RoID09PSAxO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKCkge1xuICAgIHJldHVybiB7IC4uLnRoaXMuc2VsZWN0aW9uc1t0aGlzLnNlbGVjdGlvbnMubGVuZ3RoIC0gMV0uaGVhZCB9O1xuICB9XG5cbiAgcmVwbGFjZUN1cnNvcihjdXJzb3I6IElQb3NpdGlvbikge1xuICAgIHRoaXMuc2VsZWN0aW9ucyA9IFt7IGFuY2hvcjogY3Vyc29yLCBoZWFkOiBjdXJzb3IgfV07XG4gIH1cblxuICByZXBsYWNlU2VsZWN0aW9ucyhzZWxlY3Rpb25zOiBJUmFuZ2VbXSkge1xuICAgIGlmIChzZWxlY3Rpb25zLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGNyZWF0ZSBSb290IHdpdGhvdXQgc2VsZWN0aW9uc2ApO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGlvbnMgPSBzZWxlY3Rpb25zO1xuICB9XG5cbiAgZ2V0TGlzdFVuZGVyQ3Vyc29yKCk6IExpc3Qge1xuICAgIHJldHVybiB0aGlzLmdldExpc3RVbmRlckxpbmUodGhpcy5nZXRDdXJzb3IoKS5saW5lKTtcbiAgfVxuXG4gIGdldExpc3RVbmRlckxpbmUobGluZTogbnVtYmVyKSB7XG4gICAgaWYgKGxpbmUgPCB0aGlzLnN0YXJ0LmxpbmUgfHwgbGluZSA+IHRoaXMuZW5kLmxpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0OiBMaXN0ID0gbnVsbDtcbiAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuc3RhcnQubGluZTtcblxuICAgIGNvbnN0IHZpc2l0QXJyID0gKGxsOiBMaXN0W10pID0+IHtcbiAgICAgIGZvciAoY29uc3QgbCBvZiBsbCkge1xuICAgICAgICBjb25zdCBsaXN0RnJvbUxpbmUgPSBpbmRleDtcbiAgICAgICAgY29uc3QgbGlzdFRpbGxMaW5lID0gbGlzdEZyb21MaW5lICsgbC5nZXRMaW5lQ291bnQoKSAtIDE7XG5cbiAgICAgICAgaWYgKGxpbmUgPj0gbGlzdEZyb21MaW5lICYmIGxpbmUgPD0gbGlzdFRpbGxMaW5lKSB7XG4gICAgICAgICAgcmVzdWx0ID0gbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbmRleCA9IGxpc3RUaWxsTGluZSArIDE7XG4gICAgICAgICAgdmlzaXRBcnIobC5nZXRDaGlsZHJlbigpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZpc2l0QXJyKHRoaXMucm9vdExpc3QuZ2V0Q2hpbGRyZW4oKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0OiBMaXN0KTogW251bWJlciwgbnVtYmVyXSB8IG51bGwge1xuICAgIGxldCByZXN1bHQ6IFtudW1iZXIsIG51bWJlcl0gfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGluZTogbnVtYmVyID0gdGhpcy5zdGFydC5saW5lO1xuXG4gICAgY29uc3QgdmlzaXRBcnIgPSAobGw6IExpc3RbXSkgPT4ge1xuICAgICAgZm9yIChjb25zdCBsIG9mIGxsKSB7XG4gICAgICAgIGNvbnN0IGxpc3RGcm9tTGluZSA9IGxpbmU7XG4gICAgICAgIGNvbnN0IGxpc3RUaWxsTGluZSA9IGxpc3RGcm9tTGluZSArIGwuZ2V0TGluZUNvdW50KCkgLSAxO1xuXG4gICAgICAgIGlmIChsID09PSBsaXN0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gW2xpc3RGcm9tTGluZSwgbGlzdFRpbGxMaW5lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lID0gbGlzdFRpbGxMaW5lICsgMTtcbiAgICAgICAgICB2aXNpdEFycihsLmdldENoaWxkcmVuKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2aXNpdEFycih0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldENoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLnJvb3RMaXN0LmdldENoaWxkcmVuKCk7XG4gIH1cblxuICBwcmludCgpIHtcbiAgICBsZXQgcmVzID0gXCJcIjtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5yb290TGlzdC5nZXRDaGlsZHJlbigpKSB7XG4gICAgICByZXMgKz0gY2hpbGQucHJpbnQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLnJlcGxhY2UoL1xcbiQvLCBcIlwiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gXCIuL0xvZ2dlclNlcnZpY2VcIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgTGlzdCwgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvSU9wZXJhdGlvblwiO1xuXG5jb25zdCBidWxsZXRTaWduID0gYCg/OlstKitdfFxcXFxkK1xcXFwuKWA7XG5cbmNvbnN0IGxpc3RJdGVtV2l0aG91dFNwYWNlc1JlID0gbmV3IFJlZ0V4cChgXiR7YnVsbGV0U2lnbn0gYCk7XG5jb25zdCBsaXN0SXRlbVJlID0gbmV3IFJlZ0V4cChgXlsgXFx0XSoke2J1bGxldFNpZ259IGApO1xuY29uc3Qgc3RyaW5nV2l0aFNwYWNlc1JlID0gbmV3IFJlZ0V4cChgXlsgXFx0XStgKTtcbmNvbnN0IHBhcnNlTGlzdEl0ZW1SZSA9IG5ldyBSZWdFeHAoYF4oWyBcXHRdKikoJHtidWxsZXRTaWdufSkgKC4qKSRgKTtcblxuZXhwb3J0IGludGVyZmFjZSBJQXBwbHlDaGFuZ2VzTGlzdCB7XG4gIGlzRm9sZFJvb3QoKTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJQXBwbHlDaGFuZ2VzUm9vdCB7XG4gIGdldFJhbmdlKCk6IFtDb2RlTWlycm9yLlBvc2l0aW9uLCBDb2RlTWlycm9yLlBvc2l0aW9uXTtcbiAgZ2V0U2VsZWN0aW9ucygpOiB7IGFuY2hvcjogQ29kZU1pcnJvci5Qb3NpdGlvbjsgaGVhZDogQ29kZU1pcnJvci5Qb3NpdGlvbiB9W107XG4gIHByaW50KCk6IHN0cmluZztcbiAgZ2V0TGlzdFVuZGVyTGluZShsOiBudW1iZXIpOiBJQXBwbHlDaGFuZ2VzTGlzdDtcbn1cblxuaW50ZXJmYWNlIElQYXJzZUxpc3RMaXN0IHtcbiAgZ2V0Rmlyc3RMaW5lSW5kZW50KCk6IHN0cmluZztcbiAgc2V0Tm90ZXNJbmRlbnQobm90ZXNJbmRlbnQ6IHN0cmluZyk6IHZvaWQ7XG4gIGdldE5vdGVzSW5kZW50KCk6IHN0cmluZyB8IG51bGw7XG4gIGFkZExpbmUodGV4dDogc3RyaW5nKTogdm9pZDtcbiAgZ2V0UGFyZW50KCk6IElQYXJzZUxpc3RMaXN0IHwgbnVsbDtcbiAgYWRkQWZ0ZXJBbGwobGlzdDogSVBhcnNlTGlzdExpc3QpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgTGlzdHNTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBsb2dnZXJTZXJ2aWNlOiBMb2dnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgb2JzaWRpYW5TZXJ2aWNlOiBPYnNpZGlhblNlcnZpY2VcbiAgKSB7fVxuXG4gIGV2YWxPcGVyYXRpb24ocm9vdDogUm9vdCwgb3A6IElPcGVyYXRpb24sIGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBvcC5wZXJmb3JtKCk7XG5cbiAgICBpZiAob3Auc2hvdWxkVXBkYXRlKCkpIHtcbiAgICAgIHRoaXMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgcm9vdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNob3VsZFVwZGF0ZTogb3Auc2hvdWxkVXBkYXRlKCksXG4gICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb246IG9wLnNob3VsZFN0b3BQcm9wYWdhdGlvbigpLFxuICAgIH07XG4gIH1cblxuICBwZXJmb3JtT3BlcmF0aW9uKFxuICAgIGNiOiAocm9vdDogUm9vdCkgPT4gSU9wZXJhdGlvbixcbiAgICBlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yLFxuICAgIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKVxuICApIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5wYXJzZUxpc3QoZWRpdG9yLCBjdXJzb3IpO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICByZXR1cm4geyBzaG91bGRVcGRhdGU6IGZhbHNlLCBzaG91bGRTdG9wUHJvcGFnYXRpb246IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY29uc3Qgb3AgPSBjYihyb290KTtcblxuICAgIHJldHVybiB0aGlzLmV2YWxPcGVyYXRpb24ocm9vdCwgb3AsIGVkaXRvcik7XG4gIH1cblxuICBwYXJzZUxpc3QoXG4gICAgZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcixcbiAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yKClcbiAgKTogUm9vdCB8IG51bGwge1xuICAgIGNvbnN0IGQgPSB0aGlzLmxvZ2dlclNlcnZpY2UuYmluZChcInBhcnNlTGlzdFwiKTtcbiAgICBjb25zdCBlcnJvciA9IChtc2c6IHN0cmluZyk6IG51bGwgPT4ge1xuICAgICAgZChtc2cpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShjdXJzb3IubGluZSk7XG5cbiAgICBsZXQgbGlzdExvb2tpbmdQb3M6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuaXNMaXN0SXRlbShsaW5lKSkge1xuICAgICAgbGlzdExvb2tpbmdQb3MgPSBjdXJzb3IubGluZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNMaW5lV2l0aEluZGVudChsaW5lKSkge1xuICAgICAgbGV0IGxpc3RMb29raW5nUG9zU2VhcmNoID0gY3Vyc29yLmxpbmUgLSAxO1xuICAgICAgd2hpbGUgKGxpc3RMb29raW5nUG9zU2VhcmNoID49IGVkaXRvci5maXJzdExpbmUoKSkge1xuICAgICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobGlzdExvb2tpbmdQb3NTZWFyY2gpO1xuICAgICAgICBpZiAodGhpcy5pc0xpc3RJdGVtKGxpbmUpKSB7XG4gICAgICAgICAgbGlzdExvb2tpbmdQb3MgPSBsaXN0TG9va2luZ1Bvc1NlYXJjaDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzTGluZVdpdGhJbmRlbnQobGluZSkpIHtcbiAgICAgICAgICBsaXN0TG9va2luZ1Bvc1NlYXJjaC0tO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3RMb29raW5nUG9zID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBsaXN0U3RhcnRMaW5lOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgbGlzdFN0YXJ0TGluZUxvb2t1cCA9IGxpc3RMb29raW5nUG9zO1xuICAgIHdoaWxlIChsaXN0U3RhcnRMaW5lTG9va3VwID49IGVkaXRvci5maXJzdExpbmUoKSkge1xuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRMaW5lKGxpc3RTdGFydExpbmVMb29rdXApO1xuICAgICAgaWYgKCF0aGlzLmlzTGlzdEl0ZW0obGluZSkgJiYgIXRoaXMuaXNMaW5lV2l0aEluZGVudChsaW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzTGlzdEl0ZW1XaXRob3V0U3BhY2VzKGxpbmUpKSB7XG4gICAgICAgIGxpc3RTdGFydExpbmUgPSBsaXN0U3RhcnRMaW5lTG9va3VwO1xuICAgICAgfVxuICAgICAgbGlzdFN0YXJ0TGluZUxvb2t1cC0tO1xuICAgIH1cblxuICAgIGlmIChsaXN0U3RhcnRMaW5lID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgbGlzdEVuZExpbmUgPSBsaXN0TG9va2luZ1BvcztcbiAgICBsZXQgbGlzdEVuZExpbmVMb29rdXAgPSBsaXN0TG9va2luZ1BvcztcbiAgICB3aGlsZSAobGlzdEVuZExpbmVMb29rdXAgPD0gZWRpdG9yLmxhc3RMaW5lKCkpIHtcbiAgICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0TGluZShsaXN0RW5kTGluZUxvb2t1cCk7XG4gICAgICBpZiAoIXRoaXMuaXNMaXN0SXRlbShsaW5lKSAmJiAhdGhpcy5pc0xpbmVXaXRoSW5kZW50KGxpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlzRW1wdHlMaW5lKGxpbmUpKSB7XG4gICAgICAgIGxpc3RFbmRMaW5lID0gbGlzdEVuZExpbmVMb29rdXA7XG4gICAgICB9XG4gICAgICBsaXN0RW5kTGluZUxvb2t1cCsrO1xuICAgIH1cblxuICAgIGlmIChsaXN0U3RhcnRMaW5lID4gY3Vyc29yLmxpbmUgfHwgbGlzdEVuZExpbmUgPCBjdXJzb3IubGluZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBSb290KFxuICAgICAgeyBsaW5lOiBsaXN0U3RhcnRMaW5lLCBjaDogMCB9LFxuICAgICAgeyBsaW5lOiBsaXN0RW5kTGluZSwgY2g6IGVkaXRvci5nZXRMaW5lKGxpc3RFbmRMaW5lKS5sZW5ndGggfSxcbiAgICAgIGVkaXRvci5saXN0U2VsZWN0aW9ucygpLm1hcCgocikgPT4gKHtcbiAgICAgICAgYW5jaG9yOiB7IGxpbmU6IHIuYW5jaG9yLmxpbmUsIGNoOiByLmFuY2hvci5jaCB9LFxuICAgICAgICBoZWFkOiB7IGxpbmU6IHIuaGVhZC5saW5lLCBjaDogci5oZWFkLmNoIH0sXG4gICAgICB9KSlcbiAgICApO1xuXG4gICAgbGV0IGN1cnJlbnRQYXJlbnQ6IElQYXJzZUxpc3RMaXN0ID0gcm9vdC5nZXRSb290TGlzdCgpO1xuICAgIGxldCBjdXJyZW50TGlzdDogSVBhcnNlTGlzdExpc3QgfCBudWxsID0gbnVsbDtcbiAgICBsZXQgY3VycmVudEluZGVudCA9IFwiXCI7XG5cbiAgICBmb3IgKGxldCBsID0gbGlzdFN0YXJ0TGluZTsgbCA8PSBsaXN0RW5kTGluZTsgbCsrKSB7XG4gICAgICBjb25zdCBsaW5lID0gZWRpdG9yLmdldExpbmUobCk7XG4gICAgICBjb25zdCBtYXRjaGVzID0gcGFyc2VMaXN0SXRlbVJlLmV4ZWMobGluZSk7XG5cbiAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgIGNvbnN0IFtfLCBpbmRlbnQsIGJ1bGxldCwgY29udGVudF0gPSBtYXRjaGVzO1xuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVMZW5ndGggPSBNYXRoLm1pbihjdXJyZW50SW5kZW50Lmxlbmd0aCwgaW5kZW50Lmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGluZGVudFNsaWNlID0gaW5kZW50LnNsaWNlKDAsIGNvbXBhcmVMZW5ndGgpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZW50U2xpY2UgPSBjdXJyZW50SW5kZW50LnNsaWNlKDAsIGNvbXBhcmVMZW5ndGgpO1xuXG4gICAgICAgIGlmIChpbmRlbnRTbGljZSAhPT0gY3VycmVudEluZGVudFNsaWNlKSB7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSBjdXJyZW50SW5kZW50U2xpY2VcbiAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csIFwiU1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBcIlRcIik7XG4gICAgICAgICAgY29uc3QgZ290ID0gaW5kZW50U2xpY2UucmVwbGFjZSgvIC9nLCBcIlNcIikucmVwbGFjZSgvXFx0L2csIFwiVFwiKTtcblxuICAgICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgaW5kZW50IFwiJHtleHBlY3RlZH1cIiwgZ290IFwiJHtnb3R9XCJgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbmRlbnQubGVuZ3RoID4gY3VycmVudEluZGVudC5sZW5ndGgpIHtcbiAgICAgICAgICBjdXJyZW50UGFyZW50ID0gY3VycmVudExpc3Q7XG4gICAgICAgICAgY3VycmVudEluZGVudCA9IGluZGVudDtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRlbnQubGVuZ3RoIDwgY3VycmVudEluZGVudC5sZW5ndGgpIHtcbiAgICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBjdXJyZW50UGFyZW50LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aCA+PSBpbmRlbnQubGVuZ3RoICYmXG4gICAgICAgICAgICBjdXJyZW50UGFyZW50LmdldFBhcmVudCgpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjdXJyZW50UGFyZW50ID0gY3VycmVudFBhcmVudC5nZXRQYXJlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEluZGVudCA9IGluZGVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZvbGRlZCA9ICEhKGVkaXRvciBhcyBhbnkpLmlzRm9sZGVkKHtcbiAgICAgICAgICBsaW5lOiBNYXRoLm1pbihsICsgMSwgbGlzdEVuZExpbmUpLFxuICAgICAgICAgIGNoOiAwLFxuICAgICAgICB9KTtcblxuICAgICAgICBjdXJyZW50TGlzdCA9IG5ldyBMaXN0KHJvb3QsIGluZGVudCwgYnVsbGV0LCBjb250ZW50LCBmb2xkZWQpO1xuICAgICAgICBjdXJyZW50UGFyZW50LmFkZEFmdGVyQWxsKGN1cnJlbnRMaXN0KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0xpbmVXaXRoSW5kZW50KGxpbmUpKSB7XG4gICAgICAgIGlmICghY3VycmVudExpc3QpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICBgVW5hYmxlIHRvIHBhcnNlIGxpc3Q6IGV4cGVjdGVkIGxpc3QgaXRlbSwgZ290IGVtcHR5IGxpbmVgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGVudFRvQ2hlY2sgPSBjdXJyZW50TGlzdC5nZXROb3Rlc0luZGVudCgpIHx8IGN1cnJlbnRJbmRlbnQ7XG5cbiAgICAgICAgaWYgKGxpbmUuaW5kZXhPZihpbmRlbnRUb0NoZWNrKSAhPT0gMCkge1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gaW5kZW50VG9DaGVjay5yZXBsYWNlKC8gL2csIFwiU1wiKS5yZXBsYWNlKC9cXHQvZywgXCJUXCIpO1xuICAgICAgICAgIGNvbnN0IGdvdCA9IGxpbmVcbiAgICAgICAgICAgIC5tYXRjaCgvXlsgXFx0XSovKVswXVxuICAgICAgICAgICAgLnJlcGxhY2UoLyAvZywgXCJTXCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csIFwiVFwiKTtcblxuICAgICAgICAgIHJldHVybiBlcnJvcihcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgaW5kZW50IFwiJHtleHBlY3RlZH1cIiwgZ290IFwiJHtnb3R9XCJgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY3VycmVudExpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSBsaW5lLm1hdGNoKC9eWyBcXHRdKy8pO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVzIHx8IG1hdGNoZXNbMF0ubGVuZ3RoIDw9IGN1cnJlbnRJbmRlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgICAgIGBVbmFibGUgdG8gcGFyc2UgbGlzdDogZXhwZWN0ZWQgc29tZSBpbmRlbnQsIGdvdCBubyBpbmRlbnRgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRMaXN0LnNldE5vdGVzSW5kZW50KG1hdGNoZXNbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExpc3QuYWRkTGluZShsaW5lLnNsaWNlKGN1cnJlbnRMaXN0LmdldE5vdGVzSW5kZW50KCkubGVuZ3RoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3IoXG4gICAgICAgICAgYFVuYWJsZSB0byBwYXJzZSBsaXN0OiBleHBlY3RlZCBsaXN0IGl0ZW0gb3Igbm90ZSwgZ290IFwiJHtsaW5lfVwiYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUNoYW5nZXMoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvciwgcm9vdDogSUFwcGx5Q2hhbmdlc1Jvb3QpIHtcbiAgICBjb25zdCByb290UmFuZ2UgPSByb290LmdldFJhbmdlKCk7XG4gICAgY29uc3Qgb2xkU3RyaW5nID0gZWRpdG9yLmdldFJhbmdlKHJvb3RSYW5nZVswXSwgcm9vdFJhbmdlWzFdKTtcbiAgICBjb25zdCBuZXdTdHJpbmcgPSByb290LnByaW50KCk7XG5cbiAgICBjb25zdCBmcm9tTGluZSA9IHJvb3RSYW5nZVswXS5saW5lO1xuICAgIGNvbnN0IHRvTGluZSA9IHJvb3RSYW5nZVsxXS5saW5lO1xuXG4gICAgZm9yIChsZXQgbCA9IGZyb21MaW5lOyBsIDw9IHRvTGluZTsgbCsrKSB7XG4gICAgICAoZWRpdG9yIGFzIGFueSkuZm9sZENvZGUobCwgbnVsbCwgXCJ1bmZvbGRcIik7XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZUZyb20gPSB7IC4uLnJvb3RSYW5nZVswXSB9O1xuICAgIGxldCBjaGFuZ2VUbyA9IHsgLi4ucm9vdFJhbmdlWzFdIH07XG4gICAgbGV0IG9sZFRtcCA9IG9sZFN0cmluZztcbiAgICBsZXQgbmV3VG1wID0gbmV3U3RyaW5nO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnN0IG5sSW5kZXggPSBvbGRUbXAuaW5kZXhPZihcIlxcblwiKTtcbiAgICAgIGlmIChubEluZGV4IDwgMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9sZExpbmUgPSBvbGRUbXAuc2xpY2UoMCwgbmxJbmRleCArIDEpO1xuICAgICAgY29uc3QgbmV3TGluZSA9IG5ld1RtcC5zbGljZSgwLCBvbGRMaW5lLmxlbmd0aCk7XG4gICAgICBpZiAob2xkTGluZSAhPT0gbmV3TGluZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNoYW5nZUZyb20ubGluZSsrO1xuICAgICAgb2xkVG1wID0gb2xkVG1wLnNsaWNlKG9sZExpbmUubGVuZ3RoKTtcbiAgICAgIG5ld1RtcCA9IG5ld1RtcC5zbGljZShvbGRMaW5lLmxlbmd0aCk7XG4gICAgfVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBubEluZGV4ID0gb2xkVG1wLmxhc3RJbmRleE9mKFwiXFxuXCIpO1xuICAgICAgaWYgKG5sSW5kZXggPCAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY29uc3Qgb2xkTGluZSA9IG9sZFRtcC5zbGljZShubEluZGV4KTtcbiAgICAgIGNvbnN0IG5ld0xpbmUgPSBuZXdUbXAuc2xpY2UoLW9sZExpbmUubGVuZ3RoKTtcbiAgICAgIGlmIChvbGRMaW5lICE9PSBuZXdMaW5lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgb2xkVG1wID0gb2xkVG1wLnNsaWNlKDAsIC1vbGRMaW5lLmxlbmd0aCk7XG4gICAgICBuZXdUbXAgPSBuZXdUbXAuc2xpY2UoMCwgLW9sZExpbmUubGVuZ3RoKTtcblxuICAgICAgY29uc3QgbmxJbmRleDIgPSBvbGRUbXAubGFzdEluZGV4T2YoXCJcXG5cIik7XG4gICAgICBjaGFuZ2VUby5jaCA9XG4gICAgICAgIG5sSW5kZXgyID49IDAgPyBvbGRUbXAubGVuZ3RoIC0gbmxJbmRleDIgLSAxIDogb2xkVG1wLmxlbmd0aDtcbiAgICAgIGNoYW5nZVRvLmxpbmUtLTtcbiAgICB9XG5cbiAgICBpZiAob2xkVG1wICE9PSBuZXdUbXApIHtcbiAgICAgIGVkaXRvci5yZXBsYWNlUmFuZ2UobmV3VG1wLCBjaGFuZ2VGcm9tLCBjaGFuZ2VUbyk7XG4gICAgfVxuXG4gICAgZWRpdG9yLnNldFNlbGVjdGlvbnMocm9vdC5nZXRTZWxlY3Rpb25zKCkpO1xuXG4gICAgLy8gVE9ETzogbGluZXMgY291bGQgYmUgZGlmZmVyZW50IGJlY2F1c2Ugb2YgZGVsZXRldGlvblxuICAgIGZvciAobGV0IGwgPSBmcm9tTGluZTsgbCA8PSB0b0xpbmU7IGwrKykge1xuICAgICAgY29uc3QgbGluZSA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShsKTtcbiAgICAgIGlmIChsaW5lICYmIGxpbmUuaXNGb2xkUm9vdCgpKSB7XG4gICAgICAgIChlZGl0b3IgYXMgYW55KS5mb2xkQ29kZShsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXREZWZhdWx0SW5kZW50Q2hhcnMoKSB7XG4gICAgY29uc3QgeyB1c2VUYWIsIHRhYlNpemUgfSA9IHRoaXMub2JzaWRpYW5TZXJ2aWNlLmdldE9ic2lkaWFuVGFic1NldHRpZ25zKCk7XG5cbiAgICByZXR1cm4gdXNlVGFiID8gXCJcXHRcIiA6IG5ldyBBcnJheSh0YWJTaXplKS5maWxsKFwiIFwiKS5qb2luKFwiXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0VtcHR5TGluZShsaW5lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbGluZS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBwcml2YXRlIGlzTGluZVdpdGhJbmRlbnQobGluZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZ1dpdGhTcGFjZXNSZS50ZXN0KGxpbmUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0xpc3RJdGVtKGxpbmU6IHN0cmluZykge1xuICAgIHJldHVybiBsaXN0SXRlbVJlLnRlc3QobGluZSk7XG4gIH1cblxuICBwcml2YXRlIGlzTGlzdEl0ZW1XaXRob3V0U3BhY2VzKGxpbmU6IHN0cmluZykge1xuICAgIHJldHVybiBsaXN0SXRlbVdpdGhvdXRTcGFjZXNSZS50ZXN0KGxpbmUpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIExvZ2dlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzU2VydmljZTogU2V0dGluZ3NTZXJ2aWNlKSB7fVxuXG4gIGxvZyhtZXRob2Q6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLmRlYnVnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKG1ldGhvZCwgLi4uYXJncyk7XG4gIH1cblxuICBiaW5kKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gdGhpcy5sb2cobWV0aG9kLCAuLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcblxuY29uc3QgU1RBVFVTX0JBUl9URVhUID0gYE91dGxpbmVyIHN0eWxlcyBvbmx5IHdvcmsgd2l0aCBmb3VyLXNwYWNlIHRhYnMuIFBsZWFzZSBjaGVjayBPYnNpZGlhbiBzZXR0aW5ncy5gO1xuXG5leHBvcnQgY2xhc3MgTGlzdHNTdHlsZXNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBwcml2YXRlIHN0YXR1c0JhclRleHQ6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGludGVydmFsOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblNlcnZpY2U6IE9ic2lkaWFuU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICBpZiAodGhpcy5zZXR0aW5nc1NlcnZpY2Uuc3R5bGVMaXN0cykge1xuICAgICAgdGhpcy5hZGRMaXN0c1N0eWxlcygpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLm9uQ2hhbmdlKFwic3R5bGVMaXN0c1wiLCB0aGlzLm9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2UpO1xuXG4gICAgdGhpcy5hZGRTdGF0dXNCYXJUZXh0KCk7XG4gICAgdGhpcy5zdGFydFN0YXR1c0JhckludGVydmFsKCk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUZXh0LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuc3RhdHVzQmFyVGV4dCk7XG4gICAgfVxuICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLnJlbW92ZUNhbGxiYWNrKFxuICAgICAgXCJzdHlsZUxpc3RzXCIsXG4gICAgICB0aGlzLm9uU3R5bGVMaXN0c1NldHRpbmdDaGFuZ2VcbiAgICApO1xuICAgIHRoaXMucmVtb3ZlTGlzdHNTdHlsZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRTdGF0dXNCYXJJbnRlcnZhbCgpIHtcbiAgICBsZXQgdmlzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBjb25zdCB7IHRhYlNpemUgfSA9XG4gICAgICAgIHRoaXMub2JzaWRpYW5TZXJ2aWNlLmdldE9ic2lkaWFuVGFic1NldHRpZ25zKCk7XG5cbiAgICAgIGNvbnN0IHNob3VsZEJlVmlzaWJsZSA9XG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLnN0eWxlTGlzdHMgJiZcbiAgICAgICAgISh0YWJTaXplID09PSA0KSAmJlxuICAgICAgICAhdGhpcy5zZXR0aW5nc1NlcnZpY2UuaGlkZVdhcm5pbmc7XG5cbiAgICAgIGlmIChzaG91bGRCZVZpc2libGUgJiYgIXZpc2libGUpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHZpc2libGUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICghc2hvdWxkQmVWaXNpYmxlICYmIHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgcHJpdmF0ZSBvblN0eWxlTGlzdHNTZXR0aW5nQ2hhbmdlID0gKHN0eWxlTGlzdHM6IGJvb2xlYW4pID0+IHtcbiAgICBpZiAoc3R5bGVMaXN0cykge1xuICAgICAgdGhpcy5hZGRMaXN0c1N0eWxlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUxpc3RzU3R5bGVzKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgYWRkU3RhdHVzQmFyVGV4dCgpIHtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQgPSB0aGlzLnBsdWdpbi5hZGRTdGF0dXNCYXJJdGVtKCk7XG4gICAgdGhpcy5zdGF0dXNCYXJUZXh0LnN0eWxlLmNvbG9yID0gXCJyZWRcIjtcbiAgICB0aGlzLnN0YXR1c0JhclRleHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5zZXRUZXh0KFNUQVRVU19CQVJfVEVYVCk7XG4gIH1cblxuICBwcml2YXRlIGFkZExpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZChcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUxpc3RzU3R5bGVzKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIm91dGxpbmVyLXBsdWdpbi1ibHNcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IExpc3QsIFJvb3QgfSBmcm9tIFwiLlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyhyb290OiBSb290KSB7XG4gIGZ1bmN0aW9uIHZpc2l0KHBhcmVudDogUm9vdCB8IExpc3QpIHtcbiAgICBsZXQgaW5kZXggPSAxO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBwYXJlbnQuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgaWYgKC9cXGQrXFwuLy50ZXN0KGNoaWxkLmdldEJ1bGxldCgpKSkge1xuICAgICAgICBjaGlsZC5yZXBsYXRlQnVsbGV0KGAke2luZGV4Kyt9LmApO1xuICAgICAgfVxuXG4gICAgICB2aXNpdChjaGlsZCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXQocm9vdCk7XG59XG4iLCJpbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcInNyYy9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVMZWZ0T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG5cbiAgICBpZiAoIWdyYW5kUGFyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVCZWZvcmUgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgaW5kZW50Um1Gcm9tID0gcGFyZW50LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcbiAgICBjb25zdCBpbmRlbnRSbVRpbGwgPSBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpLmxlbmd0aDtcblxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICBncmFuZFBhcmVudC5hZGRBZnRlcihwYXJlbnQsIGxpc3QpO1xuICAgIGxpc3QudW5pbmRlbnRDb250ZW50KGluZGVudFJtRnJvbSwgaW5kZW50Um1UaWxsKTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVBZnRlciA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcbiAgICBjb25zdCBsaW5lRGlmZiA9IGxpc3RTdGFydExpbmVBZnRlciAtIGxpc3RTdGFydExpbmVCZWZvcmU7XG4gICAgY29uc3QgY2hEaWZmID0gaW5kZW50Um1UaWxsIC0gaW5kZW50Um1Gcm9tO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2ggLSBjaERpZmYsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3gobGluZTogc3RyaW5nKSB7XG4gIHJldHVybiBsaW5lID09PSBcIlwiIHx8IGxpbmUgPT09IFwiWyBdIFwiO1xufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBNb3ZlTGVmdE9wZXJhdGlvbiB9IGZyb20gXCIuL01vdmVMZWZ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3ggfSBmcm9tIFwiLi4vdXRpbHMvaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3hcIjtcblxuZXhwb3J0IGNsYXNzIE91dGRlbnRJZkxpbmVJc0VtcHR5T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgbW92ZUxlZnRPcDogTW92ZUxlZnRPcGVyYXRpb247XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7XG4gICAgdGhpcy5tb3ZlTGVmdE9wID0gbmV3IE1vdmVMZWZ0T3BlcmF0aW9uKHJvb3QpO1xuICB9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1vdmVMZWZ0T3Auc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubW92ZUxlZnRPcC5zaG91bGRVcGRhdGUoKTtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzKCk7XG5cbiAgICBpZiAoXG4gICAgICBsaW5lcy5sZW5ndGggPiAxIHx8XG4gICAgICAhaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3gobGluZXNbMF0pIHx8XG4gICAgICBsaXN0LmdldExldmVsKCkgPT09IDFcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1vdmVMZWZ0T3AucGVyZm9ybSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9PdXRkZW50SWZMaW5lSXNFbXB0eU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgSU1FU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvSU1FU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0VudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxMyB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSxcbiAgICBwcml2YXRlIGltZVNlcnZpY2U6IElNRVNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLmJldHRlckVudGVyIHx8XG4gICAgICAhaXNFbnRlcihlKSB8fFxuICAgICAgdGhpcy5pbWVTZXJ2aWNlLmlzSU1FT3BlbmVkKClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgIChyb290KSA9PiBuZXcgT3V0ZGVudElmTGluZUlzRW1wdHlPcGVyYXRpb24ocm9vdCksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMgfSBmcm9tIFwic3JjL3Jvb3QvcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0c1wiO1xuaW1wb3J0IHsgaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3ggfSBmcm9tIFwic3JjL3V0aWxzL2lzRW1wdHlMaW5lT3JFbXB0eUNoZWNrYm94XCI7XG5pbXBvcnQgeyBMaXN0LCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBDcmVhdGVOZXdJdGVtT3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcblxuICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDEgJiYgaXNFbXB0eUxpbmVPckVtcHR5Q2hlY2tib3gobGluZXNbMF0udGV4dCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVVbmRlckN1cnNvciA9IGxpbmVzLmZpbmQoKGwpID0+IGwuZnJvbS5saW5lID09PSBjdXJzb3IubGluZSk7XG5cbiAgICBpZiAoY3Vyc29yLmNoIDwgbGluZVVuZGVyQ3Vyc29yLmZyb20uY2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG9sZExpbmVzLCBuZXdMaW5lcyB9ID0gbGluZXMucmVkdWNlKFxuICAgICAgKGFjYywgbGluZSkgPT4ge1xuICAgICAgICBpZiAoY3Vyc29yLmxpbmUgPiBsaW5lLmZyb20ubGluZSkge1xuICAgICAgICAgIGFjYy5vbGRMaW5lcy5wdXNoKGxpbmUudGV4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yLmxpbmUgPT09IGxpbmUuZnJvbS5saW5lKSB7XG4gICAgICAgICAgY29uc3QgYSA9IGxpbmUudGV4dC5zbGljZSgwLCBjdXJzb3IuY2ggLSBsaW5lLmZyb20uY2gpO1xuICAgICAgICAgIGNvbnN0IGIgPSBsaW5lLnRleHQuc2xpY2UoY3Vyc29yLmNoIC0gbGluZS5mcm9tLmNoKTtcbiAgICAgICAgICBhY2Mub2xkTGluZXMucHVzaChhKTtcbiAgICAgICAgICBhY2MubmV3TGluZXMucHVzaChiKTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IubGluZSA8IGxpbmUuZnJvbS5saW5lKSB7XG4gICAgICAgICAgYWNjLm5ld0xpbmVzLnB1c2gobGluZS50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvbGRMaW5lczogW10sXG4gICAgICAgIG5ld0xpbmVzOiBbXSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgY29kZUJsb2NrQmFjdGlja3MgPSBvbGRMaW5lcy5qb2luKFwiXFxuXCIpLnNwbGl0KFwiYGBgXCIpLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgaXNJbnNpZGVDb2RlYmxvY2sgPVxuICAgICAgY29kZUJsb2NrQmFjdGlja3MgPiAwICYmIGNvZGVCbG9ja0JhY3RpY2tzICUgMiAhPT0gMDtcblxuICAgIGlmIChpc0luc2lkZUNvZGVibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgZW5kUG9zID0gbGlzdC5nZXRMYXN0TGluZUNvbnRlbnRFbmQoKTtcbiAgICBjb25zdCBvbkNoaWxkTGV2ZWwgPVxuICAgICAgIWxpc3QuaXNFbXB0eSgpICYmIGN1cnNvci5saW5lID09PSBlbmRQb3MubGluZSAmJiBjdXJzb3IuY2ggPT09IGVuZFBvcy5jaDtcblxuICAgIGNvbnN0IGluZGVudCA9IG9uQ2hpbGRMZXZlbFxuICAgICAgPyBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0Rmlyc3RMaW5lSW5kZW50KClcbiAgICAgIDogbGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKTtcblxuICAgIGNvbnN0IGJ1bGxldCA9IG9uQ2hpbGRMZXZlbFxuICAgICAgPyBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0QnVsbGV0KClcbiAgICAgIDogbGlzdC5nZXRCdWxsZXQoKTtcblxuICAgIGNvbnN0IHByZWZpeCA9IG9sZExpbmVzWzBdLm1hdGNoKC9eXFxbWyB4XVxcXS8pID8gXCJbIF0gXCIgOiBcIlwiO1xuXG4gICAgY29uc3QgbmV3TGlzdCA9IG5ldyBMaXN0KFxuICAgICAgbGlzdC5nZXRSb290KCksXG4gICAgICBpbmRlbnQsXG4gICAgICBidWxsZXQsXG4gICAgICBwcmVmaXggKyBuZXdMaW5lcy5zaGlmdCgpLFxuICAgICAgZmFsc2VcbiAgICApO1xuXG4gICAgaWYgKG5ld0xpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5ld0xpc3Quc2V0Tm90ZXNJbmRlbnQobGlzdC5nZXROb3Rlc0luZGVudCgpKTtcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBuZXdMaW5lcykge1xuICAgICAgICBuZXdMaXN0LmFkZExpbmUobGluZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9uQ2hpbGRMZXZlbCkge1xuICAgICAgbGlzdC5hZGRCZWZvcmVBbGwobmV3TGlzdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gbGlzdC5nZXRDaGlsZHJlbigpO1xuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICBsaXN0LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgICAgbmV3TGlzdC5hZGRBZnRlckFsbChjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIGxpc3QuZ2V0UGFyZW50KCkuYWRkQWZ0ZXIobGlzdCwgbmV3TGlzdCk7XG4gICAgfVxuXG4gICAgbGlzdC5yZXBsYWNlTGluZXMob2xkTGluZXMpO1xuXG4gICAgY29uc3QgbmV3TGlzdFN0YXJ0ID0gbmV3TGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogbmV3TGlzdFN0YXJ0LmxpbmUsXG4gICAgICBjaDogbmV3TGlzdFN0YXJ0LmNoICsgcHJlZml4Lmxlbmd0aCxcbiAgICB9KTtcblxuICAgIHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMocm9vdCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBDcmVhdGVOZXdJdGVtT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvQ3JlYXRlTmV3SXRlbU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgSU1FU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvSU1FU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0VudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxMyB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1GZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW1lU2VydmljZTogSU1FU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uS2V5RG93biA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IsIGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5zZXR0aW5nc1NlcnZpY2UuYmV0dGVyRW50ZXIgfHxcbiAgICAgICFpc0VudGVyKGUpIHx8XG4gICAgICB0aGlzLmltZVNlcnZpY2UuaXNJTUVPcGVuZWQoKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBDcmVhdGVOZXdJdGVtT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgY21cbiAgICApO1xuXG4gICAgaWYgKHNob3VsZFN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBJTGlzdExpbmUsIFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLnJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gdGhpcy5yb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoXG4gICAgICAobCkgPT4gY3Vyc29yLmNoID09PSBsLmZyb20uY2ggJiYgY3Vyc29yLmxpbmUgPT09IGwuZnJvbS5saW5lXG4gICAgKTtcblxuICAgIGlmIChsaW5lTm8gPT09IDApIHtcbiAgICAgIHRoaXMubW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZEl0ZW0ocm9vdCwgY3Vyc29yKTtcbiAgICB9IGVsc2UgaWYgKGxpbmVObyA+IDApIHtcbiAgICAgIHRoaXMubW92ZUN1cnNvclRvUHJldmlvdXNOb3RlTGluZShyb290LCBsaW5lcywgbGluZU5vKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1vdmVDdXJzb3JUb1ByZXZpb3VzTm90ZUxpbmUoXG4gICAgcm9vdDogUm9vdCxcbiAgICBsaW5lczogSUxpc3RMaW5lW10sXG4gICAgbGluZU5vOiBudW1iZXJcbiAgKSB7XG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICByb290LnJlcGxhY2VDdXJzb3IobGluZXNbbGluZU5vIC0gMV0udG8pO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkSXRlbShyb290OiBSb290LCBjdXJzb3I6IElQb3NpdGlvbikge1xuICAgIGNvbnN0IHByZXYgPSByb290LmdldExpc3RVbmRlckxpbmUoY3Vyc29yLmxpbmUgLSAxKTtcblxuICAgIGlmICghcHJldikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgaWYgKHByZXYuaXNGb2xkZWQoKSkge1xuICAgICAgbGV0IGZvbGRSb290ID0gcHJldjtcbiAgICAgIHdoaWxlICghZm9sZFJvb3QuaXNGb2xkUm9vdCgpKSB7XG4gICAgICAgIGZvbGRSb290ID0gZm9sZFJvb3QuZ2V0UGFyZW50KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpcnN0TGluZUVuZCA9IGZvbGRSb290LmdldExpbmVzSW5mbygpWzBdLnRvO1xuICAgICAgcm9vdC5yZXBsYWNlQ3Vyc29yKGZpcnN0TGluZUVuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcihwcmV2LmdldExhc3RMaW5lQ29udGVudEVuZCgpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsYXRmb3JtLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL0xpc3RzU2VydmljZVwiO1xuaW1wb3J0IHsgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9Nb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgSU1FU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvSU1FU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0Fycm93TGVmdChlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gMzcgfHwgZS5jb2RlID09PSBcIkFycm93TGVmdFwiKSAmJlxuICAgIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNDdHJsQXJyb3dMZWZ0KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAzNyB8fCBlLmNvZGUgPT09IFwiQXJyb3dMZWZ0XCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSB0cnVlXG4gICk7XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlQ3Vyc29yVG9QcmV2aW91c1VuZm9sZGVkTGluZUZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIHNldHRpbmdzU2VydmljZTogU2V0dGluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgbGlzdHNTZXJ2aWNlOiBMaXN0c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWVTZXJ2aWNlOiBJTUVTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLnN0aWNrQ3Vyc29yIHx8IHRoaXMuaW1lU2VydmljZS5pc0lNRU9wZW5lZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzQXJyb3dMZWZ0KGV2ZW50KSB8fCAoIVBsYXRmb3JtLmlzTWFjT1MgJiYgaXNDdHJsQXJyb3dMZWZ0KGV2ZW50KSkpIHtcbiAgICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgICAocm9vdCkgPT4gbmV3IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lT3BlcmF0aW9uKHJvb3QpLFxuICAgICAgICBjbVxuICAgICAgKTtcblxuICAgICAgaWYgKHNob3VsZFN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgY29uc3QgY29udGVudFN0YXJ0ID0gbGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKTtcbiAgICBjb25zdCBsaW5lUHJlZml4ID1cbiAgICAgIGNvbnRlbnRTdGFydC5saW5lID09PSBjdXJzb3IubGluZVxuICAgICAgICA/IGNvbnRlbnRTdGFydC5jaFxuICAgICAgICA6IGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKS5sZW5ndGg7XG5cbiAgICBpZiAoY3Vyc29yLmNoIDwgbGluZVByZWZpeCkge1xuICAgICAgdGhpcy51cGRhdGVkID0gdHJ1ZTtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICAgIGxpbmU6IGN1cnNvci5saW5lLFxuICAgICAgICBjaDogbGluZVByZWZpeCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuXG4gICAgY29uc3QgbGlzdCA9IHJvb3QuZ2V0TGlzdFVuZGVyQ3Vyc29yKCk7XG4gICAgaWYgKCFsaXN0LmlzRm9sZGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZm9sZFJvb3QgPSBsaXN0O1xuICAgIHdoaWxlICghZm9sZFJvb3QuaXNGb2xkUm9vdCgpKSB7XG4gICAgICBmb2xkUm9vdCA9IGZvbGRSb290LmdldFBhcmVudCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpcnN0TGluZUVuZCA9IGZvbGRSb290LmdldExpbmVzSW5mbygpWzBdLnRvO1xuXG4gICAgaWYgKGN1cnNvci5saW5lID4gZmlyc3RMaW5lRW5kLmxpbmUpIHtcbiAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IoZmlyc3RMaW5lRW5kKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgRW5zdXJlQ3Vyc29ySXNJblVuZm9sZGVkTGluZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0Vuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcblxuZXhwb3J0IGNsYXNzIEVuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwiY3Vyc29yQWN0aXZpdHlcIiwgdGhpcy5oYW5kbGVDdXJzb3JBY3Rpdml0eSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJjdXJzb3JBY3Rpdml0eVwiLCB0aGlzLmhhbmRsZUN1cnNvckFjdGl2aXR5KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ3Vyc29yQWN0aXZpdHkgPSAoY206IENvZGVNaXJyb3IuRWRpdG9yKSA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzU2VydmljZS5zdGlja0N1cnNvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAocm9vdCkgPT4gbmV3IEVuc3VyZUN1cnNvcklzSW5VbmZvbGRlZExpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50T3BlcmF0aW9uKHJvb3QpLFxuICAgICAgY21cbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyB9IGZyb20gXCJzcmMvcm9vdC9yZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzXCI7XG5pbXBvcnQgeyBJTGlzdExpbmUsIExpc3QsIFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcblxuICAgIGNvbnN0IGxpbmVObyA9IGxpbmVzLmZpbmRJbmRleChcbiAgICAgIChsKSA9PiBjdXJzb3IuY2ggPT09IGwuZnJvbS5jaCAmJiBjdXJzb3IubGluZSA9PT0gbC5mcm9tLmxpbmVcbiAgICApO1xuXG4gICAgaWYgKGxpbmVObyA9PT0gMCkge1xuICAgICAgdGhpcy5tZXJnZVdpdGhQcmV2aW91c0l0ZW0ocm9vdCwgY3Vyc29yLCBsaXN0KTtcbiAgICB9IGVsc2UgaWYgKGxpbmVObyA+IDApIHtcbiAgICAgIHRoaXMubWVyZ2VOb3Rlcyhyb290LCBjdXJzb3IsIGxpc3QsIGxpbmVzLCBsaW5lTm8pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VOb3RlcyhcbiAgICByb290OiBSb290LFxuICAgIGN1cnNvcjogSVBvc2l0aW9uLFxuICAgIGxpc3Q6IExpc3QsXG4gICAgbGluZXM6IElMaXN0TGluZVtdLFxuICAgIGxpbmVObzogbnVtYmVyXG4gICkge1xuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgY29uc3QgcHJldkxpbmVObyA9IGxpbmVObyAtIDE7XG5cbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgLSAxLFxuICAgICAgY2g6IGxpbmVzW3ByZXZMaW5lTm9dLnRleHQubGVuZ3RoICsgbGluZXNbcHJldkxpbmVOb10uZnJvbS5jaCxcbiAgICB9KTtcblxuICAgIGxpbmVzW3ByZXZMaW5lTm9dLnRleHQgKz0gbGluZXNbbGluZU5vXS50ZXh0O1xuICAgIGxpbmVzLnNwbGljZShsaW5lTm8sIDEpO1xuXG4gICAgbGlzdC5yZXBsYWNlTGluZXMobGluZXMubWFwKChsKSA9PiBsLnRleHQpKTtcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VXaXRoUHJldmlvdXNJdGVtKHJvb3Q6IFJvb3QsIGN1cnNvcjogSVBvc2l0aW9uLCBsaXN0OiBMaXN0KSB7XG4gICAgaWYgKHJvb3QuZ2V0Q2hpbGRyZW4oKVswXSA9PT0gbGlzdCAmJiBsaXN0LmdldENoaWxkcmVuKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuXG4gICAgY29uc3QgcHJldiA9IHJvb3QuZ2V0TGlzdFVuZGVyTGluZShjdXJzb3IubGluZSAtIDEpO1xuXG4gICAgaWYgKCFwcmV2KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYm90aEFyZUVtcHR5ID0gcHJldi5pc0VtcHR5KCkgJiYgbGlzdC5pc0VtcHR5KCk7XG4gICAgY29uc3QgcHJldklzRW1wdHlBbmRTYW1lTGV2ZWwgPVxuICAgICAgcHJldi5pc0VtcHR5KCkgJiYgIWxpc3QuaXNFbXB0eSgpICYmIHByZXYuZ2V0TGV2ZWwoKSA9PSBsaXN0LmdldExldmVsKCk7XG4gICAgY29uc3QgbGlzdElzRW1wdHlBbmRQcmV2SXNQYXJlbnQgPVxuICAgICAgbGlzdC5pc0VtcHR5KCkgJiYgcHJldi5nZXRMZXZlbCgpID09IGxpc3QuZ2V0TGV2ZWwoKSAtIDE7XG5cbiAgICBpZiAoYm90aEFyZUVtcHR5IHx8IHByZXZJc0VtcHR5QW5kU2FtZUxldmVsIHx8IGxpc3RJc0VtcHR5QW5kUHJldklzUGFyZW50KSB7XG4gICAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgICAgY29uc3QgcHJldkVuZCA9IHByZXYuZ2V0TGFzdExpbmVDb250ZW50RW5kKCk7XG5cbiAgICAgIGlmICghcHJldi5nZXROb3Rlc0luZGVudCgpICYmIGxpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgICBwcmV2LnNldE5vdGVzSW5kZW50KFxuICAgICAgICAgIHByZXYuZ2V0Rmlyc3RMaW5lSW5kZW50KCkgK1xuICAgICAgICAgICAgbGlzdC5nZXROb3Rlc0luZGVudCgpLnNsaWNlKGxpc3QuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRMaW5lcyA9IHByZXYuZ2V0TGluZXMoKTtcbiAgICAgIGNvbnN0IG5ld0xpbmVzID0gbGlzdC5nZXRMaW5lcygpO1xuICAgICAgb2xkTGluZXNbb2xkTGluZXMubGVuZ3RoIC0gMV0gKz0gbmV3TGluZXNbMF07XG4gICAgICBjb25zdCByZXN1bHRMaW5lcyA9IG9sZExpbmVzLmNvbmNhdChuZXdMaW5lcy5zbGljZSgxKSk7XG5cbiAgICAgIHByZXYucmVwbGFjZUxpbmVzKHJlc3VsdExpbmVzKTtcbiAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcblxuICAgICAgZm9yIChjb25zdCBjIG9mIGxpc3QuZ2V0Q2hpbGRyZW4oKSkge1xuICAgICAgICBsaXN0LnJlbW92ZUNoaWxkKGMpO1xuICAgICAgICBwcmV2LmFkZEFmdGVyQWxsKGMpO1xuICAgICAgfVxuXG4gICAgICByb290LnJlcGxhY2VDdXJzb3IocHJldkVuZCk7XG5cbiAgICAgIHJlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHMocm9vdCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IERlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbiB9IGZyb20gXCIuL0RlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvblwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lT3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXM6IERlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzTGluZU9wZXJhdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHtcbiAgICB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzID1cbiAgICAgIG5ldyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24ocm9vdCk7XG4gIH1cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMuc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQW5kTWVyZ2VXaXRoUHJldmlvdXMuc2hvdWxkVXBkYXRlKCk7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgY29uc3QgbGluZXMgPSBsaXN0LmdldExpbmVzSW5mbygpO1xuXG4gICAgY29uc3QgbGluZU5vID0gbGluZXMuZmluZEluZGV4KFxuICAgICAgKGwpID0+IGN1cnNvci5jaCA9PT0gbC50by5jaCAmJiBjdXJzb3IubGluZSA9PT0gbC50by5saW5lXG4gICAgKTtcblxuICAgIGlmIChsaW5lTm8gPT09IGxpbmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIGNvbnN0IG5leHRMaW5lID0gbGluZXNbbGluZU5vXS50by5saW5lICsgMTtcbiAgICAgIGNvbnN0IG5leHRMaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJMaW5lKG5leHRMaW5lKTtcbiAgICAgIHJvb3QucmVwbGFjZUN1cnNvcihuZXh0TGlzdC5nZXRGaXJzdExpbmVDb250ZW50U3RhcnQoKSk7XG4gICAgICB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzLnBlcmZvcm0oKTtcbiAgICB9IGVsc2UgaWYgKGxpbmVObyA+PSAwKSB7XG4gICAgICByb290LnJlcGxhY2VDdXJzb3IobGluZXNbbGluZU5vICsgMV0uZnJvbSk7XG4gICAgICB0aGlzLmRlbGV0ZUFuZE1lcmdlV2l0aFByZXZpb3VzLnBlcmZvcm0oKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIERlbGV0ZVRpbGxMaW5lU3RhcnRPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoKGwpID0+IGwuZnJvbS5saW5lID09PSBjdXJzb3IubGluZSk7XG5cbiAgICBsaW5lc1tsaW5lTm9dLnRleHQgPSBsaW5lc1tsaW5lTm9dLnRleHQuc2xpY2UoXG4gICAgICBjdXJzb3IuY2ggLSBsaW5lc1tsaW5lTm9dLmZyb20uY2hcbiAgICApO1xuXG4gICAgbGlzdC5yZXBsYWNlTGluZXMobGluZXMubWFwKChsKSA9PiBsLnRleHQpKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3IobGluZXNbbGluZU5vXS5mcm9tKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGxhdGZvcm0sIFBsdWdpbl8yIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBMaXN0c1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XG5pbXBvcnQgeyBEZWxldGVBbmRNZXJnZVdpdGhOZXh0TGluZU9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL0RlbGV0ZUFuZE1lcmdlV2l0aE5leHRMaW5lT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9EZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IERlbGV0ZVRpbGxMaW5lU3RhcnRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9EZWxldGVUaWxsTGluZVN0YXJ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcInNyYy9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XG5cbmZ1bmN0aW9uIGlzQmFja3NwYWNlKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSA4IHx8IGUuY29kZSA9PT0gXCJCYWNrc3BhY2VcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzQ21kQmFja3NwYWNlKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSA4IHx8IGUuY29kZSA9PT0gXCJCYWNrc3BhY2VcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gdHJ1ZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNEZWxldGUoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDQ2IHx8IGUuY29kZSA9PT0gXCJEZWxldGVcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmV4cG9ydCBjbGFzcyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSxcbiAgICBwcml2YXRlIGltZVNlcnZpY2U6IElNRVNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmICghdGhpcy5zZXR0aW5nc1NlcnZpY2Uuc3RpY2tDdXJzb3IgfHwgdGhpcy5pbWVTZXJ2aWNlLmlzSU1FT3BlbmVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNCYWNrc3BhY2UoZXZlbnQpKSB7XG4gICAgICBjb25zdCB7IHNob3VsZFN0b3BQcm9wYWdhdGlvbiB9ID0gdGhpcy5saXN0c1NlcnZpY2UucGVyZm9ybU9wZXJhdGlvbihcbiAgICAgICAgKHJvb3QpID0+IG5ldyBEZWxldGVBbmRNZXJnZVdpdGhQcmV2aW91c0xpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICAgIGNtXG4gICAgICApO1xuXG4gICAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChQbGF0Zm9ybS5pc01hY09TICYmIGlzQ21kQmFja3NwYWNlKGV2ZW50KSkge1xuICAgICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlVGlsbExpbmVTdGFydE9wZXJhdGlvbihyb290KSxcbiAgICAgICAgY21cbiAgICAgICk7XG5cbiAgICAgIGlmIChzaG91bGRTdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRGVsZXRlKGV2ZW50KSkge1xuICAgICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAgIChyb290KSA9PiBuZXcgRGVsZXRlQW5kTWVyZ2VXaXRoTmV4dExpbmVPcGVyYXRpb24ocm9vdCksXG4gICAgICAgIGNtXG4gICAgICApO1xuXG4gICAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBjdXJzb3IgPSByb290LmdldEN1cnNvcigpO1xuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGxpbmVzID0gbGlzdC5nZXRMaW5lc0luZm8oKTtcbiAgICBjb25zdCBsaW5lTm8gPSBsaW5lcy5maW5kSW5kZXgoKGwpID0+IGwuZnJvbS5saW5lID09PSBjdXJzb3IubGluZSk7XG5cbiAgICByb290LnJlcGxhY2VTZWxlY3Rpb25zKFt7IGhlYWQ6IGxpbmVzW2xpbmVOb10uZnJvbSwgYW5jaG9yOiBjdXJzb3IgfV0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNlbGVjdFRpbGxMaW5lU3RhcnRPcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9TZWxlY3RUaWxsTGluZVN0YXJ0T3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5pbXBvcnQgeyBTZXR0aW5nc1NlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcInNyYy9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XG5cbmZ1bmN0aW9uIGlzQ21kU2hpZnRMZWZ0KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAzNyB8fCBlLmNvZGUgPT09IFwiQXJyb3dMZWZ0XCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gdHJ1ZSAmJlxuICAgIGUubWV0YUtleSA9PT0gdHJ1ZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvblNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW1lU2VydmljZTogSU1FU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5yZWdpc3RlckNvZGVNaXJyb3IoKGNtKSA9PiB7XG4gICAgICBjbS5vbihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuaXRlcmF0ZUNvZGVNaXJyb3JzKChjbSkgPT4ge1xuICAgICAgY20ub2ZmKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uS2V5RG93biA9IChjbTogQ29kZU1pcnJvci5FZGl0b3IsIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzU2VydmljZS5zdGlja0N1cnNvciB8fCB0aGlzLmltZVNlcnZpY2UuaXNJTUVPcGVuZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChQbGF0Zm9ybS5pc01hY09TICYmIGlzQ21kU2hpZnRMZWZ0KGV2ZW50KSkge1xuICAgICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAgIChyb290KSA9PiBuZXcgU2VsZWN0VGlsbExpbmVTdGFydE9wZXJhdGlvbihyb290KSxcbiAgICAgICAgY21cbiAgICAgICk7XG5cbiAgICAgIGlmIChzaG91bGRTdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwic3JjL3NlcnZpY2VzL0lNRVNlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvU2V0dGluZ3NTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJRmVhdHVyZSB9IGZyb20gXCIuL0lGZWF0dXJlXCI7XG5cbmZ1bmN0aW9uIGlzQ21kRG90T3JDbWRTaGlmdERvdChlOiBLZXlib2FyZEV2ZW50KSB7XG4gIHJldHVybiAoXG4gICAgKGUua2V5Q29kZSA9PT0gMTkwIHx8IGUuY29kZSA9PT0gXCJQZXJpb2RcIikgJiZcbiAgICBlLm1ldGFLZXkgPT09IHRydWUgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzQ3RybERvdE9yQ3RybFNoaWZ0RG90KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxOTAgfHwgZS5jb2RlID09PSBcIlBlcmlvZFwiKSAmJlxuICAgIGUubWV0YUtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IHRydWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNNb2REb3RPck1vZFNoaWZ0RG90KGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIFBsYXRmb3JtLmlzTWFjT1NcbiAgICA/IGlzQ21kRG90T3JDbWRTaGlmdERvdChlKVxuICAgIDogaXNDdHJsRG90T3JDdHJsU2hpZnREb3QoZSk7XG59XG5cbmV4cG9ydCBjbGFzcyBab29tRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBpbWVTZXJ2aWNlOiBJTUVTZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLnJlZ2lzdGVyQ29kZU1pcnJvcigoY20pID0+IHtcbiAgICAgIGNtLm9uKFwia2V5ZG93blwiLCB0aGlzLm9uS2V5RG93bik7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1bmxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5pdGVyYXRlQ29kZU1pcnJvcnMoKGNtKSA9PiB7XG4gICAgICBjbS5vZmYoXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25LZXlEb3duID0gKGNtOiBDb2RlTWlycm9yLkVkaXRvciwgZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChcbiAgICAgICh3aW5kb3cgYXMgYW55KS5PYnNpZGlhblpvb21QbHVnaW4gfHxcbiAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLmRpc2FibGVab29tTm90aWZpY2F0aW9uIHx8XG4gICAgICAhaXNNb2REb3RPck1vZFNoaWZ0RG90KGUpIHx8XG4gICAgICB0aGlzLmltZVNlcnZpY2UuaXNJTUVPcGVuZWQoKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgWm9vbWluZyBzdXBwb3J0IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgT2JzaWRpYW4gT3V0bGluZXIgcGx1Z2luLiBQbGVhc2UgaW5zdGFsbCB0aGUgT2JzaWRpYW4gWm9vbSBwbHVnaW4uYCxcbiAgICAgIDUwMDBcbiAgICApO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgTm90aWNlLCBQbHVnaW5fMiB9IGZyb20gXCJvYnNpZGlhblwiO1xuaW1wb3J0IHsgT2JzaWRpYW5TZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL09ic2lkaWFuU2VydmljZVwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuXG5leHBvcnQgY2xhc3MgRm9sZEZlYXR1cmUgaW1wbGVtZW50cyBJRmVhdHVyZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW5fMixcbiAgICBwcml2YXRlIG9ic2lkaWFuU2VydmljZTogT2JzaWRpYW5TZXJ2aWNlXG4gICkge31cblxuICBhc3luYyBsb2FkKCkge1xuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiZm9sZFwiLFxuICAgICAgbmFtZTogXCJGb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLmZvbGQuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCJdLFxuICAgICAgICAgIGtleTogXCJBcnJvd1VwXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJ1bmZvbGRcIixcbiAgICAgIG5hbWU6IFwiVW5mb2xkIHRoZSBsaXN0XCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLnVuZm9sZC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJNb2RcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHt9XG5cbiAgcHJpdmF0ZSBzZXRGb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IsIHR5cGU6IFwiZm9sZFwiIHwgXCJ1bmZvbGRcIikge1xuICAgIGlmICghdGhpcy5vYnNpZGlhblNlcnZpY2UuZ2V0T2JzaWRpYW5Gb2xkU2V0dGlnbnMoKS5mb2xkSW5kZW50KSB7XG4gICAgICBuZXcgTm90aWNlKFxuICAgICAgICBgVW5hYmxlIHRvICR7dHlwZX0gYmVjYXVzZSBmb2xkaW5nIGlzIGRpc2FibGVkLiBQbGVhc2UgZW5hYmxlIFwiRm9sZCBpbmRlbnRcIiBpbiBPYnNpZGlhbiBzZXR0aW5ncy5gLFxuICAgICAgICA1MDAwXG4gICAgICApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgKGVkaXRvciBhcyBhbnkpLmZvbGRDb2RlKGVkaXRvci5nZXRDdXJzb3IoKSwgbnVsbCwgdHlwZSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZm9sZChlZGl0b3I6IENvZGVNaXJyb3IuRWRpdG9yKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0Rm9sZChlZGl0b3IsIFwiZm9sZFwiKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5mb2xkKGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRGb2xkKGVkaXRvciwgXCJ1bmZvbGRcIik7XG4gIH1cbn1cbiIsImltcG9ydCB7IG1heFBvcywgbWluUG9zLCBSb290IH0gZnJvbSBcIi4uL3Jvb3RcIjtcbmltcG9ydCB7IElPcGVyYXRpb24gfSBmcm9tIFwiLi9JT3BlcmF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RBbGxPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290KSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZVNlbGVjdGlvbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gcm9vdC5nZXRTZWxlY3Rpb25zKClbMF07XG4gICAgY29uc3QgW3Jvb3RTdGFydCwgcm9vdEVuZF0gPSByb290LmdldFJhbmdlKCk7XG5cbiAgICBjb25zdCBzZWxlY3Rpb25Gcm9tID0gbWluUG9zKHNlbGVjdGlvbi5hbmNob3IsIHNlbGVjdGlvbi5oZWFkKTtcbiAgICBjb25zdCBzZWxlY3Rpb25UbyA9IG1heFBvcyhzZWxlY3Rpb24uYW5jaG9yLCBzZWxlY3Rpb24uaGVhZCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3Rpb25Gcm9tLmxpbmUgPCByb290U3RhcnQubGluZSB8fFxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA+IHJvb3RFbmQubGluZVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGlvbkZyb20ubGluZSA9PT0gcm9vdFN0YXJ0LmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvbkZyb20uY2ggPT09IHJvb3RTdGFydC5jaCAmJlxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA9PT0gcm9vdEVuZC5saW5lICYmXG4gICAgICBzZWxlY3Rpb25Uby5jaCA9PT0gcm9vdEVuZC5jaFxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IGNvbnRlbnRTdGFydCA9IGxpc3QuZ2V0Rmlyc3RMaW5lQ29udGVudFN0YXJ0KCk7XG4gICAgY29uc3QgY29udGVudEVuZCA9IGxpc3QuZ2V0TGFzdExpbmVDb250ZW50RW5kKCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3Rpb25Gcm9tLmxpbmUgPCBjb250ZW50U3RhcnQubGluZSB8fFxuICAgICAgc2VsZWN0aW9uVG8ubGluZSA+IGNvbnRlbnRFbmQubGluZVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0aW9uRnJvbS5saW5lID09PSBjb250ZW50U3RhcnQubGluZSAmJlxuICAgICAgc2VsZWN0aW9uRnJvbS5jaCA9PT0gY29udGVudFN0YXJ0LmNoICYmXG4gICAgICBzZWxlY3Rpb25Uby5saW5lID09PSBjb250ZW50RW5kLmxpbmUgJiZcbiAgICAgIHNlbGVjdGlvblRvLmNoID09PSBjb250ZW50RW5kLmNoXG4gICAgKSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpc3RcbiAgICAgIHJvb3QucmVwbGFjZVNlbGVjdGlvbnMoW3sgYW5jaG9yOiByb290U3RhcnQsIGhlYWQ6IHJvb3RFbmQgfV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIGxpbmVcbiAgICAgIHJvb3QucmVwbGFjZVNlbGVjdGlvbnMoW3sgYW5jaG9yOiBjb250ZW50U3RhcnQsIGhlYWQ6IGNvbnRlbnRFbmQgfV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbGF0Zm9ybSwgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNlbGVjdEFsbE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL1NlbGVjdEFsbE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgU2V0dGluZ3NTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1NldHRpbmdzU2VydmljZVwiO1xuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9JRmVhdHVyZVwiO1xuaW1wb3J0IHsgSU1FU2VydmljZSB9IGZyb20gXCJzcmMvc2VydmljZXMvSU1FU2VydmljZVwiO1xuXG5mdW5jdGlvbiBpc0NtZEEoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDY1IHx8IGUuY29kZSA9PT0gXCJLZXlBXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IHRydWUgJiZcbiAgICBlLmFsdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLmN0cmxLZXkgPT09IGZhbHNlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzQ3RybEEoZTogS2V5Ym9hcmRFdmVudCkge1xuICByZXR1cm4gKFxuICAgIChlLmtleUNvZGUgPT09IDY1IHx8IGUuY29kZSA9PT0gXCJLZXlBXCIpICYmXG4gICAgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiZcbiAgICBlLm1ldGFLZXkgPT09IGZhbHNlICYmXG4gICAgZS5hbHRLZXkgPT09IGZhbHNlICYmXG4gICAgZS5jdHJsS2V5ID09PSB0cnVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzU2VsZWN0QWxsKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIFBsYXRmb3JtLmlzTWFjT1MgPyBpc0NtZEEoZSkgOiBpc0N0cmxBKGUpO1xufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0QWxsRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSxcbiAgICBwcml2YXRlIGltZVNlcnZpY2U6IElNRVNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgIGlmIChcbiAgICAgICF0aGlzLnNldHRpbmdzU2VydmljZS5zZWxlY3RBbGwgfHxcbiAgICAgICFpc1NlbGVjdEFsbChldmVudCkgfHxcbiAgICAgIHRoaXMuaW1lU2VydmljZS5pc0lNRU9wZW5lZCgpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBzaG91bGRTdG9wUHJvcGFnYXRpb24gfSA9IHRoaXMubGlzdHNTZXJ2aWNlLnBlcmZvcm1PcGVyYXRpb24oXG4gICAgICAocm9vdCkgPT4gbmV3IFNlbGVjdEFsbE9wZXJhdGlvbihyb290KSxcbiAgICAgIGNtXG4gICAgKTtcblxuICAgIGlmIChzaG91bGRTdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcInNyYy9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVSaWdodE9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QsIHByaXZhdGUgZGVmYXVsdEluZGVudENoYXJzOiBzdHJpbmcpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IHByZXYgPSBwYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihsaXN0KTtcblxuICAgIGlmICghcHJldikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQmVmb3JlID0gcm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKGxpc3QpWzBdO1xuXG4gICAgY29uc3QgaW5kZW50UG9zID0gbGlzdC5nZXRGaXJzdExpbmVJbmRlbnQoKS5sZW5ndGg7XG4gICAgbGV0IGluZGVudENoYXJzID0gXCJcIjtcblxuICAgIGlmIChpbmRlbnRDaGFycyA9PT0gXCJcIiAmJiAhcHJldi5pc0VtcHR5KCkpIHtcbiAgICAgIGluZGVudENoYXJzID0gcHJldlxuICAgICAgICAuZ2V0Q2hpbGRyZW4oKVswXVxuICAgICAgICAuZ2V0Rmlyc3RMaW5lSW5kZW50KClcbiAgICAgICAgLnNsaWNlKHByZXYuZ2V0Rmlyc3RMaW5lSW5kZW50KCkubGVuZ3RoKTtcbiAgICB9XG5cbiAgICBpZiAoaW5kZW50Q2hhcnMgPT09IFwiXCIpIHtcbiAgICAgIGluZGVudENoYXJzID0gbGlzdFxuICAgICAgICAuZ2V0Rmlyc3RMaW5lSW5kZW50KClcbiAgICAgICAgLnNsaWNlKHBhcmVudC5nZXRGaXJzdExpbmVJbmRlbnQoKS5sZW5ndGgpO1xuICAgIH1cblxuICAgIGlmIChpbmRlbnRDaGFycyA9PT0gXCJcIiAmJiAhbGlzdC5pc0VtcHR5KCkpIHtcbiAgICAgIGluZGVudENoYXJzID0gbGlzdC5nZXRDaGlsZHJlbigpWzBdLmdldEZpcnN0TGluZUluZGVudCgpO1xuICAgIH1cblxuICAgIGlmIChpbmRlbnRDaGFycyA9PT0gXCJcIikge1xuICAgICAgaW5kZW50Q2hhcnMgPSB0aGlzLmRlZmF1bHRJbmRlbnRDaGFycztcbiAgICB9XG5cbiAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgcHJldi5hZGRBZnRlckFsbChsaXN0KTtcbiAgICBsaXN0LmluZGVudENvbnRlbnQoaW5kZW50UG9zLCBpbmRlbnRDaGFycyk7XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQWZ0ZXIgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgbGluZURpZmYgPSBsaXN0U3RhcnRMaW5lQWZ0ZXIgLSBsaXN0U3RhcnRMaW5lQmVmb3JlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2ggKyBpbmRlbnRDaGFycy5sZW5ndGgsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcInNyYy9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVEb3duT3BlcmF0aW9uIGltcGxlbWVudHMgSU9wZXJhdGlvbiB7XG4gIHByaXZhdGUgc3RvcFByb3BhZ2F0aW9uID0gZmFsc2U7XG4gIHByaXZhdGUgdXBkYXRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcm9vdDogUm9vdCkge31cblxuICBzaG91bGRTdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgc2hvdWxkVXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZWQ7XG4gIH1cblxuICBwZXJmb3JtKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gdGhpcztcblxuICAgIGlmICghcm9vdC5oYXNTaW5nbGVDdXJzb3IoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uID0gdHJ1ZTtcblxuICAgIGNvbnN0IGxpc3QgPSByb290LmdldExpc3RVbmRlckN1cnNvcigpO1xuICAgIGNvbnN0IHBhcmVudCA9IGxpc3QuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgZ3JhbmRQYXJlbnQgPSBwYXJlbnQuZ2V0UGFyZW50KCk7XG4gICAgY29uc3QgbmV4dCA9IHBhcmVudC5nZXROZXh0U2libGluZ09mKGxpc3QpO1xuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUJlZm9yZSA9IHJvb3QuZ2V0Q29udGVudExpbmVzUmFuZ2VPZihsaXN0KVswXTtcblxuICAgIGlmICghbmV4dCAmJiBncmFuZFBhcmVudCkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gZ3JhbmRQYXJlbnQuZ2V0TmV4dFNpYmxpbmdPZihwYXJlbnQpO1xuXG4gICAgICBpZiAobmV3UGFyZW50KSB7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChsaXN0KTtcbiAgICAgICAgbmV3UGFyZW50LmFkZEJlZm9yZUFsbChsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5leHQpIHtcbiAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQWZ0ZXIobmV4dCwgbGlzdCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVwZGF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsaXN0U3RhcnRMaW5lQWZ0ZXIgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG4gICAgY29uc3QgbGluZURpZmYgPSBsaXN0U3RhcnRMaW5lQWZ0ZXIgLSBsaXN0U3RhcnRMaW5lQmVmb3JlO1xuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICByb290LnJlcGxhY2VDdXJzb3Ioe1xuICAgICAgbGluZTogY3Vyc29yLmxpbmUgKyBsaW5lRGlmZixcbiAgICAgIGNoOiBjdXJzb3IuY2gsXG4gICAgfSk7XG5cbiAgICByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzKHJvb3QpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByZWNhbGN1bGF0ZU51bWVyaWNCdWxsZXRzIH0gZnJvbSBcInNyYy9yb290L3JlY2FsY3VsYXRlTnVtZXJpY0J1bGxldHNcIjtcbmltcG9ydCB7IFJvb3QgfSBmcm9tIFwiLi4vcm9vdFwiO1xuaW1wb3J0IHsgSU9wZXJhdGlvbiB9IGZyb20gXCIuL0lPcGVyYXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVVcE9wZXJhdGlvbiBpbXBsZW1lbnRzIElPcGVyYXRpb24ge1xuICBwcml2YXRlIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICBwcml2YXRlIHVwZGF0ZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IFJvb3QpIHt9XG5cbiAgc2hvdWxkU3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy51cGRhdGVkO1xuICB9XG5cbiAgcGVyZm9ybSgpIHtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXJvb3QuaGFzU2luZ2xlQ3Vyc29yKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG5cbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBsaXN0LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IGdyYW5kUGFyZW50ID0gcGFyZW50LmdldFBhcmVudCgpO1xuICAgIGNvbnN0IHByZXYgPSBwYXJlbnQuZ2V0UHJldlNpYmxpbmdPZihsaXN0KTtcblxuICAgIGNvbnN0IGxpc3RTdGFydExpbmVCZWZvcmUgPSByb290LmdldENvbnRlbnRMaW5lc1JhbmdlT2YobGlzdClbMF07XG5cbiAgICBpZiAoIXByZXYgJiYgZ3JhbmRQYXJlbnQpIHtcbiAgICAgIGNvbnN0IG5ld1BhcmVudCA9IGdyYW5kUGFyZW50LmdldFByZXZTaWJsaW5nT2YocGFyZW50KTtcblxuICAgICAgaWYgKG5ld1BhcmVudCkge1xuICAgICAgICB0aGlzLnVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICAgIG5ld1BhcmVudC5hZGRBZnRlckFsbChsaXN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHByZXYpIHtcbiAgICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQobGlzdCk7XG4gICAgICBwYXJlbnQuYWRkQmVmb3JlKHByZXYsIGxpc3QpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy51cGRhdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdFN0YXJ0TGluZUFmdGVyID0gcm9vdC5nZXRDb250ZW50TGluZXNSYW5nZU9mKGxpc3QpWzBdO1xuICAgIGNvbnN0IGxpbmVEaWZmID0gbGlzdFN0YXJ0TGluZUFmdGVyIC0gbGlzdFN0YXJ0TGluZUJlZm9yZTtcblxuICAgIGNvbnN0IGN1cnNvciA9IHJvb3QuZ2V0Q3Vyc29yKCk7XG4gICAgcm9vdC5yZXBsYWNlQ3Vyc29yKHtcbiAgICAgIGxpbmU6IGN1cnNvci5saW5lICsgbGluZURpZmYsXG4gICAgICBjaDogY3Vyc29yLmNoLFxuICAgIH0pO1xuXG4gICAgcmVjYWxjdWxhdGVOdW1lcmljQnVsbGV0cyhyb290KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IE1vdmVMZWZ0T3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvTW92ZUxlZnRPcGVyYXRpb25cIjtcbmltcG9ydCB7IE9ic2lkaWFuU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcbmltcG9ydCB7IE1vdmVSaWdodE9wZXJhdGlvbiB9IGZyb20gXCIuLi9vcGVyYXRpb25zL01vdmVSaWdodE9wZXJhdGlvblwiO1xuaW1wb3J0IHsgTW92ZURvd25PcGVyYXRpb24gfSBmcm9tIFwiLi4vb3BlcmF0aW9ucy9Nb3ZlRG93bk9wZXJhdGlvblwiO1xuaW1wb3J0IHsgTW92ZVVwT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvTW92ZVVwT3BlcmF0aW9uXCI7XG5pbXBvcnQgeyBJTUVTZXJ2aWNlIH0gZnJvbSBcInNyYy9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBNb3ZlSXRlbXNGZWF0dXJlIGltcGxlbWVudHMgSUZlYXR1cmUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXzIsXG4gICAgcHJpdmF0ZSBvYnNpZGlhblNlcnZpY2U6IE9ic2lkaWFuU2VydmljZSxcbiAgICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgaW1lU2VydmljZTogSU1FU2VydmljZVxuICApIHt9XG5cbiAgYXN5bmMgbG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLXVwXCIsXG4gICAgICBuYW1lOiBcIk1vdmUgbGlzdCBhbmQgc3VibGlzdHMgdXBcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuU2VydmljZS5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50VXAuYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93VXBcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgIGlkOiBcIm1vdmUtbGlzdC1pdGVtLWRvd25cIixcbiAgICAgIG5hbWU6IFwiTW92ZSBsaXN0IGFuZCBzdWJsaXN0cyBkb3duXCIsXG4gICAgICBjYWxsYmFjazogdGhpcy5vYnNpZGlhblNlcnZpY2UuY3JlYXRlQ29tbWFuZENhbGxiYWNrKFxuICAgICAgICB0aGlzLm1vdmVMaXN0RWxlbWVudERvd24uYmluZCh0aGlzKVxuICAgICAgKSxcbiAgICAgIGhvdGtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG1vZGlmaWVyczogW1wiTW9kXCIsIFwiU2hpZnRcIl0sXG4gICAgICAgICAga2V5OiBcIkFycm93RG93blwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiaW5kZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiSW5kZW50IHRoZSBsaXN0IGFuZCBzdWJsaXN0c1wiLFxuICAgICAgY2FsbGJhY2s6IHRoaXMub2JzaWRpYW5TZXJ2aWNlLmNyZWF0ZUNvbW1hbmRDYWxsYmFjayhcbiAgICAgICAgdGhpcy5tb3ZlTGlzdEVsZW1lbnRSaWdodC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICBpZDogXCJvdXRkZW50LWxpc3RcIixcbiAgICAgIG5hbWU6IFwiT3V0ZGVudCB0aGUgbGlzdCBhbmQgc3VibGlzdHNcIixcbiAgICAgIGNhbGxiYWNrOiB0aGlzLm9ic2lkaWFuU2VydmljZS5jcmVhdGVDb21tYW5kQ2FsbGJhY2soXG4gICAgICAgIHRoaXMubW92ZUxpc3RFbGVtZW50TGVmdC5iaW5kKHRoaXMpXG4gICAgICApLFxuICAgICAgaG90a2V5czogW1xuICAgICAgICB7XG4gICAgICAgICAgbW9kaWZpZXJzOiBbXCJTaGlmdFwiXSxcbiAgICAgICAgICBrZXk6IFwiVGFiXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge31cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudERvd24oZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlRG93bk9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZUxpc3RFbGVtZW50VXAoZWRpdG9yOiBDb2RlTWlycm9yLkVkaXRvcikge1xuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlVXBPcGVyYXRpb24ocm9vdCksXG4gICAgICBlZGl0b3JcbiAgICApO1xuICAgIHJldHVybiBzaG91bGRTdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBwcml2YXRlIG1vdmVMaXN0RWxlbWVudFJpZ2h0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAodGhpcy5pbWVTZXJ2aWNlLmlzSU1FT3BlbmVkKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+XG4gICAgICAgIG5ldyBNb3ZlUmlnaHRPcGVyYXRpb24ocm9vdCwgdGhpcy5saXN0c1NlcnZpY2UuZ2V0RGVmYXVsdEluZGVudENoYXJzKCkpLFxuICAgICAgZWRpdG9yXG4gICAgKTtcbiAgICByZXR1cm4gc2hvdWxkU3RvcFByb3BhZ2F0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlTGlzdEVsZW1lbnRMZWZ0KGVkaXRvcjogQ29kZU1pcnJvci5FZGl0b3IpIHtcbiAgICBpZiAodGhpcy5pbWVTZXJ2aWNlLmlzSU1FT3BlbmVkKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+IG5ldyBNb3ZlTGVmdE9wZXJhdGlvbihyb290KSxcbiAgICAgIGVkaXRvclxuICAgICk7XG4gICAgcmV0dXJuIHNob3VsZFN0b3BQcm9wYWdhdGlvbjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUm9vdCB9IGZyb20gXCIuLi9yb290XCI7XG5pbXBvcnQgeyBJT3BlcmF0aW9uIH0gZnJvbSBcIi4vSU9wZXJhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgQ3JlYXRlTm90ZUxpbmVPcGVyYXRpb24gaW1wbGVtZW50cyBJT3BlcmF0aW9uIHtcbiAgcHJpdmF0ZSBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSB1cGRhdGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb290OiBSb290LCBwcml2YXRlIGRlZmF1bHRJbmRlbnRDaGFyczogc3RyaW5nKSB7fVxuXG4gIHNob3VsZFN0b3BQcm9wYWdhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9wUHJvcGFnYXRpb247XG4gIH1cblxuICBzaG91bGRVcGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlZDtcbiAgfVxuXG4gIHBlcmZvcm0oKSB7XG4gICAgY29uc3QgeyByb290IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFyb290Lmhhc1NpbmdsZUN1cnNvcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gcm9vdC5nZXRDdXJzb3IoKTtcbiAgICBjb25zdCBsaXN0ID0gcm9vdC5nZXRMaXN0VW5kZXJDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lVW5kZXJDdXJzb3IgPSBsaXN0XG4gICAgICAuZ2V0TGluZXNJbmZvKClcbiAgICAgIC5maW5kKChsKSA9PiBsLmZyb20ubGluZSA9PT0gY3Vyc29yLmxpbmUpO1xuXG4gICAgaWYgKGN1cnNvci5jaCA8IGxpbmVVbmRlckN1cnNvci5mcm9tLmNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlZCA9IHRydWU7XG5cbiAgICBpZiAoIWxpc3QuZ2V0Tm90ZXNJbmRlbnQoKSkge1xuICAgICAgY29uc3QgaW5kZW50ID0gbGlzdC5pc0VtcHR5KClcbiAgICAgICAgPyBsaXN0LmdldEZpcnN0TGluZUluZGVudCgpICsgdGhpcy5kZWZhdWx0SW5kZW50Q2hhcnNcbiAgICAgICAgOiBsaXN0LmdldENoaWxkcmVuKClbMF0uZ2V0Rmlyc3RMaW5lSW5kZW50KCk7XG5cbiAgICAgIGxpc3Quc2V0Tm90ZXNJbmRlbnQoaW5kZW50KTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lcyA9IGxpc3QuZ2V0TGluZXNJbmZvKCkucmVkdWNlKChhY2MsIGxpbmUpID0+IHtcbiAgICAgIGlmIChjdXJzb3IubGluZSA9PT0gbGluZS5mcm9tLmxpbmUpIHtcbiAgICAgICAgYWNjLnB1c2gobGluZS50ZXh0LnNsaWNlKDAsIGN1cnNvci5jaCAtIGxpbmUuZnJvbS5jaCkpO1xuICAgICAgICBhY2MucHVzaChsaW5lLnRleHQuc2xpY2UoY3Vyc29yLmNoIC0gbGluZS5mcm9tLmNoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY2MucHVzaChsaW5lLnRleHQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdIGFzIHN0cmluZ1tdKTtcblxuICAgIGxpc3QucmVwbGFjZUxpbmVzKGxpbmVzKTtcblxuICAgIHJvb3QucmVwbGFjZUN1cnNvcih7XG4gICAgICBsaW5lOiBjdXJzb3IubGluZSArIDEsXG4gICAgICBjaDogbGlzdC5nZXROb3Rlc0luZGVudCgpLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luXzIgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IENyZWF0ZU5vdGVMaW5lT3BlcmF0aW9uIH0gZnJvbSBcIi4uL29wZXJhdGlvbnMvQ3JlYXRlTm90ZUxpbmVPcGVyYXRpb25cIjtcbmltcG9ydCB7IElGZWF0dXJlIH0gZnJvbSBcIi4vSUZlYXR1cmVcIjtcbmltcG9ydCB7IExpc3RzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9MaXN0c1NlcnZpY2VcIjtcbmltcG9ydCB7IFNldHRpbmdzU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwic3JjL3NlcnZpY2VzL0lNRVNlcnZpY2VcIjtcblxuZnVuY3Rpb24gaXNTaGlmdEVudGVyKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgcmV0dXJuIChcbiAgICAoZS5rZXlDb2RlID09PSAxMyB8fCBlLmNvZGUgPT09IFwiRW50ZXJcIikgJiZcbiAgICBlLnNoaWZ0S2V5ID09PSB0cnVlICYmXG4gICAgZS5tZXRhS2V5ID09PSBmYWxzZSAmJlxuICAgIGUuYWx0S2V5ID09PSBmYWxzZSAmJlxuICAgIGUuY3RybEtleSA9PT0gZmFsc2VcbiAgKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNoaWZ0RW50ZXJTaG91bGRDcmVhdGVOb3RlRmVhdHVyZSBpbXBsZW1lbnRzIElGZWF0dXJlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbl8yLFxuICAgIHByaXZhdGUgc2V0dGluZ3NTZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBsaXN0c1NlcnZpY2U6IExpc3RzU2VydmljZSxcbiAgICBwcml2YXRlIGltZVNlcnZpY2U6IElNRVNlcnZpY2VcbiAgKSB7fVxuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgdGhpcy5wbHVnaW4ucmVnaXN0ZXJDb2RlTWlycm9yKChjbSkgPT4ge1xuICAgICAgY20ub24oXCJrZXlkb3duXCIsIHRoaXMub25LZXlEb3duKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVubG9hZCgpIHtcbiAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLml0ZXJhdGVDb2RlTWlycm9ycygoY20pID0+IHtcbiAgICAgIGNtLm9mZihcImtleWRvd25cIiwgdGhpcy5vbktleURvd24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbktleURvd24gPSAoY206IENvZGVNaXJyb3IuRWRpdG9yLCBlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgaWYgKFxuICAgICAgIXRoaXMuc2V0dGluZ3NTZXJ2aWNlLmJldHRlckVudGVyIHx8XG4gICAgICAhaXNTaGlmdEVudGVyKGUpIHx8XG4gICAgICB0aGlzLmltZVNlcnZpY2UuaXNJTUVPcGVuZWQoKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2hvdWxkU3RvcFByb3BhZ2F0aW9uIH0gPSB0aGlzLmxpc3RzU2VydmljZS5wZXJmb3JtT3BlcmF0aW9uKFxuICAgICAgKHJvb3QpID0+XG4gICAgICAgIG5ldyBDcmVhdGVOb3RlTGluZU9wZXJhdGlvbihcbiAgICAgICAgICByb290LFxuICAgICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLmdldERlZmF1bHRJbmRlbnRDaGFycygpXG4gICAgICAgICksXG4gICAgICBjbVxuICAgICk7XG5cbiAgICBpZiAoc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcbn1cbiIsImV4cG9ydCBjbGFzcyBJTUVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjb21wb3NpdGlvbiA9IGZhbHNlO1xuXG4gIGFzeW5jIGxvYWQoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBvc2l0aW9uc3RhcnRcIiwgdGhpcy5vbkNvbXBvc2l0aW9uU3RhcnQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb21wb3NpdGlvbmVuZFwiLCB0aGlzLm9uQ29tcG9zaXRpb25FbmQpO1xuICB9XG5cbiAgYXN5bmMgdW5sb2FkKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb21wb3NpdGlvbmVuZFwiLCB0aGlzLm9uQ29tcG9zaXRpb25FbmQpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb21wb3NpdGlvbnN0YXJ0XCIsIHRoaXMub25Db21wb3NpdGlvblN0YXJ0KTtcbiAgfVxuXG4gIGlzSU1FT3BlbmVkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0aW9uO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNvbXBvc2l0aW9uU3RhcnQgPSAoKSA9PiB7XG4gICAgdGhpcy5jb21wb3NpdGlvbiA9IHRydWU7XG4gIH07XG5cbiAgcHJpdmF0ZSBvbkNvbXBvc2l0aW9uRW5kID0gKCkgPT4ge1xuICAgIHRoaXMuY29tcG9zaXRpb24gPSBmYWxzZTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5pbXBvcnQge1xyXG4gIE9ic2lkaWFuT3V0bGluZXJQbHVnaW5TZXR0aW5nVGFiLFxyXG4gIFNldHRpbmdzU2VydmljZSxcclxufSBmcm9tIFwiLi9zZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2VcIjtcclxuaW1wb3J0IHsgSUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9JRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBPYnNpZGlhblNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9PYnNpZGlhblNlcnZpY2VcIjtcclxuaW1wb3J0IHsgTGlzdHNTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvTGlzdHNTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9Mb2dnZXJTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IExpc3RzU3R5bGVzRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0xpc3RzU3R5bGVzRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBFbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0VudGVyT3V0ZGVudElmTGluZUlzRW1wdHlGZWF0dXJlXCI7XHJcbmltcG9ydCB7IEVudGVyU2hvdWxkQ3JlYXRlTmV3SXRlbUZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9FbnRlclNob3VsZENyZWF0ZU5ld0l0ZW1PbkNoaWxkTGV2ZWxGZWF0dXJlXCI7XHJcbmltcG9ydCB7IE1vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL01vdmVDdXJzb3JUb1ByZXZpb3VzVW5mb2xkZWRMaW5lRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBFbnN1cmVDdXJzb3JJbkxpc3RDb250ZW50RmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL0Vuc3VyZUN1cnNvckluTGlzdENvbnRlbnRGZWF0dXJlXCI7XHJcbmltcG9ydCB7IERlbGV0ZVNob3VsZElnbm9yZUJ1bGxldHNGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRGVsZXRlU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUgfSBmcm9tIFwiLi9mZWF0dXJlcy9TZWxlY3Rpb25TaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZVwiO1xyXG5pbXBvcnQgeyBab29tRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1pvb21GZWF0dXJlXCI7XHJcbmltcG9ydCB7IEZvbGRGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvRm9sZEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgU2VsZWN0QWxsRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL1NlbGVjdEFsbEZlYXR1cmVcIjtcclxuaW1wb3J0IHsgTW92ZUl0ZW1zRmVhdHVyZSB9IGZyb20gXCIuL2ZlYXR1cmVzL01vdmVJdGVtc0ZlYXR1cmVcIjtcclxuaW1wb3J0IHsgU2hpZnRFbnRlclNob3VsZENyZWF0ZU5vdGVGZWF0dXJlIH0gZnJvbSBcIi4vZmVhdHVyZXMvU2hpZnRFbnRlclNob3VsZENyZWF0ZU5vdGVGZWF0dXJlXCI7XHJcbmltcG9ydCB7IElNRVNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9JTUVTZXJ2aWNlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYnNpZGlhbk91dGxpbmVyUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcclxuICBwcml2YXRlIGZlYXR1cmVzOiBJRmVhdHVyZVtdO1xyXG4gIHByb3RlY3RlZCBzZXR0aW5nc1NlcnZpY2U6IFNldHRpbmdzU2VydmljZTtcclxuICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSBvYnNpZGlhblNlcnZpY2U6IE9ic2lkaWFuU2VydmljZTtcclxuICBwcml2YXRlIGxpc3RzU2VydmljZTogTGlzdHNTZXJ2aWNlO1xyXG4gIHByaXZhdGUgaW1lU2VydmljZTogSU1FU2VydmljZTtcclxuXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coYExvYWRpbmcgb2JzaWRpYW4tb3V0bGluZXJgKTtcclxuXHJcbiAgICB0aGlzLnNldHRpbmdzU2VydmljZSA9IG5ldyBTZXR0aW5nc1NlcnZpY2UodGhpcyk7XHJcbiAgICBhd2FpdCB0aGlzLnNldHRpbmdzU2VydmljZS5sb2FkKCk7XHJcblxyXG4gICAgdGhpcy5sb2dnZXJTZXJ2aWNlID0gbmV3IExvZ2dlclNlcnZpY2UodGhpcy5zZXR0aW5nc1NlcnZpY2UpO1xyXG5cclxuICAgIHRoaXMub2JzaWRpYW5TZXJ2aWNlID0gbmV3IE9ic2lkaWFuU2VydmljZSh0aGlzLmFwcCk7XHJcbiAgICB0aGlzLmxpc3RzU2VydmljZSA9IG5ldyBMaXN0c1NlcnZpY2UoXHJcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZSxcclxuICAgICAgdGhpcy5vYnNpZGlhblNlcnZpY2VcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5pbWVTZXJ2aWNlID0gbmV3IElNRVNlcnZpY2UoKTtcclxuICAgIGF3YWl0IHRoaXMuaW1lU2VydmljZS5sb2FkKCk7XHJcblxyXG4gICAgdGhpcy5hZGRTZXR0aW5nVGFiKFxyXG4gICAgICBuZXcgT2JzaWRpYW5PdXRsaW5lclBsdWdpblNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMsIHRoaXMuc2V0dGluZ3NTZXJ2aWNlKVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLmZlYXR1cmVzID0gW1xyXG4gICAgICBuZXcgTGlzdHNTdHlsZXNGZWF0dXJlKHRoaXMsIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLCB0aGlzLm9ic2lkaWFuU2VydmljZSksXHJcbiAgICAgIG5ldyBFbnRlck91dGRlbnRJZkxpbmVJc0VtcHR5RmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMuaW1lU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgRW50ZXJTaG91bGRDcmVhdGVOZXdJdGVtRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMuaW1lU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgRW5zdXJlQ3Vyc29ySW5MaXN0Q29udGVudEZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgTW92ZUN1cnNvclRvUHJldmlvdXNVbmZvbGRlZExpbmVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UsXHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UsXHJcbiAgICAgICAgdGhpcy5pbWVTZXJ2aWNlXHJcbiAgICAgICksXHJcbiAgICAgIG5ldyBEZWxldGVTaG91bGRJZ25vcmVCdWxsZXRzRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMuaW1lU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2VsZWN0aW9uU2hvdWxkSWdub3JlQnVsbGV0c0ZlYXR1cmUoXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzU2VydmljZSxcclxuICAgICAgICB0aGlzLmxpc3RzU2VydmljZSxcclxuICAgICAgICB0aGlzLmltZVNlcnZpY2VcclxuICAgICAgKSxcclxuICAgICAgbmV3IFpvb21GZWF0dXJlKHRoaXMsIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLCB0aGlzLmltZVNlcnZpY2UpLFxyXG4gICAgICBuZXcgRm9sZEZlYXR1cmUodGhpcywgdGhpcy5vYnNpZGlhblNlcnZpY2UpLFxyXG4gICAgICBuZXcgU2VsZWN0QWxsRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMuaW1lU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgTW92ZUl0ZW1zRmVhdHVyZShcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIHRoaXMub2JzaWRpYW5TZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMubGlzdHNTZXJ2aWNlLFxyXG4gICAgICAgIHRoaXMuaW1lU2VydmljZVxyXG4gICAgICApLFxyXG4gICAgICBuZXcgU2hpZnRFbnRlclNob3VsZENyZWF0ZU5vdGVGZWF0dXJlKFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc1NlcnZpY2UsXHJcbiAgICAgICAgdGhpcy5saXN0c1NlcnZpY2UsXHJcbiAgICAgICAgdGhpcy5pbWVTZXJ2aWNlXHJcbiAgICAgICksXHJcbiAgICBdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiB0aGlzLmZlYXR1cmVzKSB7XHJcbiAgICAgIGF3YWl0IGZlYXR1cmUubG9hZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgb251bmxvYWQoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgVW5sb2FkaW5nIG9ic2lkaWFuLW91dGxpbmVyYCk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5pbWVTZXJ2aWNlLnVubG9hZCgpO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiB0aGlzLmZlYXR1cmVzKSB7XHJcbiAgICAgIGF3YWl0IGZlYXR1cmUudW5sb2FkKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJQbHVnaW5TZXR0aW5nVGFiIiwiU2V0dGluZyIsIk1hcmtkb3duVmlldyIsImlzRW50ZXIiLCJQbGF0Zm9ybSIsIk5vdGljZSIsIlBsdWdpbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF1REE7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMs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
