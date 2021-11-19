import type { Config } from '@jest/types';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

['.env.defaults', '.env'].forEach((f) => dotenv.config({ path: f }));

const srcPath = 'src/engine/connectors';
const engine_type = process.env.ENGINE_TYPE; // if there no engine all tests will run

export default async (): Promise<Config.InitialOptions> => {
  const dirs = (await fs.promises.readdir(srcPath))
    .filter((dir) => dir !== engine_type)
    .map((dir) => `${srcPath}/${dir}`);

  return {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testPathIgnorePatterns: dirs,
    rootDir: '../src',
    testRegex: '.e2e-spec.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/$1',
    },
  };
};
