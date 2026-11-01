import { useEffect, useRef, useState } from "react";
import { money, type Product } from "../services/products";

interface Props {
  product: Product;
  onClose: () => void;
  onBuy: (product: Product, quantity: number) => void;
}
export default function ProductModal({ product, onClose, onBuy }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState(false);
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="product-modal"
      aria-labelledby="product-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button className="close" aria-label="Fechar produto" onClick={onClose}>
          <span className="close-line">
            <img src="/assets/b00a8.svg" alt="" />
          </span>
          <span className="close-line">
            <img src="/assets/ca3de.svg" alt="" />
          </span>
        </button>
        <img
          className="modal-photo"
          src={product.photo}
          alt={product.productName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/c1c95.png";
          }}
        />
        <div className="modal-info">
          <h2 id="product-title">{product.productName}</h2>
          <strong className="modal-price">{money(product.price)}</strong>
          <p className="description">{product.descriptionShort}</p>
          <button
            className="details-link"
            aria-expanded={details}
            onClick={() => setDetails(!details)}
          >
            Veja {details ? "menos" : "mais"} detalhes do produto{" "}
            {details ? "−" : ">"}
          </button>
          {details && (
            <p className="extra-details">
              Pagamento em até 2x de {money(product.price / 2)} sem juros.{" "}
              {product.price >= 200
                ? "Frete grátis para este produto."
                : "Frete grátis em compras acima de R$ 200."}
            </p>
          )}
          <div className="purchase">
            <div className="quantity" aria-label="Quantidade">
              <button
                aria-label="Diminuir quantidade"
                disabled={quantity === 1}
                onClick={() => setQuantity((q) => q - 1)}
              >
                <img src="/assets/27e43.svg" alt="" />
              </button>
              <output aria-live="polite">
                {String(quantity).padStart(2, "0")}
              </output>
              <button
                aria-label="Aumentar quantidade"
                disabled={quantity === 99}
                onClick={() => setQuantity((q) => q + 1)}
              >
                <img src="/assets/1204e.svg" alt="" />
              </button>
            </div>
            <button
              className="button yellow"
              onClick={() => onBuy(product, quantity)}
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
