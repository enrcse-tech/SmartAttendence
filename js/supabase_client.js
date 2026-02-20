// Supabase Configuration
const SUPABASE_URL = 'https://wpvbwsbqtoshgavgdoli.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwdmJ3c2JxdG9zaGdhbmdkb2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzE3MTQsImV4cCI6MjA1NTc0NzcxNH0.7QW-_jJ9-999-999-999-999-999-999-999-999-999'; // Note: Replace with EXACT key if this is truncated

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
