// Supabase Configuration
// Replace with your actual keys from the Supabase Dashboard
const SUPABASE_URL = 'https://wpvbwsbqtoshgavgdoli.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwdmJ3c2JxdG9zaGdhdmdkb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDM4NjUsImV4cCI6MjA4NzE3OTg2NX0.GGvsvw4E1WiP82x52GxICaNaO71iATks4tyAUAuQkMY'; // Please paste your full Anon Key here

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;

    return data;
}

async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    window.location.href = 'index.html';
}

async function getProfile() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabaseClient.from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw error;
    return data;
}
