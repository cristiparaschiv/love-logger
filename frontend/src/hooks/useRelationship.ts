import { useCallback, useEffect, useMemo } from 'react';
import { useRelationshipStore } from '../store/relationshipStore';
import { relationshipService } from '../services/relationship.service';
import { websocketService } from '../services/websocket.service';
import { RelationshipConfig } from '../types/relationship.types';

export const useRelationship = () => {
  const { config, isLoading, setConfig, setLoading } = useRelationshipStore();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await relationshipService.getConfig();
      setConfig(data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, [setConfig, setLoading]);

  const setStartDate = useCallback(
    async (startDate: string) => {
      const updated = await relationshipService.setStartDate(startDate);
      setConfig(updated);
    },
    [setConfig]
  );

  const daysTogether = useMemo(() => {
    if (!config?.startDate) return null;
    const start = new Date(config.startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [config?.startDate]);

  useEffect(() => {
    const handleUpdated = (data: unknown) => {
      setConfig((data as { config: RelationshipConfig }).config);
    };

    websocketService.on('relationship:updated', handleUpdated);
    return () => {
      websocketService.off('relationship:updated', handleUpdated);
    };
  }, [setConfig]);

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, isLoading, daysTogether, setStartDate };
};
