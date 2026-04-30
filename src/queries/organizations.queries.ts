import { useQuery } from '@tanstack/react-query';

import { queryMongo } from '../api/mongo';

interface OrgSessionRow {
  organization_id: string;
  total_sessions: number;
}

export interface OrgStats {
  activeOrgs: number;
  totalSessions: number;
}

export function useOrgStats() {
  return useQuery<OrgStats>({
    queryKey: ['mongo', 'org-stats'],
    queryFn: async () => {
      const pipeline = [
        { $unwind: '$segments' },
        {
          $group: {
            _id: {
              session_id: '$_id',
              organization_id: '$segments.organization_id',
            },
          },
        },
        {
          $group: {
            _id: '$_id.organization_id',
            total_sessions: { $sum: 1 },
          },
        },
        { $sort: { total_sessions: -1 } },
        {
          $project: {
            _id: 0,
            organization_id: '$_id',
            total_sessions: 1,
          },
        },
      ];

      const rows = await queryMongo<OrgSessionRow>('taposusersessions', pipeline);

      const activeOrgs = rows.length;
      const totalSessions = rows.reduce((sum, row) => sum + row.total_sessions, 0);

      return { activeOrgs, totalSessions };
    },
    retry: 1,
  });
}
