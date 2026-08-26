import { execSync } from 'child_process';
import { resolve } from 'path';

const populateSqliteDb = (): void => {
    const deployPaths = [resolve(process.cwd(), '..', 'db', 'models'), resolve(process.cwd(), 'src', 'main', 'routes')];
    const execSyncOptions = { cwd: process.cwd(), stdio: 'inherit' as const };
    const populateSqliteDbSrv = `cds deploy ${deployPaths.join(' ')} -2 sqlite:${process.cwd()}/db.sqlite --with-mocks`;

    execSync(populateSqliteDbSrv, execSyncOptions);
};

populateSqliteDb();
