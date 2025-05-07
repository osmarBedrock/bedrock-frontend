import * as React from 'react';

import { dayjs } from '@/lib/dayjs';
import { ChatProvider } from '@/components/dashboard/chat/chat-context';
import { ChatView } from '@/components/dashboard/chat/chat-view';
import type { Contact, Message, Thread } from '@/components/dashboard/chat/types';

const contacts = [
  {
    id: 10,
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    isActive: false,
    lastActivity: dayjs().subtract(1, 'hour').toDate(),
  },
  {
    id: 3,
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    isActive: false,
    lastActivity: dayjs().subtract(15, 'minute').toDate(),
  },
  { id: 5, name: 'Fran Perez', avatar: '/assets/avatar-5.png', isActive: true, lastActivity: dayjs().toDate() },
  { id: 6, name: 'Iulia Albu', avatar: '/assets/avatar-6.png', isActive: true, lastActivity: dayjs().toDate() },
  { id: 8, name: 'Jie Yan', avatar: '/assets/avatar-8.png', isActive: true, lastActivity: dayjs().toDate() },
  {
    id: 9,
    name: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    isActive: false,
    lastActivity: dayjs().subtract(2, 'hour').toDate(),
  },
  {
    id: 1,
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    isActive: true,
    lastActivity: dayjs().toDate(),
  },
  {
    id: 7,
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    isActive: true,
    lastActivity: dayjs().toDate(),
  },
  {
    id: 11,
    name: 'Omar Darobe',
    avatar: '/assets/avatar-11.png',
    isActive: true,
    lastActivity: dayjs().toDate(),
  },
  {
    id: 4,
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    isActive: false,
    lastActivity: dayjs().subtract(6, 'hour').toDate(),
  },
  {
    id: 2,
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    isActive: true,
    lastActivity: dayjs().toDate(),
  },
] satisfies Contact[];

const threads = [
  {
    id: 4,
    type: 'direct',
    participants: [
      { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
      { id: 3, name: 'Carson Darrin', avatar: '/assets/avatar-3.png' },
    ],
    unreadCount: 0,
  },
  {
    id: 3,
    type: 'direct',
    participants: [
      { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
      { id: 5, name: 'Fran Perez', avatar: '/assets/avatar-5.png' },
    ],
    unreadCount: 1,
  },
  {
    id: 2,
    type: 'group',
    participants: [
      { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
      { id: 7, name: 'Nasimiyu Danai', avatar: '/assets/avatar-7.png' },
      { id: 1, name: 'Miron Vitold', avatar: '/assets/avatar-1.png' },
    ],
    unreadCount: 0,
  },
  {
    id: 1,
    type: 'direct',
    participants: [
      { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
      { id: 10, name: 'Alcides Antonio', avatar: '/assets/avatar-10.png' },
    ],
    unreadCount: 2,
  },
] satisfies Thread[];

const messages = [
  {
    id: 11,
    threadId: 'TRD-004',
    type: 'text',
    content: 'Hi, how are you?',
    author: { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
    createdAt: dayjs().subtract(10, 'minute').toDate(),
  },
  {
    id: 10,
    threadId: 'TRD-003',
    type: 'text',
    content: 'Are you available for a call?',
    author: { id: 5, name: 'Fran Perez', avatar: '/assets/avatar-5.png' },
    createdAt: dayjs().subtract(5, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 9,
    threadId: 'TRD-002',
    type: 'text',
    content: 'Hello everyone 😀',
    author: { id: 1, name: 'Miron Vitold', avatar: '/assets/avatar-1.png' },
    createdAt: dayjs().subtract(56, 'minute').subtract(2, 'hour').toDate(),
  },
  {
    id: 8,
    threadId: 'TRD-002',
    type: 'text',
    content: 'Hi!',
    author: { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
    createdAt: dayjs().subtract(51, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 7,
    threadId: 'TRD-002',
    type: 'text',
    content: 'Hey, would you like to collaborate?',
    author: { id: 7, name: 'Nasimiyu Danai', avatar: '/assets/avatar-7.png' },
    createdAt: dayjs().subtract(46, 'minute').subtract(5, 'hour').toDate(),
  },
  {
    id: 6,
    threadId: 'TRD-001',
    type: 'image',
    content: '/assets/image-abstract-1.png',
    author: { id: 10, name: 'Alcides Antonio', avatar: '/assets/avatar-10.png' },
    createdAt: dayjs().subtract(1, 'hour').subtract(2, 'day').toDate(),
  },
  {
    id: 5,
    threadId: 'TRD-001',
    type: 'text',
    content: 'Ok, I will think about it. Thanks!',
    author: { id: 10, name: 'Alcides Antonio', avatar: '/assets/avatar-10.png' },
    createdAt: dayjs().subtract(2, 'hour').subtract(2, 'day').toDate(),
  },
  {
    id: 4,
    threadId: 'TRD-001',
    type: 'text',
    content: "I'm sorry, I can't go lower than $45.",
    author: { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
    createdAt: dayjs().subtract(3, 'hour').subtract(3, 'day').toDate(),
  },
  {
    id: 3,
    threadId: 'TRD-001',
    type: 'text',
    content: "Can't you make it $40? I'm on a tight budget.",
    author: { id: 10, name: 'Alcides Antonio', avatar: '/assets/avatar-10.png' },
    createdAt: dayjs().subtract(5, 'hour').subtract(3, 'day').toDate(),
  },
  {
    id: 2,
    threadId: 'TRD-001',
    type: 'text',
    content: 'Sure, it is $50 per hour.',
    author: { id: 0, name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
    createdAt: dayjs().subtract(2, 'hour').subtract(4, 'day').toDate(),
  },
  {
    id: 1,
    threadId: 'TRD-001',
    type: 'text',
    content: "I'm interested in your services, can you tell me more about your hourly rate?",
    author: { id: 10, name: 'Alcides Antonio', avatar: '/assets/avatar-10.png' },
    createdAt: dayjs().subtract(5, 'hour').subtract(4, 'day').toDate(),
  },
] satisfies Message[];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <ChatProvider contacts={contacts} messages={messages} threads={threads}>
      <ChatView>{children}</ChatView>
    </ChatProvider>
  );
}
