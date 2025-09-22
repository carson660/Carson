import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import nodemailer from 'nodemailer';

import { prisma } from './prisma';

const providers = [
  EmailProvider({
    from: process.env.EMAIL_FROM,
    sendVerificationRequest: async ({ identifier, url }) => {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 1025),
        secure: false,
        auth:
          process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD
            ? {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
              }
            : undefined
      });

      await transporter.sendMail({
        to: identifier,
        from: process.env.EMAIL_FROM,
        subject: 'Your GameQuest sign-in link',
        text: `Sign in to GameQuest: ${url}`,
        html: `<p>Sign in to <strong>GameQuest</strong></p><p><a href="${url}">Click here to continue</a></p>`
      });
    }
  })
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  providers.push(
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database'
  },
  pages: {
    signIn: '/auth/signin'
  },
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const roles = await prisma.role.findMany({
          where: { users: { some: { id: user.id } } },
          select: { name: true }
        });
        session.user.roles = roles.map((role) => role.name);
      }
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      const defaultRole = await prisma.role.upsert({
        where: { name: 'USER' },
        create: { name: 'USER' },
        update: {}
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          roles: {
            connect: { id: defaultRole.id }
          }
        }
      });
    }
  }
};

export const getServerAuthSession = () => getServerSession(authOptions);
