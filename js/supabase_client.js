// Supabase Configuration
// Replace with your actual keys from the Supabase Dashboard
const SUPABASE_URL = 'https://wpvbwsbqtoshgavgdoli.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Please paste your full Anon Key here

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = 'index.html';
}

async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase.from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw error;
    return data;
}
