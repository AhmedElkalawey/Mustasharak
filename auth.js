// ملف auth.js - مسؤول عن تسجيل الدخول والخروج
const auth = {
    // تسجيل الدخول
    async login(email, password) {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return data;
    },

    // تسجيل الخروج
    async logout() {
        await window.supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    },

    // جلب كل الحجوزات مع بيانات الموعد
    async getBookings() {
        const { data, error } = await window.supabaseClient
            .from('bookings')
            .select(`*, slots (day, time)`);
        
        if (error) throw new Error('فشل في جلب الحجوزات');
        return data;
    }
};

window.auth = auth;