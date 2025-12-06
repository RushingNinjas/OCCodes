import type { Channel, DispatchRecipient, ChannelDelivery } from '../types';

// Stub service for email dispatch
export async function sendEmail(
  _to: string,
  _subject: string,
  _body: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Stub implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: Math.random() > 0.1, // 90% success rate
    messageId: `email-${Date.now()}`,
  };
}

// Stub service for SMS dispatch
export async function sendSMS(
  _to: string,
  _message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Stub implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    success: Math.random() > 0.15, // 85% success rate
    messageId: `sms-${Date.now()}`,
  };
}

// Stub service for pager dispatch
export async function sendPager(
  _to: string,
  _message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Stub implementation
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    success: Math.random() > 0.2, // 80% success rate
    messageId: `pager-${Date.now()}`,
  };
}

// Stub service for voice/TTS dispatch
export async function sendVoiceCall(
  _to: string,
  _ttsScript: string
): Promise<{ success: boolean; callId?: string; error?: string }> {
  // Stub implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: Math.random() > 0.25, // 75% success rate
    callId: `voice-${Date.now()}`,
  };
}

// Stub service for multi-channel dispatch
export async function dispatchToChannels(
  recipient: DispatchRecipient,
  channels: Channel[],
  messageBody: string,
  ttsScript?: string
): Promise<ChannelDelivery[]> {
  const results: ChannelDelivery[] = [];

  for (const channel of channels) {
    let result: { success: boolean; messageId?: string; error?: string } = {
      success: false,
    };

    switch (channel) {
      case 'email':
        if (recipient.email) {
          result = await sendEmail(recipient.email, 'Code Dispatch', messageBody);
        }
        break;
      case 'sms':
        if (recipient.phone) {
          result = await sendSMS(recipient.phone, messageBody);
        }
        break;
      case 'pager':
        if (recipient.phone) {
          result = await sendPager(recipient.phone, messageBody);
        }
        break;
      case 'voice':
        if (recipient.phone && ttsScript) {
          result = await sendVoiceCall(recipient.phone, ttsScript);
        }
        break;
    }

    results.push({
      channel,
      status: result.success ? 'delivered' : 'failed',
      sentAt: new Date().toISOString(),
      deliveredAt: result.success ? new Date().toISOString() : undefined,
      failedAt: result.success ? undefined : new Date().toISOString(),
      error: result.error,
      retryCount: 0,
    });
  }

  return results;
}

// Stub service for database operations
export const dbService = {
  async getTemplates(): Promise<any[]> {
    return [];
  },
  async getTemplate(_id: string): Promise<any | null> {
    return null;
  },
  async createTemplate(template: any): Promise<any> {
    return { ...template, id: `template-${Date.now()}` };
  },
  async updateTemplate(_id: string, template: any): Promise<any> {
    return template;
  },
  async getDistributionLists(): Promise<any[]> {
    return [];
  },
  async getDistributionList(_id: string): Promise<any | null> {
    return null;
  },
  async createDistributionList(list: any): Promise<any> {
    return { ...list, id: `list-${Date.now()}` };
  },
  async updateDistributionList(_id: string, list: any): Promise<any> {
    return list;
  },
  async getUsers(): Promise<any[]> {
    return [];
  },
  async getDispatchEvents(_filters?: any): Promise<any[]> {
    return [];
  },
  async createDispatchEvent(event: any): Promise<any> {
    return { ...event, id: `event-${Date.now()}` };
  },
  async createAuditLog(log: any): Promise<any> {
    return log;
  },
};

