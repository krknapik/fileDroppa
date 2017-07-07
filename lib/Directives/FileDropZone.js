"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileParser_service_1 = require("../Services/FileParser.service");
var FileStore_service_1 = require("../Services/FileStore.service");
var FileDropZone = (function () {
    function FileDropZone(filesStore, el, fileParser) {
        this.filesStore = filesStore;
        this.el = el;
        this.fileParser = fileParser;
        this.hiddenFileInput = null;
        this.promise = null;
        this.createHiddenInput();
    }
    FileDropZone.prototype.onClick = function (e) {
        this.hiddenFileInput && this.hiddenFileInput.click();
    };
    FileDropZone.prototype.drop = function (e) {
        var _this = this;
        e.preventDefault();
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
        this.promise = this.fileParser.processInputFromDrop(e)
            .then(function (files) {
            _this.updateFilesStore(files.slice());
        });
        this.updateStyles();
    };
    FileDropZone.prototype.dragenter = function (e) {
        e.preventDefault();
    };
    FileDropZone.prototype.dragover = function (e) {
        e.preventDefault();
        this.updateStyles(true);
    };
    FileDropZone.prototype.dragleave = function (e) {
        e.preventDefault();
        this.updateStyles();
    };
    FileDropZone.prototype.OnDestroy = function () {
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
    };
    FileDropZone.prototype.updateStyles = function (dragOver) {
        if (dragOver === void 0) { dragOver = false; }
    };
    FileDropZone.prototype.updateFilesStore = function (files) {
        this.filesStore.addFiles(files);
    };
    FileDropZone.prototype.createHiddenInput = function () {
        var _this = this;
        this.hiddenFileInput && document.body.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = document.createElement("input");
        this.hiddenFileInput.setAttribute("type", "file");
        this.hiddenFileInput.setAttribute("multiple", "multiple");
        this.hiddenFileInput.style.visibility = "hidden";
        this.hiddenFileInput.style.position = "absolute";
        this.hiddenFileInput.style.top = "0";
        this.hiddenFileInput.style.left = "0";
        this.hiddenFileInput.style.height = "0";
        this.hiddenFileInput.style.width = "0";
        this.hiddenFileInput.className = "_hiddenInputClassName";
        document.body.appendChild(this.hiddenFileInput);
        this.hiddenFileInput.addEventListener("change", function (e) {
            var files = [];
            for (var i = 0, l = e.target.files.length; i < l; i++) {
                files.push(e.target.files[i]);
            }
            _this.hiddenFileInput.value = "";
            _this.updateFilesStore(files);
        });
    };
    return FileDropZone;
}());
FileDropZone = __decorate([
    core_1.Component({
        selector: 'fileDropZone, [fileDropZone]',
        providers: [FileParser_service_1.FileParser],
        styles: ["\n        .file_dropZone_internal {\n            border: 3px dashed #DDD;\n            border-radius:10px;\n            padding:10px;\n            width:400px;\n            height:200px;\n            color:#CCC;\n            text-align:center;\n            display:table-cell;\n            vertical-align:middle;\n            cursor:pointer;\n        }\n    "],
        template: "\n        <ng-content></ng-content>\n    ",
        host: {
            '(drop)': 'drop($event)',
            '(dragenter)': 'dragenter($event)',
            '(dragover)': 'dragover($event)',
            '(dragleave)': 'dragleave($event)',
            '(click)': 'onClick($event)'
        },
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [FileStore_service_1.FilesStore, core_1.ElementRef, FileParser_service_1.FileParser])
], FileDropZone);
exports.FileDropZone = FileDropZone;
//# sourceMappingURL=FileDropZone.js.map