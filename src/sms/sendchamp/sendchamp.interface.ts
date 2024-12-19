import { HttpStatusCode } from 'axios';

export interface SendChampError {
  message: string;
  errors: string;
  status: number;
  success: boolean;
}

export interface SendChampSuccess<T> {
  status: 'success';
  errors: null;
  code: HttpStatusCode;
  message: string;
  data: T;
}

export type SendChampSmsSent =
  | {
      id: string;
      phone_number: string;
      reference: string;
      status: 'processing';
    }
  | {
      business_id: string;
      total_contacts: number;
      created_at: string;
      updated_at: string;
    };

export enum SendChampSmsRouteEnum {
  DND = 'dnd',
  NON_DND = 'non_dnd',
  INTERNATIONAL = 'international',
}

export interface SendChampSmsWalletBalance {
  business_name: string;
  wallet_balance: string;
}

export interface SendchampWebhookEvent {
  service: string;
  status: string;
  phone_number: string;
  message: string;
  sms_uid: string;
  reference: string;
}
