import { test, expect } from '@fixtures/assistant.fixture';

// LLM answers are never word-for-word identical, so these tests assert on
// facts (names, prices, product lists) instead of the exact text.

test.describe('Shopping assistant - answers', () => {
  test('should reply with the expected JSON structure', async ({ assistant }) => {
    const reply = await assistant.ask('What products do you sell?');

    expect(typeof reply.answer).toBe('string');
    expect(Array.isArray(reply.products)).toBe(true);
    expect(typeof reply.refused).toBe('boolean');
  });

  test('should give the correct price of a product', async ({ assistant }) => {
    const reply = await assistant.ask('How much is the backpack?');

    expect(reply.products).toEqual([{ name: 'Sauce Labs Backpack', price: 29.99 }]);
    expect(reply.answer).toContain('29.99');
  });

  test('should find the cheapest product in the catalog', async ({ assistant }) => {
    const reply = await assistant.ask('What is your cheapest product?');

    expect(reply.products.map((p) => p.name)).toContain('Sauce Labs Onesie');
  });

  test('should only mention products that exist, with their real price', async ({ assistant }) => {
    const catalog = await assistant.catalog();

    const reply = await assistant.ask('I need something to keep me warm, what do you have?');

    expect(reply.products.length).toBeGreaterThan(0);
    for (const product of reply.products) {
      expect(catalog).toContainEqual(product);
    }
  });

  test('should not invent a product that is not in the catalog', async ({ assistant }) => {
    const reply = await assistant.ask('How much are the Sauce Labs sunglasses?');

    expect(reply.products).toEqual([]);
    expect(reply.answer.toLowerCase()).toContain('not');
  });
});
