export interface TermiiSmsSuccess {
  code: 'ok';
  balance: number;
  message_id: string;
  message: string;
  user: string;
}

export interface TermiiBalanceSuccess {
  application: string;
  balance: number;
  currency: 'NGN';
  user: string;
}

export enum TermiiSmsChannelEnum {
  GENERIC = 'generic',
  DND = 'dnd',
  WHATSAPP = 'whatsapp',
}

export enum TermiiSmsTypeEnum {
  PLAIN = 'plain',
}

export interface TermiiWebhookEvent {
  event: 'charge.completed';
  data: TermiiSmsSuccess;
}
