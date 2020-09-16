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

    program.version('0.0.1');
    program.command('show', {
        isDefault: true
    }).option('-f, --file <file>', 'group.json file', '/greengrass/ggc/deployment/group/group.json').action(async (cmdObj: any) => {
        const f = await fs.promises.readFile(cmdObj.file);
        const group = JSON.parse(f.toString('utf8'));
        console.log(`${chalk.yellowBright('Group:')} ${group.Arn.split('/')[3]}, version: ${group.Arn.split('/')[5]}`)

        console.log(chalk.greenBright('Region: ')+`${group.Region}`);

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
            console.log(`\t${parseElement(s.Source)} ${chalk.blueBright(s.Subject)} -> ${parseElement(s.Target)}`)
        })
        console.log(chalk.greenBright('Logging:'));
        group_def.Logging.Content.forEach((l: any) => {
            console.log(`\t${l.Level} ${l.Type} ${l.Component}`);
        })
    })

    program.command('logs').option('-r, --root <dir>', 'The root folder for the logs', '/greengrass/ggc/var/log').action(async (cmdObj: any) => {
        let files = await fs.promises.readdir(cmdObj.root)
        files.forEach((f) => {
            let t = new Tail(cmdObj.root+'/'+f);
            t.on("line", (d) => {
                console.log(`${chalk.blueBright(f)}\t- ${d}`);
            });
            t.on("error", (e) => { console.log(e); t.unwatch(); });
            t.watch();
        })
    })

    await program.parse(process.argv);

})()