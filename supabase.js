// ملف supabase.js - الجسر اللي يربطنا بالسحابة
const SUPABASE_URL = 'https://rgeopbfvgfpxasxstunt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZW9wYmZ2Z2ZweGFzeHN0dW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMDc2NTksImV4cCI6MjEwNTU4MzY1OX0.LM-VASgEInoGnTFTNco62VCD2YPL6Oxa4l0ci1hE0mM';

// تهيئة الاتصال وتخزينه في متغير عام عشان كل الملفات تشوفه
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);