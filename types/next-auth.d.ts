import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id: string;
      roles?: string[];
    };
  }

  interface User {
    roles?: string[];
  }
}
