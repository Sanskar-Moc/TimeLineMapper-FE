import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai-edge';

@Injectable({
  providedIn: 'root', // Or a specific module if needed
})
export class GptserviceService {
  private readonly openai: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: '', // Access API key from environment
    });
    this.openai = new OpenAIApi(config);
  }

  async generateImagePrompt(name: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an creative and helo full AI assistance capabe of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat',
          },
        ],
      });

      const data = await response.json();
      console.log(data)
      const imageDescription = data.choices[0].message.content;
      return imageDescription as string;
    } catch (error) {
      console.error(error); // Log the error
      throw error; // Re-throw the error for proper handling in consuming components
    }
  }
}
