document.addEventListener('DOMContentLoaded', () => {
    const slotsContainer = document.getElementById('slots-container');
    const bookingForm = document.getElementById('booking-form');

    if (slotsContainer) {
        initIndexPage();
    }

    if (bookingForm) {
        initBookingPage();
    }
});

// --- Logic for index.html ---
async function initIndexPage() {
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-message');
    const container = document.getElementById('slots-container');

    try {
        const slots = await window.api.getSlots();
        loading.classList.add('hidden');
        container.classList.remove('hidden');

        if (slots.length === 0) {
            container.innerHTML = '<p class="text-slate-400 text-center col-span-full font-cairo">لا توجد مواعيد متاحة حالياً.</p>';
            return;
        }

        let cardsHTML = '';
        slots.forEach(slot => {
            const parts = slot.time.split(' - ');
            const day = parts[0] || 'موعد';
            const time = parts[1] || slot.time;

            if (slot.available) {
                cardsHTML += `
                    <div class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.5)] hover:border-purple-500/50 hover:bg-white/10 flex flex-col justify-between h-full">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-slate-200 font-bold text-lg">${day}</div>
                            <span class="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">متاح</span>
                        </div>
                        <div class="mb-6">
                            <div class="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                                ${time} 
                            </div>
                        </div>
                        <a href="booking.html?slotId=${slot.id}" class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 flex items-center justify-center gap-2 text-center">
                            <span>احجز الآن</span>
                            <svg class="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                    </div>
                `;
            } else {
                cardsHTML += `
                    <div class="relative bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-6 opacity-60 flex flex-col justify-between grayscale-[50%] h-full">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-slate-400 font-bold text-lg">${day}</div>
                            <span class="px-3 py-1 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">محجوز</span>
                        </div>
                        <div class="mb-6">
                            <div class="text-3xl font-black text-slate-500 tracking-tight flex items-baseline gap-1">
                                ${time}
                            </div>
                        </div>
                        <button disabled class="w-full py-3 rounded-xl bg-white/5 text-slate-500 font-bold text-base cursor-not-allowed border border-white/5">غير متاح</button>
                    </div>
                `;
            }
        });
        container.innerHTML = cardsHTML;

    } catch (err) {
        loading.classList.add('hidden');
        errorMsg.textContent = 'حدث خطأ أثناء تحميل المواعيد.';
        errorMsg.classList.remove('hidden');
    }
}

// --- Logic for booking.html ---
async function initBookingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const slotId = urlParams.get('slotId');
    
    const loading = document.getElementById('loading');
    const section = document.getElementById('booking-section');
    const form = document.getElementById('booking-form');
    const timeDisplay = document.getElementById('slot-time-display');
    const slotInput = document.getElementById('slot-id');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    loading.className = "text-center text-xl font-bold animate-pulse text-indigo-400 mb-8";

    if (!slotId) {
        loading.textContent = 'رقم الموعد غير صحيح.';
        loading.className = 'text-center text-red-400 font-bold text-xl mb-8';
        return;
    }

    try {
        const slot = await window.api.getSlot(slotId);
        
        if (!slot.available) {
            loading.textContent = 'عذراً، هذا الموعد لم يعد متاحاً.';
            loading.className = 'text-center text-red-400 font-bold text-xl mb-8';
            return;
        }

        loading.classList.add('hidden');
        section.classList.remove('hidden');
        
        timeDisplay.textContent = slot.time;
        slotInput.value = slot.id;

    } catch (err) {
        loading.textContent = err.message;
        loading.className = 'text-center text-red-400 font-bold text-xl mb-8';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            جاري المعالجة...
        `;
        
        feedback.className = 'hidden';

        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };

        try {
            await window.api.bookSlot(slotId, userData);
            
            form.classList.add('hidden');
            feedback.innerHTML = '<svg class="w-6 h-6 inline ml-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> تم تأكيد حجزك بنجاح! شكراً لك.';
            feedback.className = 'text-emerald-400 font-bold text-xl text-center mt-6';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (err) {
            feedback.textContent = err.message;
            feedback.className = 'text-red-400 font-bold text-center mt-6';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'تأكيد الحجز';
        }
    });
}