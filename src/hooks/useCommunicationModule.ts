import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_BULLETIN,
  MOCK_MESSAGES,
  MOCK_SMS_TEMPLATES,
} from '@/data/enterpriseMocks';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const keys = {
  announcements: ['comms', 'announcements'] as const,
  bulletin: ['comms', 'bulletin'] as const,
  messages: ['comms', 'messages'] as const,
  sms: ['comms', 'sms'] as const,
};

export function useAnnouncements() {
  return useQuery({
    queryKey: keys.announcements,
    queryFn: async () => {
      await delay(300);
      return [...MOCK_ANNOUNCEMENTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    },
  });
}

export function useBulletin() {
  return useQuery({
    queryKey: keys.bulletin,
    queryFn: async () => {
      await delay(280);
      return [...MOCK_BULLETIN].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
    },
  });
}

export function useInternalMessages() {
  return useQuery({
    queryKey: keys.messages,
    queryFn: async () => {
      await delay(320);
      return [...MOCK_MESSAGES].sort((a, b) => b.sentAt.localeCompare(a.sentAt));
    },
  });
}

export function useSmsTemplates() {
  return useQuery({
    queryKey: keys.sms,
    queryFn: async () => {
      await delay(250);
      return [...MOCK_SMS_TEMPLATES];
    },
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (messageId: string) => {
      await delay(200);
      const m = MOCK_MESSAGES.find((x) => x.id === messageId);
      if (m) m.read = true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.messages }),
  });
}

export function useSendInternalMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { subject: string; preview: string; toName: string }) => {
      await delay(450);
      MOCK_MESSAGES.unshift({
        id: `m-${Date.now()}`,
        threadId: `t-${Date.now()}`,
        fromName: 'You',
        toName: payload.toName,
        subject: payload.subject,
        preview: payload.preview,
        sentAt: new Date().toISOString(),
        read: true,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.messages }),
  });
}

import { useAuthStore } from '@/store/useAuthStore';
import type { Announcement, AnnouncementPriority, AnnouncementCategory, Attachment } from '@/types/communication';

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      body: string;
      priority: AnnouncementPriority;
      category: AnnouncementCategory;
      scheduledAt?: string;
      attachments?: Attachment[];
    }) => {
      await delay(400);
      if (!user) throw new Error('Not authenticated');

      let targetAudience = 'Members';
      if (user.role === 'UNION_LEADER') targetAudience = 'Field Leaders';
      else if (user.role === 'FIELD_LEADER') targetAudience = 'Zone Leaders';
      else if (user.role === 'ZONE_LEADER') targetAudience = 'Church Leaders';
      else if (user.role === 'CHURCH_LEADER') targetAudience = 'Members';

      const newAnnouncement: Announcement = {
        id: `an-${Date.now()}`,
        title: payload.title,
        body: payload.body,
        priority: payload.priority,
        category: payload.category,
        publishedAt: new Date().toISOString(),
        scheduledAt: payload.scheduledAt,
        author: user.name || 'Leader',
        authorRole: user.role,
        audience: targetAudience,
        unionId: user.unionId,
        fieldId: user.fieldId,
        zoneId: user.zoneId,
        churchId: user.churchId,
        attachments: payload.attachments,
      };

      MOCK_ANNOUNCEMENTS.unshift(newAnnouncement);
      return newAnnouncement;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.announcements });
    },
  });
}

export function useHierarchicalAnnouncements() {
  const { user } = useAuthStore();
  const query = useAnnouncements();

  const filtered = query.data?.filter((a) => {
    if (!user) return false;
    
    // Admins and Managers see everything
    if (user.role === 'ADMIN' || user.role === 'MANAGER') return true;

    // Union Leader: sees what is sent in their Union, or created by them
    if (user.role === 'UNION_LEADER') {
      return a.unionId === user.unionId;
    }

    // Field Leader: sees announcements sent by Union Leaders in their Union, and their own
    if (user.role === 'FIELD_LEADER') {
      const isFromUnion = a.authorRole === 'UNION_LEADER' && a.unionId === user.unionId;
      const isOwn = a.authorRole === 'FIELD_LEADER' && a.fieldId === user.fieldId;
      return isFromUnion || isOwn;
    }

    // Zone Leader: sees announcements sent by Field Leaders in their Field, and their own
    if (user.role === 'ZONE_LEADER') {
      const isFromField = a.authorRole === 'FIELD_LEADER' && a.fieldId === user.fieldId;
      const isOwn = a.authorRole === 'ZONE_LEADER' && a.zoneId === user.zoneId;
      return isFromField || isOwn;
    }

    // Church Leader: sees announcements sent by Zone Leaders in their Zone, and their own
    if (user.role === 'CHURCH_LEADER') {
      const isFromZone = a.authorRole === 'ZONE_LEADER' && a.zoneId === user.zoneId;
      const isOwn = a.authorRole === 'CHURCH_LEADER' && a.churchId === user.churchId;
      return isFromZone || isOwn;
    }

    // Member: sees ONLY announcements sent by their Church Leader
    if (user.role === 'MEMBER') {
      return a.authorRole === 'CHURCH_LEADER' && a.churchId === user.churchId;
    }

    return false;
  }) || [];

  return {
    ...query,
    data: filtered,
  };
}
