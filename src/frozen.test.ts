import { FrozenObject } from './frozen.types';

// Helper Types & Functions
interface Config {
  server: {
    host: string;
    port: number;
    flags: string[];
  };
  users: { id: number; name: string }[];
}

// A legacy function that mutates data
function updateServerInfo(config: Config) {
  config.server.port = 8080;
  config.server.flags.push('secure');
  return config;
}

// FrozenObject<T> Test Suite

describe('FrozenObject<T> Test Suite', () => {

  // SCENARIO 1: Basic Usage

  describe('1. Basic Usage', () => {
    it('should allow reading properties', () => {
      const frozen: FrozenObject<{ name: string }> = { name: 'Ravikiran' };
      expect(frozen.name).toBe('Ravikiran');
    });

    it('should allow assignment on the same reference', () => {
      const frozen: FrozenObject<{ name: string }> = { name: 'Ravikiran' };

      // This MUST be allowed to preserve assignability to T
      frozen.name = 'Golla';

      expect(frozen.name).toBe('Golla');
    });
  });

  // SCENARIO 2: Deep Structures
  describe('2. Deep Structures', () => {
    it('should allow deep mutation on the same reference', () => {
      const config: FrozenObject<Config> = {
        server: { host: 'localhost', port: 3000, flags: [] },
        users: []
      };

      config.server.host = '127.0.0.1';
      config.server.port = 9000;
      config.server.flags.push('debug');

      expect(config.server.port).toBe(9000);
      expect(config.server.flags).toContain('debug');
    });
  });

  // SCENARIO 3: Arrays & Collections
  describe('3. Arrays & Collections', () => {
    it('should allow array mutation on the same reference', () => {
      const list: FrozenObject<string[]> = ['a', 'b'];

      list.push('c');
      list[0] = 'z';

      expect(list).toEqual(['z', 'b', 'c']);
    });

    it('should allow mutation of objects inside arrays', () => {
      const complex: FrozenObject<{ tags: string[] }[]> = [
        { tags: ['one'] }
      ];

      complex[0].tags.push('two');

      expect(complex[0].tags).toEqual(['one', 'two']);
    });
  });

  // SCENARIO 4: Interoperability
  describe('4. Interoperability', () => {
    it('should be assignable to mutable T', () => {
      const frozen: FrozenObject<Config> = {
        server: { host: 'dev', port: 3000, flags: [] },
        users: []
      };

      const mutable: Config = frozen; 

      mutable.server.port = 1234;
      expect(frozen.server.port).toBe(1234);
    });

    it('should work with mutating functions', () => {
      const myConfig: FrozenObject<Config> = {
        server: { host: 'dev', port: 3000, flags: ['verbose'] },
        users: [{ id: 1, name: 'Admin' }]
      };

      updateServerInfo(myConfig);

      expect(myConfig.server.port).toBe(8080);
      expect(myConfig.server.flags).toContain('secure');
    });
  });

  // SCENARIO 5: Edge Cases
  describe('5. Edge Cases', () => {
    it('should handle primitives correctly', () => {
      const num: FrozenObject<number> = 42;

      const check: number = num;
      expect(check).toBe(42);
    });

    it('should handle union and optional properties', () => {
      type Mixed = {
        a: string;
        b: number | null;
        c?: boolean;
      };

      const mixed: FrozenObject<Mixed> = { a: 'ok', b: null };

      mixed.b = 10;
      mixed.c = true;

      expect(mixed.b).toBe(10);
      expect(mixed.c).toBe(true);
    });
  });

});
