// ملف api.js - التعامل مع البيانات من السحابة
const api = {
    // 1. جلب كل المواعيد
    async getSlots() {
        const { data, error } = await window.supabaseClient
            .from('slots')
            .select('*')
            .order('created_at', { ascending: true });
            
        if (error) throw new Error('فشل في جلب المواعيد');
        
        // تحويل البيانات لتتوافق مع ما تتوقعه الواجهة
        return data.map(slot => ({
            ...slot,
            available: slot.is_available
        }));
    },

    // 2. جلب موعد واحد بناءً على الـ ID
    async getSlot(id) {
        const { data, error } = await window.supabaseClient
            .from('slots')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) throw new Error('الموعد غير موجود');
        return { ...data, available: data.is_available };
    },

    // 3. حجز موعد (باستخدام الدالة الآمنة على السيرفر)
    async bookSlot(id, userData) {
        // استدعاء الدالة على السيرفر مباشرة (RPC)
        const { data, error } = await window.supabaseClient
            .rpc('book_slot', {
                p_slot_id: id,
                p_client_name: userData.name,
                p_client_email: userData.email
            });

        // لو حصل خطأ في الاتصال بالسيرفر
        if (error) {
            throw new Error('حدث خطأ في الاتصال بالسيرفر');
        }

        // لو السيرفر رجع فشل (الموعد محجوز بالفعل)
        if (!data.success) {
            throw new Error(data.error);
        }

        // نجاح
        return { success: true, bookingId: data.booking_id };
    }
};

// تصدير الـ API للاستخدام العام
window.api = api;
