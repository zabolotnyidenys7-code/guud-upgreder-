window.bestUpgraderSupabaseConfig = {
  url: 'https://zztmvzyimfxtznimlycj.supabase.co',
  key: 'sb_publishable_-wG81LHnaKm5CT0nUQKe3Q_6s2-LY72'
};
window.bestUpgraderSupabase = window.supabase.createClient(
  window.bestUpgraderSupabaseConfig.url,
  window.bestUpgraderSupabaseConfig.key,
  { auth: { persistSession: localStorage.getItem('bestUpgraderRememberMe') !== 'false' } }
);
