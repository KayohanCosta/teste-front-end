export interface Product {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
}
export const PRODUCTS_URL =
  "https://app.econverse.com.br/teste-front-end/junior/tecnologia/lista-produtos/produtos.json";
export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export function parseProducts(data: unknown): Product[] {
  if (
    !data ||
    typeof data !== "object" ||
    !("products" in data) ||
    !Array.isArray(data.products)
  )
    throw new Error("Resposta de produtos inválida.");
  return data.products.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Produto inválido.");
    const p = item as Record<string, unknown>;
    if (
      typeof p.productName !== "string" ||
      typeof p.descriptionShort !== "string" ||
      typeof p.photo !== "string" ||
      typeof p.price !== "number" ||
      !Number.isFinite(p.price) ||
      p.price < 0 ||
      !/^https?:\/\//.test(p.photo)
    )
      throw new Error("Produto inválido.");
    return {
      productName: p.productName,
      descriptionShort: p.descriptionShort,
      photo: p.photo,
      price: p.price,
    };
  });
}

export async function loadProducts(
  signal: AbortSignal,
  url = PRODUCTS_URL,
): Promise<{ products: Product[]; offline: boolean }> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
    });
    if (!response.ok) throw new Error("Não foi possível carregar os produtos.");
    return { products: parseProducts(await response.json()), offline: false };
  } catch (error) {
    if (signal.aborted) throw error;
    const response = await fetch("/produtos.json", { signal });
    if (!response.ok)
      throw new Error(
        "Não foi possível carregar os produtos. Tente novamente.",
      );
    return { products: parseProducts(await response.json()), offline: true };
  }
}
