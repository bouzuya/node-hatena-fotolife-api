import { Test, run } from 'beater';
import { tests as fotolifeTests } from './fotolife';

const tests = ([] as Test[])
    .concat(fotolifeTests);

run(tests).catch(() => process.exit(1));
