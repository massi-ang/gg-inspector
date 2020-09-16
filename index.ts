#!/usr/bin/env node
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

import * as fs from 'fs'
import { Command } from 'commander'
import * as chalk from 'chalk'
import {Tail} from 'tail'


function parseElement(e: string): string {
    if (e.indexOf('arn:aws') > -1) {
        return e.split(':')[6]
    }
    return e
}

(async () => {
    const program = new Command();

    program.version('1.1.0');
    program.command('show', {
        isDefault: true
    }).option('-f, --file <file>', 'group.json file', '/greengrass/ggc/deployment/group/group.json').action(async (cmdObj: any) => {
        try {
            const f = await fs.promises.readFile(cmdObj.file);
            const group = JSON.parse(f.toString('utf8'));
            if (group.Cores.length === 0) {
                console.log('This group has not been deployed yet');
                return;
            }
            console.log(`${chalk.yellowBright('Group:')} ${group.Arn.split('/')[3]}, version: ${group.Arn.split('/')[5]}`)

            console.log(chalk.greenBright('Region: ') + `${group.Region}`);

            console.log(`${chalk.greenBright('Core:')} ${group.Cores[0].thingArn.split('/')[1]}\n`)
            console.log(chalk.greenBright('Devices:'));
            group.Devices.forEach((d: any) => console.log(`\t${d.thingArn.split('/')[1]}`))
            console.log(chalk.greenBright('Lambdas:'));
            const group_def = group.GroupDefinitions;
            group_def.Lambdas.Content.forEach((l: any) => {
                console.log(`\t${l.FunctionArn.split(':')[6]} [${l.DeploymentConfiguration.CodeSize}]`);
            })
            console.log(chalk.greenBright('Subscriptions:'));
            group_def.Subscriptions.Content.forEach((s: any) => {
                console.log(`\t${parseElement(s.Source)} \u2794 ${chalk.blueBright(s.Subject)} \u2794 ${parseElement(s.Target)}`)
            })
            console.log(chalk.greenBright('Resources:'));
            group_def.Resources.Content.forEach((r: any) => {
                console.log(`\t${r.Type} ${JSON.stringify(r.Data, undefined, 2)}`)
            })
            console.log(chalk.greenBright('Logging:'));
            group_def.Logging.Content.forEach((l: any) => {
                console.log(`\t${l.Level} ${l.Type} ${l.Component}`);
            })
        } catch (err) {
            if (err.name === 'TypeError') {
                console.log('Please install Node.js v10 or higher');
                process.exit(1);
            } else if (err.name === 'Error' && err.errno === -13) {
                console.log('Run this command from a root or user with enough privileges to access ${cdmObj.file}');
                process.exit(1);
            }
            console.error(err);
            process.exit(1);
        }
    })

    program.command('logs').option('-r, --root <dir>', 'The root folder for the logs', '/greengrass/ggc/var/log/system').action(async (cmdObj: any) => {
        try { 
            let files = await fs.promises.readdir(cmdObj.root)
            files.forEach((f) => {
                let t = new Tail(cmdObj.root+'/'+f);
                t.on("line", (d) => {
                    console.log(`${chalk.blueBright(f)}\t- ${d}`);
                });
                t.on("error", (e) => { console.log(e); t.unwatch(); });
                t.watch();
            })
        } catch (err) {
            if (err.name === 'TypeError') {
                console.log('Please install Node.js v10 or higher');
                process.exit(1);
            } else if (err.name === 'Error' && err.errno === -13) {
                console.log('Run this command from a root or user with enough privileges to access the ${cdmObj.root} folder');
                process.exit(1);
            }
            console.error(err);
            process.exit(1);
        }
    })

    await program.parse(process.argv);

})()