/* eslint-disable no-console */
import { execa } from 'execa';
import fs from 'fs';
(async function() {
    try {
        try { await execa('git', ['branch', '-D', 'gh-pages']) }
        catch(e) {}
        await execa('git', ['checkout', '--orphan', 'gh-pages']);
        // eslint-disable-next-line no-console
        console.log('building started...');
        await execa('npm', ['run', 'build']);
        // Understand if it's dist or build folder
        let name = fs.existsSync('dist') ? 'dist' : 'build';
        await execa('git', ['--work-tree', name, 'add', '--all']);
        await execa('git', ['--work-tree', name, 'commit', '-m', 'gh-pages']);
        console.log('pushing to gh-pages...');
        await execa('git', ['push', 'origin', 'HEAD:gh-pages', '--force']);
        //await execa('rm', ['-r', name]);
        await execa('git', ['checkout', '-f', 'master']);
        console.log('successfully deployed, check your settings');
    }
  
    catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.message);
        process.exit(1);
    }
})();