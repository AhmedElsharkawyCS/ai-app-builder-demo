import { useQuery } from '@tanstack/react-query';

import { queryMongo } from '../api/mongo';
import { SegmentCode } from '../types/segmentCodes';

interface MerchantCountRow {
  is_marketplace: boolean;
  count: number;
}

interface SessionCountRow {
  is_marketplace: boolean;
  total_sessions: number;
}

export interface BusinessStats {
  merchantsBusiness: number;
  merchantsMarketplace: number;
  sessionsBusiness: number;
  sessionsMarketplace: number;
}

export function useBusinessStats() {
  return useQuery<BusinessStats>({
    queryKey: ['mongo', 'business-stats'],
    queryFn: async () => {
      const segmentsPipeline = [
        { $unwind: '$segments' },
        { $match: { 'segments.code': SegmentCode.BUSINESS } },
        { $unwind: '$segments.countries' },
        { $unwind: '$segments.countries.entities' },
        { $unwind: '$segments.countries.entities.merchants' },
        {
          $group: {
            _id: '$segments.id',
            has_marketplace: { $max: '$segments.countries.entities.merchants.marketplace' },
          },
        },
        {
          $group: {
            _id: '$has_marketplace',
            count: { $sum: 1 },
          },
        },
        { $match: { _id: { $ne: null } } },
        {
          $project: {
            _id: 0,
            is_marketplace: '$_id',
            count: 1,
          },
        },
      ];

      const sessionsPipeline = [
        { $unwind: '$segments' },
        { $match: { 'segments.code': SegmentCode.BUSINESS } },
        { $unwind: '$segments.countries' },
        { $unwind: '$segments.countries.entities' },
        { $unwind: '$segments.countries.entities.merchants' },
        {
          $group: {
            _id: {
              session_id: '$_id',
              segment_id: '$segments.id',
            },
            has_marketplace: { $max: '$segments.countries.entities.merchants.marketplace' },
          },
        },
        {
          $group: {
            _id: '$has_marketplace',
            total_sessions: { $sum: 1 },
          },
        },
        { $match: { _id: { $ne: null } } },
        {
          $project: {
            _id: 0,
            is_marketplace: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const [segmentRows, sessionRows] = await Promise.all([
        queryMongo<MerchantCountRow>('taposusersessions', segmentsPipeline),
        queryMongo<SessionCountRow>('taposusersessions', sessionsPipeline),
      ]);

      const merchantsBusiness = segmentRows.find((r) => r.is_marketplace === false)?.count ?? 0;
      const merchantsMarketplace = segmentRows.find((r) => r.is_marketplace === true)?.count ?? 0;
      const sessionsBusiness = sessionRows.find((r) => r.is_marketplace === false)?.total_sessions ?? 0;
      const sessionsMarketplace = sessionRows.find((r) => r.is_marketplace === true)?.total_sessions ?? 0;

      return {
        merchantsBusiness,
        merchantsMarketplace,
        sessionsBusiness,
        sessionsMarketplace,
      };
    },
    retry: 1,
  });
}

// ── Development House Stats ─────────────────────────────────────────────────

interface DevelopmentSegmentCountRow {
  segment_code: string;
  count: number;
}

interface DevelopmentSessionCountRow {
  segment_code: string;
  total_sessions: number;
}

export interface DevelopmentStats {
  developmentHouse: { segments: number; sessions: number };
  freelanceDeveloper: { segments: number; sessions: number };
}

export function useDevelopmentStats() {
  return useQuery<DevelopmentStats>({
    queryKey: ['mongo', 'development-stats'],
    queryFn: async () => {
      const segmentsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { 
              $in: [
                SegmentCode.DEVELOPMENT_HOUSE,
                SegmentCode.FREELANCE_DEVELOPER,
              ] 
            },
          },
        },
        {
          $group: {
            _id: {
              segment_code: '$segments.code',
              segment_id: '$segments.id',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            count: 1,
          },
        },
      ];

      const sessionsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { 
              $in: [
                SegmentCode.DEVELOPMENT_HOUSE,
                SegmentCode.FREELANCE_DEVELOPER,
              ] 
            },
          },
        },
        {
          $group: {
            _id: {
              session_id: '$_id',
              segment_id: '$segments.id',
              segment_code: '$segments.code',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            total_sessions: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const [segmentRows, sessionRows] = await Promise.all([
        queryMongo<DevelopmentSegmentCountRow>('taposusersessions', segmentsPipeline),
        queryMongo<DevelopmentSessionCountRow>('taposusersessions', sessionsPipeline),
      ]);

      const getCount = (rows: DevelopmentSegmentCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.count ?? 0;
      const getSessions = (rows: DevelopmentSessionCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.total_sessions ?? 0;

      return {
        developmentHouse: {
          segments: getCount(segmentRows, SegmentCode.DEVELOPMENT_HOUSE),
          sessions: getSessions(sessionRows, SegmentCode.DEVELOPMENT_HOUSE),
        },
        freelanceDeveloper: {
          segments: getCount(segmentRows, SegmentCode.FREELANCE_DEVELOPER),
          sessions: getSessions(sessionRows, SegmentCode.FREELANCE_DEVELOPER),
        },
      };
    },
    retry: 1,
  });
}

// ── Platform Stats ──────────────────────────────────────────────────────────

interface PlatformSegmentCountRow {
  segment_code: string;
  count: number;
}

interface PlatformSessionCountRow {
  segment_code: string;
  total_sessions: number;
}

export interface PlatformStats {
  commerce: { segments: number; sessions: number };
  billing: { segments: number; sessions: number };
  retail: { segments: number; sessions: number };
  appCommerce: { segments: number; sessions: number };
}

export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: ['mongo', 'platform-stats'],
    queryFn: async () => {
      const segmentsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { 
              $in: [
                SegmentCode.COMMERCE_PLATFORM,
                SegmentCode.BILLING_PLATFORM,
                SegmentCode.RETAIL_PLATFORM,
                SegmentCode.APP_COMMERCE,
              ] 
            },
          },
        },
        {
          $group: {
            _id: {
              segment_code: '$segments.code',
              segment_id: '$segments.id',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            count: 1,
          },
        },
      ];

      const sessionsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { 
              $in: [
                SegmentCode.COMMERCE_PLATFORM,
                SegmentCode.BILLING_PLATFORM,
                SegmentCode.RETAIL_PLATFORM,
                SegmentCode.APP_COMMERCE,
              ] 
            },
          },
        },
        {
          $group: {
            _id: {
              session_id: '$_id',
              segment_id: '$segments.id',
              segment_code: '$segments.code',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            total_sessions: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const [segmentRows, sessionRows] = await Promise.all([
        queryMongo<PlatformSegmentCountRow>('taposusersessions', segmentsPipeline),
        queryMongo<PlatformSessionCountRow>('taposusersessions', sessionsPipeline),
      ]);

      const getCount = (rows: PlatformSegmentCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.count ?? 0;
      const getSessions = (rows: PlatformSessionCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.total_sessions ?? 0;

      return {
        commerce: {
          segments: getCount(segmentRows, SegmentCode.COMMERCE_PLATFORM),
          sessions: getSessions(sessionRows, SegmentCode.COMMERCE_PLATFORM),
        },
        billing: {
          segments: getCount(segmentRows, SegmentCode.BILLING_PLATFORM),
          sessions: getSessions(sessionRows, SegmentCode.BILLING_PLATFORM),
        },
        retail: {
          segments: getCount(segmentRows, SegmentCode.RETAIL_PLATFORM),
          sessions: getSessions(sessionRows, SegmentCode.RETAIL_PLATFORM),
        },
        appCommerce: {
          segments: getCount(segmentRows, SegmentCode.APP_COMMERCE),
          sessions: getSessions(sessionRows, SegmentCode.APP_COMMERCE),
        },
      };
    },
    retry: 1,
  });
}

// ── Payment Stats ───────────────────────────────────────────────────────────

interface PaymentSegmentCountRow {
  segment_code: string;
  count: number;
}

interface PaymentSessionCountRow {
  segment_code: string;
  total_sessions: number;
}

export interface PaymentStats {
  acquirer: { segments: number; sessions: number };
  facilitator: { segments: number; sessions: number };
  gateway: { segments: number; sessions: number };
  technology: { segments: number; sessions: number };
  orchestration: { segments: number; sessions: number };
  issuer: { segments: number; sessions: number };
  scheme: { segments: number; sessions: number };
}

export function usePaymentStats() {
  return useQuery<PaymentStats>({
    queryKey: ['mongo', 'payment-stats'],
    queryFn: async () => {
      const segmentsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': {
              $in: [
                SegmentCode.PAYMENT_ACQUIRER,
                SegmentCode.PAYMENT_FACILITATOR,
                SegmentCode.PAYMENT_GATEWAY_PROVIDER,
                SegmentCode.PAYMENT_TECHNOLOGY,
                SegmentCode.PAYMENT_TECHNOLOGY_ORCHESTRATION_PROVIDER,
                SegmentCode.PAYMENT_ISSUER,
                SegmentCode.PAYMENT_SCHEME,
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              segment_code: '$segments.code',
              segment_id: '$segments.id',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            count: 1,
          },
        },
      ];

      const sessionsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': {
              $in: [
                SegmentCode.PAYMENT_ACQUIRER,
                SegmentCode.PAYMENT_FACILITATOR,
                SegmentCode.PAYMENT_GATEWAY_PROVIDER,
                SegmentCode.PAYMENT_TECHNOLOGY,
                SegmentCode.PAYMENT_TECHNOLOGY_ORCHESTRATION_PROVIDER,
                SegmentCode.PAYMENT_ISSUER,
                SegmentCode.PAYMENT_SCHEME,
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              session_id: '$_id',
              segment_id: '$segments.id',
              segment_code: '$segments.code',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            total_sessions: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const [segmentRows, sessionRows] = await Promise.all([
        queryMongo<PaymentSegmentCountRow>('taposusersessions', segmentsPipeline),
        queryMongo<PaymentSessionCountRow>('taposusersessions', sessionsPipeline),
      ]);

      const getCount = (rows: PaymentSegmentCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.count ?? 0;
      const getSessions = (rows: PaymentSessionCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.total_sessions ?? 0;

      return {
        acquirer: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_ACQUIRER),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_ACQUIRER),
        },
        facilitator: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_FACILITATOR),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_FACILITATOR),
        },
        gateway: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_GATEWAY_PROVIDER),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_GATEWAY_PROVIDER),
        },
        technology: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_TECHNOLOGY),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_TECHNOLOGY),
        },
        orchestration: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_TECHNOLOGY_ORCHESTRATION_PROVIDER),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_TECHNOLOGY_ORCHESTRATION_PROVIDER),
        },
        issuer: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_ISSUER),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_ISSUER),
        },
        scheme: {
          segments: getCount(segmentRows, SegmentCode.PAYMENT_SCHEME),
          sessions: getSessions(sessionRows, SegmentCode.PAYMENT_SCHEME),
        },
      };
    },
    retry: 1,
  });
}

