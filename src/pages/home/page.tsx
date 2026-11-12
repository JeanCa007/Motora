import { useCallback, useEffect, useState } from 'react';
import SiteHeader from '@/components/feature/SiteHeader';
import SiteFooter from '@/components/feature/SiteFooter';
import Hero from '@/pages/home/components/Hero';
import { BrandStrip, BodyTypeGrid } from '@/pages/home/components/BrandStrip';
import VehicleGridSection from '@/pages/home/components/VehicleGridSection';
import { HowItWorks, SellBanner, TrustSection } from '@/pages/home/components/HomeSections';
import { supabase } from '@/lib/supabase';
import type { Vehicle } from '@/types';

export default function Home() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [recent, setRecent] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [featuredRes, recentRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'active')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(6),
      ]);
      if (featuredRes.error) throw featuredRes.error;
      if (recentRes.error) throw recentRes.error;
      setFeatured((featuredRes.data ?? []) as Vehicle[]);
      setRecent((recentRes.data ?? []) as Vehicle[]);
    } catch {
      setError('No pudimos cargar los vehículos en este momento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <BrandStrip />
        <VehicleGridSection
          eyebrow="Selección Motora"
          title="Vehículos destacados de la semana"
          description="Los anuncios más consultados por los compradores, con precios competitivos y vendedores de confianza."
          vehicles={featured}
          loading={loading}
          error={error}
          onRetry={load}
          viewAllHref="/autos"
        />
        <BodyTypeGrid />
        <VehicleGridSection
          eyebrow="Recién publicados"
          title="Los últimos autos en llegar"
          description="Anuncios nuevos de todas las provincias. Si te gusta uno, escribile directo al vendedor."
          vehicles={recent}
          loading={loading}
          error={error}
          onRetry={load}
          viewAllHref="/autos?sort=recent"
          theme="muted"
        />
        <SellBanner />
        <HowItWorks />
        <TrustSection />
      </main>
      <SiteFooter />
    </div>
  );
}