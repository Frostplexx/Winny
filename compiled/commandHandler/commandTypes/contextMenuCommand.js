"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenu = void 0;
//conexts menus are loaded together with the commands
class ContextMenu {
    constructor(options) {
        this.data = options.data;
        this.execute = options.execute;
    }
}
exports.ContextMenu = ContextMenu;
