import Stripe from 'stripe';
import * as Yup from 'yup';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, item) => {
    return (item.price * item.quantity) + acc;
  }, 0);
  
  return Math.round(total * 100);
};

class CreatePaymentIntentController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required('A lista de produtos é obrigatória')
        .min(1, 'Pelo menos um produto deve ser enviado')
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().positive().integer().required(),
            price: Yup.number().positive().required(),
          }),
        ),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
      
      const { products } = request.body;
      const amount = calculateOrderAmount(products);

      if (amount < 50) {
        return response.status(400).json({ error: "O valor total é muito baixo para processar." });
      }

      // ✅ CORREÇÃO AQUI
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        payment_method_types: ['card'], // ✅ Especifica cartão
        metadata: {
          order_id: `order_${Date.now()}`,
          total_products: products.length
        }
      });

      return response.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return response.status(400).json({ errors: err.errors });
      }
      
      console.error('Stripe Error:', err.message);
      return response.status(500).json({ error: 'Erro interno ao processar pagamento.' });
    }
  }
}

export default new CreatePaymentIntentController();
