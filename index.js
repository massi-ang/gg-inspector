#!/usr/bin/env node
"use strict";
// Copyright 2020 angmas
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var commander_1 = require("commander");
var chalk = require("chalk");
var tail_1 = require("tail");
function parseElement(e) {
    if (e.indexOf('arn:aws') > -1) {
        return e.split(':')[6];
    }
    return e;
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var program;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                program = new commander_1.Command();
                program.version('1.1.0');
                program.command('show', {
                    isDefault: true
                }).option('-f, --file <file>', 'group.json file', '/greengrass/ggc/deployment/group/group.json').action(function (cmdObj) { return __awaiter(void 0, void 0, void 0, function () {
                    var f, group, group_def, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, fs.promises.readFile(cmdObj.file)];
                            case 1:
                                f = _a.sent();
                                group = JSON.parse(f.toString('utf8'));
                                if (group.Cores.length === 0) {
                                    console.log('This group has not been deployed yet');
                                    return [2 /*return*/];
                                }
                                console.log(chalk.yellowBright('Group:') + " " + group.Arn.split('/')[3] + ", version: " + group.Arn.split('/')[5]);
                                console.log(chalk.greenBright('Region: ') + ("" + group.Region));
                                console.log(chalk.greenBright('Core:') + " " + group.Cores[0].thingArn.split('/')[1] + "\n");
                                console.log(chalk.greenBright('Devices:'));
                                group.Devices.forEach(function (d) { return console.log("\t" + d.thingArn.split('/')[1]); });
                                console.log(chalk.greenBright('Lambdas:'));
                                group_def = group.GroupDefinitions;
                                group_def.Lambdas.Content.forEach(function (l) {
                                    console.log("\t" + l.FunctionArn.split(':')[6] + " [" + l.DeploymentConfiguration.CodeSize + "]");
                                });
                                console.log(chalk.greenBright('Subscriptions:'));
                                group_def.Subscriptions.Content.forEach(function (s) {
                                    console.log("\t" + parseElement(s.Source) + " \u2794 " + chalk.blueBright(s.Subject) + " \u2794 " + parseElement(s.Target));
                                });
                                console.log(chalk.greenBright('Resources:'));
                                group_def.Resources.Content.forEach(function (r) {
                                    console.log("\t" + r.Type + " " + JSON.stringify(r.Data, undefined, 2));
                                });
                                console.log(chalk.greenBright('Logging:'));
                                group_def.Logging.Content.forEach(function (l) {
                                    console.log("\t" + l.Level + " " + l.Type + " " + l.Component);
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                if (err_1.name === 'TypeError') {
                                    console.log('Please install Node.js v10 or higher');
                                    process.exit(1);
                                }
                                else if (err_1.name === 'Error' && err_1.errno === -13) {
                                    console.log('Run this command from a root or user with enough privileges to access ${cdmObj.file}');
                                    process.exit(1);
                                }
                                console.error(err_1);
                                process.exit(1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                program.command('logs').option('-r, --root <dir>', 'The root folder for the logs', '/greengrass/ggc/var/log/system').action(function (cmdObj) { return __awaiter(void 0, void 0, void 0, function () {
                    var files, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, fs.promises.readdir(cmdObj.root)];
                            case 1:
                                files = _a.sent();
                                files.forEach(function (f) {
                                    var t = new tail_1.Tail(cmdObj.root + '/' + f);
                                    t.on("line", function (d) {
                                        console.log(chalk.blueBright(f) + "\t- " + d);
                                    });
                                    t.on("error", function (e) { console.log(e); t.unwatch(); });
                                    t.watch();
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                err_2 = _a.sent();
                                if (err_2.name === 'TypeError') {
                                    console.log('Please install Node.js v10 or higher');
                                    process.exit(1);
                                }
                                else if (err_2.name === 'Error' && err_2.errno === -13) {
                                    console.log('Run this command from a root or user with enough privileges to access the ${cdmObj.root} folder');
                                    process.exit(1);
                                }
                                console.error(err_2);
                                process.exit(1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, program.parse(process.argv)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
