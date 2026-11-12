import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useFavorite(vehicleId: string) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || !vehicleId) {
      setIsFavorite(false);
      return;
    }
    let active = true;
    supabase
      .from('favorites')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsFavorite(Boolean(data));
      });
    return () => {
      active = false;
    };
  }, [user, vehicleId]);

  const toggle = useCallback(async () => {
    if (!user) {
      navigate('/ingresar');
      return;
    }
    if (busy || !vehicleId) return;
    setBusy(true);
    try {
      if (isFavorite) {
        await supabase.from('favorites').delete().eq('vehicle_id', vehicleId).eq('user_id', user.id);
        setIsFavorite(false);
      } else {
        await supabase.from('favorites').insert({ vehicle_id: vehicleId, user_id: user.id });
        setIsFavorite(true);
      }
    } finally {
      setBusy(false);
    }
  }, [busy, isFavorite, navigate, user, vehicleId]);

  return { isFavorite, toggle, busy };
}