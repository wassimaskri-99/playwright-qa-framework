import { createBdd } from 'playwright-bdd';
import { test } from './pages.fixture';

export const { Given, When, Then } = createBdd(test);
