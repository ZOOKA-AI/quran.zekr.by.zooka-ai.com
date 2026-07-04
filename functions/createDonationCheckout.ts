import Stripe from 'npm:stripe@17.4.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const { amount, currency = 'aed', donationType, donorName, donorEmail } = await req.json();

    // التحقق من المبلغ
    if (!amount || amount < 1) {
      return Response.json({ error: 'المبلغ غير صالح' }, { status: 400 });
    }

    // تحويل المبلغ إلى أصغر وحدة (فلس)
    const amountInCents = Math.round(amount * 100);

    // إنشاء جلسة الدفع
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: donationType || 'تبرع عام',
              description: `تبرع بمبلغ ${amount} ${currency.toUpperCase()} - ${donationType || 'صدقة جارية'}`,
              images: ['https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400'],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      customer_email: donorEmail || undefined,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        donor_name: donorName || 'متبرع مجهول',
        donation_type: donationType || 'تبرع عام',
        amount: amount.toString(),
        currency: currency.toUpperCase(),
      },
      success_url: `${req.headers.get('origin') || 'https://app.base44.com'}?donation=success&amount=${amount}`,
      cancel_url: `${req.headers.get('origin') || 'https://app.base44.com'}?donation=cancelled`,
    });

    console.log('Checkout session created:', session.id);
    
    return Response.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});