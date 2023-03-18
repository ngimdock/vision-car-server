import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CarService } from 'src/car/car.service';
import { CustomHttpExeption } from 'src/common/exceptions';
import Stripe from 'stripe';
import { CheckoutSessionDto, ProductToBuy } from './dto';
import { EmptyProductException } from './exception';

type CarType = Awaited<ReturnType<CarService['findManyByIds']>>;

@Injectable()
export class PaymentService {
  constructor(
    private readonly carService: CarService,
    private readonly config: ConfigService,
  ) {}

  private readonly stripe = new Stripe(this.config.get('STRIPE_PRIVATE_KEY'), {
    apiVersion: '2022-11-15',
  });

  private allProductsToBuy: ProductToBuy[];

  async checkoutSession(checkoutDto: CheckoutSessionDto) {
    if (!checkoutDto.products.length) throw new EmptyProductException();

    this.allProductsToBuy = checkoutDto.products;

    const productsId = this.getProductsId(checkoutDto.products);

    const cars = await this.carService.findManyByIds(productsId);

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: this.getStripeLineItems(cars),
        success_url: checkoutDto.successUrl,
        cancel_url: checkoutDto.cancelUrl,
      });

      return { url: session.url };
    } catch (err) {
      throw new CustomHttpExeption();
    }
  }

  getProductsId = (products: ProductToBuy[]) =>
    products.map((product) => product.id);

  getStripeLineItems = (products: CarType) => {
    console.log(this.allProductsToBuy);

    const lineItems = products.map(({ id, brand, price }) => {
      const product = this.allProductsToBuy.find(
        ({ id: productId }) => productId === id,
      );

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: brand,
          },
          unit_amount: price,
        },
        quantity: product.quantity,
      };
    });

    return lineItems;
  };
}
