import { calculateMargin, CalculationInput } from "./calculator";

describe("calculateMargin", () => {
  it("일반적인 케이스: 부가세(일반) 및 마켓 수수료 차감 후 정상 산출", () => {
    const input: CalculationInput = {
      price: 10000,
      shippingCustomer: 3000,
      cost: 4000,
      shippingReal: 3000,
      packing: 200,
      other: 0,
      feeRate: 5,
      taxType: "general",
      incomeTaxRate: 0,
    };

    const result = calculateMargin(input);

    expect(result.totalRevenue).toBe(13000); // 10000 + 3000
    expect(result.totalCost).toBe(7200); // 4000 + 3000 + 200
    expect(result.marketFeeAmount).toBe(650); // 13000 * 5% = 650
    // 부가세: (13000 - 7200 - 650) * 10% = 5150 * 0.1 = 515
    expect(result.vat).toBe(515);
    expect(result.incomeTax).toBe(0);
    // 순수익 = 13000 - 7200 - 650 - 515 - 0 = 4635
    expect(result.netProfit).toBe(4635);
  });

  it("적자 케이스: 세금은 0원으로 계산", () => {
    const input: CalculationInput = {
      price: 5000,
      shippingCustomer: 0,
      cost: 6000,
      shippingReal: 0,
      packing: 0,
      other: 0,
      feeRate: 10,
      taxType: "general",
      incomeTaxRate: 10,
    };

    const result = calculateMargin(input);

    expect(result.totalRevenue).toBe(5000);
    expect(result.totalCost).toBe(6000);
    expect(result.marketFeeAmount).toBe(500);
    // 손해이므로 세금 0
    expect(result.vat).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.netProfit).toBe(-1500); // 5000 - 6000 - 500
  });

  it("소득세율 적용", () => {
    const input: CalculationInput = {
      price: 10000,
      shippingCustomer: 0,
      cost: 0,
      shippingReal: 0,
      packing: 0,
      other: 0,
      feeRate: 0,
      taxType: "taxfree", // 부가세 0
      incomeTaxRate: 10, // 소득세 10%
    };

    const result = calculateMargin(input);

    expect(result.netProfit).toBe(9000); // 10000 - 1000(소득세)
  });
});
