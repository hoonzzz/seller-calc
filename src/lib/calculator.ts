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

/**
 * 목표 순마진율(%)을 달성하기 위한 '최대 허용 매입원가(도매 사입가 상한선)' 역산 함수
 */
export function calculateMaxAllowedCost(params: {
  targetSellingPrice: number;
  targetMarginRate: number;
  shippingCustomer: number;
  shippingReal: number;
  packing: number;
  other: number;
  feeRate: number;
  taxType: TaxType;
  incomeTaxRate: number;
}): number {
  const {
    targetSellingPrice,
    targetMarginRate,
    shippingCustomer,
    shippingReal,
    packing,
    other,
    feeRate,
    taxType,
    incomeTaxRate,
  } = params;

  const totalRevenue = targetSellingPrice + shippingCustomer;
  if (totalRevenue <= 0) return 0;

  const marketFeeAmount = Math.round(totalRevenue * (feeRate / 100));
  const fixedLogisticCost = shippingReal + packing + other;

  const vatFactor = taxType === "general" ? 0.1 : taxType === "simplified" ? 0.015 : 0;
  const safeIncomeRate = Math.min(90, Math.max(0, incomeTaxRate));
  const keepRatio = (1 - vatFactor) * (1 - safeIncomeRate / 100);

  if (keepRatio <= 0) return 0;

  const targetNetProfit = totalRevenue * (targetMarginRate / 100);
  const requiredPreTaxProfit = targetNetProfit / keepRatio;

  const maxCost = Math.floor(
    totalRevenue - marketFeeAmount - fixedLogisticCost - requiredPreTaxProfit
  );

  return Math.max(0, maxCost);
}

/**
 * 사업용 장비/비품 구매 시 과세유형별 부가세 환급 및 종소세 필요경비 반영 '실질 체감 구매가' 계산 함수
 */
export function calculateTaxShieldPrice(params: {
  itemPrice: number;
  taxType: TaxType;
  incomeTaxRate: number;
}) {
  const { itemPrice, taxType, incomeTaxRate } = params;
  // 사용자가 소득세율을 0으로 두었더라도 실무 셀러 최다 구간(과표 1,400~5,000만 원: 지방세 포함 16.5%)을 기준치로 시뮬레이션
  const appliedIncomeTaxRate = incomeTaxRate > 0 ? incomeTaxRate : 16.5;

  const supplyPrice = Math.round(itemPrice / 1.1);
  const paidVat = itemPrice - supplyPrice;

  // 과세 유형별 부가세 매입세액 공제액 (일반과세 100%, 간이과세 0.5%, 면세 0%)
  let vatRefund = 0;
  if (taxType === "general") {
    vatRefund = paidVat;
  } else if (taxType === "simplified") {
    vatRefund = Math.round(itemPrice * 0.005);
  }

  // 부가세 공제를 제외한 실제 비용 인정 기준액에 대한 종합소득세 절감액
  const expenseBase = taxType === "general" ? supplyPrice : itemPrice - vatRefund;
  const incomeTaxSaved = Math.round(expenseBase * (appliedIncomeTaxRate / 100));

  const totalTaxSaved = vatRefund + incomeTaxSaved;
  const effectivePrice = Math.max(0, itemPrice - totalTaxSaved);
  const savePercent = itemPrice > 0 ? (totalTaxSaved / itemPrice) * 100 : 0;

  return {
    appliedIncomeTaxRate,
    vatRefund,
    incomeTaxSaved,
    totalTaxSaved,
    effectivePrice,
    savePercent,
  };
}
