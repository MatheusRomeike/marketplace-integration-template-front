import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { conformToMask } from 'text-mask-core';

export class Mask {
  public get Data(): Array<string> {
    return [
      /[0-9]/,
      /[0-9]/,
      '/',
      /[0-9]/,
      /[0-9]/,
      '/',
      /[1-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Tel(): Array<string> {
    return [
      '(',
      /[0-9]/,
      /[0-9]/,
      ')',
      ' ',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Cel(): Array<string> {
    return [
      '(',
      /[0-9]/,
      /[0-9]/,
      ')',
      ' ',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Cep(): Array<string> {
    return [
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Cpf(): Array<string> {
    return [
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '.',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '.',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Cnpj(): Array<string> {
    return [
      /[0-9]/,
      /[0-9]/,
      '.',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '.',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '/',
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      /[0-9]/,
      '-',
      /[0-9]/,
      /[0-9]/,
    ] as Array<string>;
  }

  public get Dinheiro(): any {
    return createNumberMask({
      prefix: 'R$',
      suffix: '',
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
      decimalLimit: 2,
    });
  }

  public get Percentual(): any {
    return createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: '',
      allowDecimal: true,
      decimalSymbol: '.',
      decimalLimit: 3,
    });
  }

  public ConvertMoneyToDecimal(value: string): number {
    var s = value.replace(/\./g, '');
    return parseFloat(s.replace(/,/g, '.'));
  }

  public ConvertDecimalToMoney(value: number): string {
    if (value) {
      var s = value.toFixed(2).toString().replace(/\./g, ',');
      var convert = conformToMask(s, this.Dinheiro, { guide: false }).conformedValue;
      return convert;
    }
    return '';
  }

  public copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
