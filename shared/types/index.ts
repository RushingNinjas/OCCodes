export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type Channel = 'email' | 'sms' | 'pager' | 'voice';

export type TemplateStatus = 'active' | 'inactive' | 'archived';

export type DeliveryStatus = 'pending' | 'delivered' | 'failed';

export type DistributionListTag = 'static' | 'editable' | 'operator-must-add';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'manager' | 'operator';
  department?: string;
  specialty?: string;
  location?: string;
  permissions: {
    canSendHighSeverity: boolean;
    canModifyDistributionLists: boolean;
    canAddOneTimeRecipients: boolean;
  };
}

export interface DistributionList {
  id: string;
  name: string;
  description?: string;
  members: DistributionListMember[];
  tag: DistributionListTag;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionListMember {
  userId?: string;
  deviceId?: string;
  role?: string;
  onCallGroupId?: string;
  email?: string;
  phone?: string;
  name: string;
  channelPreferences?: Channel[];
}

export interface TemplateVariable {
  key: string;
  label: string;
  required: boolean;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  channels: Channel[];
  messageBody: string;
  ttsScript?: string;
  requiredFields: TemplateVariable[];
  distributionListIds: string[];
  routingRules: {
    fixedLists: string[];
    dynamicRecipients: boolean;
    deviceTypePreferences?: Record<string, Channel[]>;
  };
  status: TemplateStatus;
  version: number;
  versionHistory: TemplateVersion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TemplateVersion {
  version: number;
  timestamp: string;
  editor: string;
  changes: string;
}

export interface DispatchEvent {
  id: string;
  templateId: string;
  templateName: string;
  operatorId: string;
  operatorName: string;
  inputParameters: Record<string, string>;
  recipients: DispatchRecipient[];
  status: 'pending' | 'dispatched' | 'completed' | 'failed';
  dispatchedAt: string;
  completedAt?: string;
}

export interface DispatchRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  channels: ChannelDelivery[];
  acknowledged?: boolean;
  acknowledgedAt?: string;
}

export interface ChannelDelivery {
  channel: Channel;
  status: DeliveryStatus;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  error?: string;
  retryCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'template' | 'distribution-list' | 'user' | 'dispatch';
  entityId: string;
  changes?: string;
  ipAddress?: string;
}

