import type { AuthSession } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

const getProfiles = async (session: AuthSession) => {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select('id, updated_at, full_name, avatar_url, shared_songs')
            .not('id', 'eq', session.user.id);
        
        return { data, error, status };
    } catch (error) {
        throw new Error('Error fetching profiles: ' + error);
    }
};

export default getProfiles;
