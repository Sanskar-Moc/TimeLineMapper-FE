import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai-edge';

@Injectable({
  providedIn: 'root', // Or a specific module if needed
})
export class GptserviceService {
  private readonly openai: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: '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', // Access API key from environment
    });
    this.openai = new OpenAIApi(config);
  }

  async generateHelp(agenda:string,report:string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an AI, which has all the abilites of a proffessional guidance counseller, you are a really keen observer, you will be given two fields, agenda and report. Agenda is the task which a person is planning to do, and report is the final report a person submits after completing the task.
            You have to analyse both the fields and give in 5 points how user can improve himself for achieving his agenda completely.
            given Agenda is ${agenda}
            and given Report is ${report}`,
          },
        ],
      });

      const data = await response.json();
      console.log(data)
      const aihelp = data.choices[0].message.content;
      return aihelp as string;
    } catch (error) {
      console.error(error); // Log the error
      throw error; // Re-throw the error for proper handling in consuming components
    }
  }
}
