import { APIRequestContext } from '@playwright/test';

export type Product = { name: string; price: number };

export type AssistantReply = {
  answer: string;
  products: Product[];
  refused: boolean;
};

// Talks to the shopping assistant's HTTP API (apps/ai-assistant).
export class AssistantClient {
  constructor(private readonly request: APIRequestContext) {}

  async ask(message: string): Promise<AssistantReply> {
    const response = await this.request.post('/chat', { data: { message } });
    if (!response.ok()) {
      throw new Error(`Assistant returned ${response.status()}: ${await response.text()}`);
    }
    return response.json();
  }

  async catalog(): Promise<Product[]> {
    const response = await this.request.get('/products');
    return response.json();
  }
}
