/// <reference types="@sveltejs/kit" />

declare module '$env/dynamic/private' {
    export const env: {
      [key: string]: string | undefined;
      OPENAI_KEY: string;
    };
  }
  