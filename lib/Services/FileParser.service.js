"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileParser = (function () {
    function FileParser() {
    }
    FileParser.prototype.processFilesFromInput = function (items) {
        var _this = this;
        var newFiles = Object.keys(items).reduce(function (result, key) {
            var entry, item = items[key];
            if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
                if (entry.isFile) {
                    result.push(Promise.resolve(item.getAsFile()));
                }
                else if (entry.isDirectory) {
                    result.push(_this.processDirectory(entry));
                }
            }
            else if (item.getAsFile != null) {
                if ((item.kind == null) || item.kind === "file") {
                    result.push(Promise.resolve(item.getAsFile()));
                }
            }
            else if (item.isFile) {
                var pr = new Promise(function (resolve, reject) {
                    item.file(resolve, reject);
                });
                result.push(pr);
            }
            else if (item.isDirectory) {
                result.push(_this.processDirectory(item));
            }
            return result;
        }, []);
        return Promise.all(newFiles).then(this.flattenArrayOfFiles);
    };
    FileParser.prototype.processDirectory = function (directory) {
        var _this = this;
        var dirReader = directory.createReader(), result = [];
        var readEntries = function () {
            return new Promise(function (resolve, reject) {
                dirReader.readEntries(function (entries) {
                    var pr = [];
                    if (entries.length) {
                        for (var i = 0; i < entries.length; i++) {
                            pr.push(_this.processFilesFromInput({ 0: entries[i] }));
                        }
                    }
                    else {
                        resolve(null);
                    }
                    result.push(readEntries());
                    Promise.all(pr).then(_this.flattenArrayOfFiles).then(resolve);
                }, function (error) {
                    reject("Error while reading folder");
                });
            });
        };
        result.push(readEntries());
        return Promise.all(result).then(this.flattenArrayOfFiles);
    };
    FileParser.prototype.processInputFromDrop = function (e) {
        var items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
            return Promise.resolve(this.processFilesFromInput(items));
        }
        else if (items && items.length && !items[0].webkitGetAsEntry) {
            return Promise.resolve(items);
        }
        else if (e.dataTransfer.files) {
            var files = [];
            for (var i = 0, l = e.dataTransfer.files.length; i < l; i++) {
                files.push(e.dataTransfer.files[i]);
            }
            return Promise.resolve(files);
        }
    };
    FileParser.prototype.flattenArrayOfFiles = function (arrayOfPromises) {
        return Promise.resolve(arrayOfPromises.reduce(function (result, file) {
            if (file) {
                return result.concat(file);
            }
        }, []));
    };
    return FileParser;
}());
FileParser = __decorate([
    core_1.Injectable()
], FileParser);
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.service.js.map