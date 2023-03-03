import { CreateOrderDto } from '../dto';

export type CreateOrderData = CreateOrderDto & Record<'bookingsAmount', number>;
