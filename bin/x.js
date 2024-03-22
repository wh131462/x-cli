#! /usr/bin/env node
import { program } from 'commander';
const version = process.env.VERSION ?? DefaultVer;

program.version(version).description(`A cli for any needed.`).arguments('[command]').option('-i, --install <module>', 'Install specified module.').option('-u, --uninstall <module>', 'Uninstall specified module.').option('-c, --create <part>', 'Create specified part.').parse(process.argv);
