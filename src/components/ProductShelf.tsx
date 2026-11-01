import { useRef } from "react";
import { money, type Product } from "../services/products";

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
  first?: boolean;
  filter: string;
  onFilter: (value: string) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  id: string;
}
const tabs = [
  "Celular",
  "Acessórios",
  "Tablets",
  "Notebooks",
  "TVs",
  "Ver todos",
];
export default function ProductShelf({
  products,
  onSelect,
  first,
  filter,
  onFilter,
  loading,
  error,
  onRetry,
  id,
}: Props) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (direction: number) =>
    track.current?.scrollBy({
      left: direction * (track.current.clientWidth + 18),
      behavior: "smooth",
    });
  return (
    <section
      className={`shelf container ${first ? "first-shelf" : ""}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <div className="section-title">
        <h2 id={`${id}-title`}>Produtos relacionados</h2>
      </div>
      {first ? (
        <div className="tabs" aria-label="Categorias de produtos">
          {tabs.map((tab) => (
            <button
              key={tab}
              aria-pressed={filter === tab}
              onClick={() => onFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : (
        <button
          className="see-all"
          onClick={() => {
            onFilter("Ver todos");
            track.current?.scrollTo({ left: 0, behavior: "smooth" });
          }}
        >
          Ver todos
        </button>
      )}
      {error ? (
        <div className="empty-state" role="alert">
          <p>{error}</p>
          <button className="button" onClick={onRetry}>
            Tentar novamente
          </button>
        </div>
      ) : !loading && !products.length ? (
        <div className="empty-state">
          <p>Nenhum produto encontrado.</p>
          <button
            className="details-link"
            onClick={() => onFilter("Ver todos")}
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div className="carousel">
          <button
            className="arrow previous"
            aria-label="Produtos anteriores"
            onClick={() => scroll(-1)}
          >
            <img src="/assets/ddea1.svg" alt="" />
          </button>
          <ul
            ref={track}
            className="product-track"
            aria-label="Produtos"
            aria-busy={loading}
          >
            {loading
              ? Array.from({ length: 4 }, (_, i) => (
                  <li className="skeleton" key={i}>
                    <span />
                    <span />
                    <span />
                  </li>
                ))
              : products.map((product) => (
                  <li className="product-card" key={product.productName}>
                    <button
                      className="product-open"
                      onClick={() => onSelect(product)}
                      aria-label={`Ver ${product.productName}`}
                    >
                      <img
                        src={product.photo}
                        alt={product.productName}
                        loading="lazy"
                        width="278"
                        height="228"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/c1c95.png";
                        }}
                      />
                      <h3>{product.productName}</h3>
                    </button>
                    <div className="card-price">
                      <strong>{money(product.price)}</strong>
                      <p>ou 2x de {money(product.price / 2)} sem juros</p>
                      {product.price >= 200 && <span>Frete grátis</span>}
                    </div>
                    <button
                      className="button buy-button"
                      onClick={() => onSelect(product)}
                    >
                      Comprar
                    </button>
                  </li>
                ))}
          </ul>
          <button
            className="arrow next"
            aria-label="Próximos produtos"
            onClick={() => scroll(1)}
          >
            <img src="/assets/ddea1.svg" alt="" />
          </button>
        </div>
      )}
    </section>
  );
}
