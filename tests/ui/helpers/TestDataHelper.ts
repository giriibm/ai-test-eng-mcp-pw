import * as fs from 'fs';
import * as path from 'path';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface Product {
  name: string;
  addToCartSelector: string;
  removeSelector: string;
  price: number;
  priceDisplay: string;
}

export interface TestData {
  credentials: {
    standardUser: { username: string; password: string };
    lockedOutUser: { username: string; password: string };
    problemUser: { username: string; password: string };
    performanceGlitchUser: { username: string; password: string };
  };
  products: {
    backpack: Product;
    bikeLight: Product;
    boltTShirt: Product;
    fleeceJacket: Product;
    onesie: Product;
  };
}

export function getTestData(): TestData {
  const dataPath = path.join(__dirname, '../data/checkout-test-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(rawData) as TestData;
}

export const STANDARD_USER = {
  username: 'standard_user',
  password: 'secret_sauce',
};
