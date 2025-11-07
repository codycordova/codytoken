// ESLint flat config for Next 16 + React 19
import next from 'eslint-config-next';

export default [
    // Ignore build output and node_modules
    { ignores: ['.next/**', 'node_modules/**', 'dist/**'] },

    // Next.js core web vitals rules
    ...next(),
];