// ── Regulator Stats ─────────────────────────────────────────────────────────

interface RegulatorSegmentCountRow {
  segment_code: string;
  count: number;
}

interface RegulatorSessionCountRow {
  segment_code: string;
  total_sessions: number;
}

export interface RegulatorStats {
  commercial: { segments: number; sessions: number };
  financial: { segments: number; sessions: number };
}

export function useRegulatorStats() {
  return useQuery<RegulatorStats>({
    queryKey: ['mongo', 'regulator-stats'],
    queryFn: async () => {
      const segmentsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { $in: [SegmentCode.COMMERCIAL_REGULATOR, SegmentCode.FINANCIAL_REGULATOR] },
          },
        },
        {
          $group: {
            _id: {
              segment_code: '$segments.code',
              segment_id: '$segments.id',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            count: 1,
          },
        },
      ];

      const sessionsPipeline = [
        { $unwind: '$segments' },
        {
          $match: {
            'segments.code': { $in: [SegmentCode.COMMERCIAL_REGULATOR, SegmentCode.FINANCIAL_REGULATOR] },
          },
        },
        {
          $group: {
            _id: {
              session_id: '$_id',
              segment_id: '$segments.id',
              segment_code: '$segments.code',
            },
          },
        },
        {
          $group: {
            _id: '$_id.segment_code',
            total_sessions: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            segment_code: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const [segmentRows, sessionRows] = await Promise.all([
        queryMongo<RegulatorSegmentCountRow>('taposusersessions', segmentsPipeline),
        queryMongo<RegulatorSessionCountRow>('taposusersessions', sessionsPipeline),
      ]);

      const getCount = (rows: RegulatorSegmentCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.count ?? 0;
      const getSessions = (rows: RegulatorSessionCountRow[], code: string) =>
        rows.find((r) => r.segment_code === code)?.total_sessions ?? 0;

      return {
        commercial: {
          segments: getCount(segmentRows, SegmentCode.COMMERCIAL_REGULATOR),
          sessions: getSessions(sessionRows, SegmentCode.COMMERCIAL_REGULATOR),
        },
        financial: {
          segments: getCount(segmentRows, SegmentCode.FINANCIAL_REGULATOR),
          sessions: getSessions(sessionRows, SegmentCode.FINANCIAL_REGULATOR),
        },
      };
    },
    retry: 1,
  });
}

// ── Individual Stats ────────────────────────────────────────────────────────

interface IndividualRow {
  individual_id: string;
  total_sessions: number;
}

export interface IndividualStats {
  uniqueIndividuals: number;
  totalSessions: number;
}

export function useIndividualStats() {
  return useQuery<IndividualStats>({
    queryKey: ['mongo', 'individual-stats'],
    queryFn: async () => {
      const pipeline = [
        {
          $group: {
            _id: '$individual_id',
            total_sessions: { $sum: 1 },
          },
        },
        { $sort: { total_sessions: -1 } },
        {
          $project: {
            _id: 0,
            individual_id: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const rows = await queryMongo<IndividualRow>('taposusersessions', pipeline);

      const uniqueIndividuals = rows.length;
      const totalSessions = rows.reduce((sum, row) => sum + row.total_sessions, 0);

      return {
        uniqueIndividuals,
        totalSessions,
      };
    },
    retry: 1,
  });
}
