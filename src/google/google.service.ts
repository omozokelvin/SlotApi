import { BadRequestException, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private readonly oauth2Client = new OAuth2Client();

  async getUserProfile(idToken: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new BadRequestException('Invalid token payload');
    }

    return payload;
  }
}
