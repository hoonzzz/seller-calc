export type TaxType = "general" | "simplified" | "taxfree";

export interface CalculationInput {
  price: number;
  shippingCustomer: number;
  cost: number;
  shippingReal: number;
  packing: number;
  other: number;
  feeRate: number;
  taxType: TaxType;
  incomeTaxRate: number;
}

export interface CalculationResult {
  totalRevenue: number;
  totalCost: number;
  marketFeeAmount: number;
  vat: number;
  incomeTax: number;
  netProfit: number;
  marginRate: number;
  roi: number;
}

export function calculateMargin(input: CalculationInput): CalculationResult {
  const {
    price,
    shippingCustomer,
    cost,
    shippingReal,
    packing,
    other,
    feeRate,
    taxType,
    incomeTaxRate
  } = input;

  const totalRevenue = price + shippingCustomer;
  const marketFeeAmount = Math.round(totalRevenue * (feeRate / 100));
  const totalCost = cost + shippingReal + packing + other;

  // 부가세 계산
  let vat = 0;
  if (taxType === "general") {
    // 일반과세: 단순 (매출-매입-수수료)*10%
    vat = Math.max(0, Math.round((totalRevenue - totalCost - marketFeeAmount) * 0.1));
  } else if (taxType === "simplified") {
    // 간이과세: 소매업 약 1.5% 수준 실효세율
    vat = Math.max(0, Math.round((totalRevenue - totalCost - marketFeeAmount) * 0.015));
  } else {
    vat = 0;
  }

  // 소득세 계산
  const taxableIncome = totalRevenue - totalCost - marketFeeAmount - vat;
  const incomeTax = taxableIncome > 0 ? Math.round(taxableIncome * (incomeTaxRate / 100)) : 0;

  const netProfit = totalRevenue - totalCost - marketFeeAmount - vat - incomeTax;
  const marginRate = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    totalRevenue,
    totalCost,
    marketFeeAmount,
    vat,
    incomeTax,
    netProfit,
    marginRate,
    roi
  };
}
