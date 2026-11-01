import { afterEach, describe, expect, it, vi } from "vitest";
import { loadProducts, money, parseProducts, PRODUCTS_URL } from "./products";
const product = {
  productName: "iPhone",
  descriptionShort: "Produto de teste",
  photo: "https://example.com/phone.png",
  price: 15000,
};
afterEach(() => vi.unstubAllGlobals());
describe("catálogo", () => {
  it("preserva os preços em reais informados pelo endpoint", () => {
    expect(parseProducts({ products: [product] })[0].price).toBe(15000);
    expect(money(15000).replace(/\s/g, " ")).toBe("R$ 15.000,00");
  });
  it("rejeita produtos com dados incompletos ou preço inválido", () => {
    expect(() =>
      parseProducts({ products: [{ ...product, price: -1 }] }),
    ).toThrow();
    expect(() => parseProducts({ products: [{}] })).toThrow();
  });
  it("consome o endereço oficial", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ products: [product] }),
      });
    vi.stubGlobal("fetch", fetcher);
    expect((await loadProducts(new AbortController().signal)).offline).toBe(
      false,
    );
    expect(fetcher.mock.calls[0][0]).toBe(PRODUCTS_URL);
  });
  it("recupera a cópia local se o serviço estiver indisponível", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [product] }),
      });
    vi.stubGlobal("fetch", fetcher);
    const result = await loadProducts(new AbortController().signal);
    expect(result.products).toEqual([product]);
    expect(result.offline).toBe(true);
    expect(fetcher.mock.calls[1][0]).toBe("/produtos.json");
  });
  it("não inicia recuperação para uma requisição cancelada", async () => {
    const controller = new AbortController();
    controller.abort();
    const fetcher = vi
      .fn()
      .mockRejectedValue(new DOMException("Aborted", "AbortError"));
    vi.stubGlobal("fetch", fetcher);
    await expect(loadProducts(controller.signal)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
