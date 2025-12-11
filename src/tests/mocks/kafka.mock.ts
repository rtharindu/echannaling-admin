// Mock Kafka service for testing
export const mockKafkaService = {
  initialize: jest.fn().mockResolvedValue(undefined),
  shutdown: jest.fn().mockResolvedValue(undefined),
  subscribeToAllEvents: jest.fn().mockResolvedValue(undefined),
  getConnectionStatus: jest.fn().mockReturnValue(true),
};

export const mockSendMessage = jest.fn().mockResolvedValue(undefined);
export const mockSubscribeToTopic = jest.fn().mockResolvedValue(undefined);

// Mock Kafka configuration
jest.mock('@/config/kafka', () => ({
  connectKafka: jest.fn().mockResolvedValue(undefined),
  disconnectKafka: jest.fn().mockResolvedValue(undefined),
  sendMessage: mockSendMessage,
  subscribeToTopic: mockSubscribeToTopic,
  TOPICS: {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    BRANCH_CREATED: 'branch.created',
    BRANCH_UPDATED: 'branch.updated',
    BRANCH_DELETED: 'branch.deleted',
    INVOICE_CREATED: 'invoice.created',
    INVOICE_UPDATED: 'invoice.updated',
    INVOICE_PAID: 'invoice.paid',
    AUDIT_LOG: 'audit.log',
    NOTIFICATION: 'notification.send',
  },
}));

// Mock email service
jest.mock('@/services/EmailService', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendInvoiceNotification: jest.fn().mockResolvedValue(true),
    sendCustomEmail: jest.fn().mockResolvedValue(true),
    sendBulkEmail: jest.fn().mockResolvedValue({ success: 1, failed: 0 }),
    sendNotificationEmail: jest.fn().mockResolvedValue(true),
  })),
}));

// Mock audit service
jest.mock('@/services/AuditService', () => ({
  AuditService: jest.fn().mockImplementation(() => ({
    log: jest.fn().mockResolvedValue(undefined),
    getAuditLogs: jest.fn().mockResolvedValue({ auditLogs: [], total: 0, page: 1, limit: 10, totalPages: 0 }),
    getAuditStats: jest.fn().mockResolvedValue({ total: 0, byAction: {}, byResource: {}, byUser: [], recentActivity: 0 }),
    getRecentActivity: jest.fn().mockResolvedValue([]),
    getResourceHistory: jest.fn().mockResolvedValue([]),
    getUserActivity: jest.fn().mockResolvedValue([]),
    cleanupOldLogs: jest.fn().mockResolvedValue(0),
  })),
}));
