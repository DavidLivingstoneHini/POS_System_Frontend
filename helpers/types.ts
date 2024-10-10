import { ReactNode } from "react";

export type LoginFormType = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  username: string;
};

export type LoginResponse = {
  userID: string;
  user: User;
  token: string;
  companyId: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface Product {
  productId?: number;
  defaultImagePath?: string | undefined;
  sellingPriceActual?: number;
  discount?: number;
  applyProductLevelDiscount?: ReactNode | number | null;
  productName?: string;
  barCode?: string;
  category?: string;
  orderDetailID?: string;
  productPrice?: number | undefined;
  unitPrice?: number;
  tax?: number;
  quantity?: number;
  total?: number;
  stockAffected?: boolean;
  confirmed?: boolean;
}

export interface PosOrder {
  orderId: number;
  orderNumber: string;
  created_on: string;
  creator_userID: number;
}

export interface PosOrders {
  status: number;
  message: string;
  salesPerson_userID: number;
  grandTotal: number;
  companyName: string;
  posOrders: PosOrder[];
}

export interface OrderDetailsResponse {
  status: number;
  message: string;
  orderId: number;
  orderNumber: string;
  orderUser: string;
  customerName: string | null;
  customerNumber: string | null;
  customerTelephone: string | null;
  orderDate: string;
  posOrderHeadDetails: Product[];
}

export interface Payment {
  paymentId: number;
  user?: string;
  paymentDate?: string;
  amount?: number;
  cardPayment?: number;
  cashPayment?: number;
  mobileMoneyPayment?: number;
  cashChange?: number;
  totalBill?: number;
  totalPayment?: number;
  balance?: number;
  salesOrderId?: number | string;
}

export interface OrderData {
  affectStock?: string;
  orderId: string | null;
  staffid?: string;
  companyid?: number;
  customerName?: string;
  customerNumber?: string;
  customerTelephone?: string;
  subTotal?: number;
  discount?: number;
  tax?: number;
  grandTotal?: number;
  payments?: number;
  customerExtraDiscount?: number;
  customerDiscountRate?: number;
  inprogress?: boolean;
  paymentList?: Payment[];
  products?: Product[];
}

export interface SaveOrderResponse {
  success?: any;
  message?: string;
  orderId: string | null;
  error?: any;
}

export interface Item {
  orderId: number;
  orderDetailID: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  tax: number;
  discount: number;
  total: number;
  stockAffected: boolean;
  edit: boolean;
}

export interface ReceiptData {
  items: Product[];
  orderId: string | null;
  companyLogo: string;
  loginCompany: string;
  companyAddress: string;
  companyTelephone: string;
  companyEmail: string;
  subTotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  totalPayment: number;
}

export interface Partner {
  id: number;
  fullName: string;
  partnerTelephone: string;
  barCode: string;
  discount: number;
}
