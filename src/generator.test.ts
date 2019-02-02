import '@toba/test';
import { escape } from './generator';

test('replaces symbols', () => {
   expect(escape('ben & jerry')).toBe('ben &amp; jerry');
});
