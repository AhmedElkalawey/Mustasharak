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
            available: slot.is_available // نطابق اسم المتغير مع الواجهة
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

    // 3. حجز موعد
    async bookSlot(id, userData) {
        // أولاً: إضافة الحجز في جدول الحجوزات
        const { error: bookingError } = await window.supabaseClient
            .from('bookings')
            .insert([{ 
                slot_id: id, 
                client_name: userData.name, 
                client_email: userData.email 
            }]);

        if (bookingError) throw new Error('حدث خطأ أثناء حفظ الحجز');

        // ثانياً: تحديث حالة الموعد إلى "محجوز"
        const { error: slotError } = await window.supabaseClient
            .from('slots')
            .update({ is_available: false })
            .eq('id', id);

        if (slotError) throw new Error('تم الحجز ولكن فشل تحديث حالة الموعد');

        return { success: true };
    }
};

// تصدير الـ API للاستخدام العام
window.api = api;