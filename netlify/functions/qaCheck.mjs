// netlify/functions/qaCheck.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handler = async (event, context) => {
    const { property_id, status, comment } = JSON.parse(event.body);

    if (!property_id || !status) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Missing required fields' })
        };
    }

    try {
        const { data, error } = await supabase
            .from('qa_checks')
            .insert([{ property_id, status, comment }]);

        if (error) {
            throw new Error(error.message);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'QA check saved successfully' })
        };
    } catch (error) {
        console.error('Error saving QA check:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};