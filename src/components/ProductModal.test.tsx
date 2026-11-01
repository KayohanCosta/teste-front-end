import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ProductModal from "./ProductModal";
const product = {
  productName: "iPhone 13",
  descriptionShort: "Descrição do iPhone",
  photo: "https://example.com/phone.png",
  price: 9000,
};
it("exibe o produto selecionado e compra a quantidade escolhida", async () => {
  const user = userEvent.setup();
  const onBuy = vi.fn();
  render(<ProductModal product={product} onClose={vi.fn()} onBuy={onBuy} />);
  expect(screen.getByRole("dialog")).toHaveAccessibleName("iPhone 13");
  expect(screen.getByText("Descrição do iPhone")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Diminuir quantidade" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Aumentar quantidade" }));
  await user.click(screen.getByRole("button", { name: "Comprar" }));
  expect(onBuy).toHaveBeenCalledWith(product, 2);
});
it("fecha pelo botão e devolve o foco ao elemento de origem", async () => {
  const user = userEvent.setup();
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const close = vi.fn();
  const view = render(
    <ProductModal product={product} onClose={close} onBuy={vi.fn()} />,
  );
  await user.click(screen.getByRole("button", { name: "Fechar produto" }));
  expect(close).toHaveBeenCalledOnce();
  view.unmount();
  expect(trigger).toHaveFocus();
  trigger.remove();
});
