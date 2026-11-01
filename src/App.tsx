import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductShelf from "./components/ProductShelf";
import ProductModal from "./components/ProductModal";
import { loadProducts, money, type Product } from "./services/products";

const categories = [
  ["Tecnologia", "74262"],
  ["Supermercado", "63e6a"],
  ["Bebidas", "605b4"],
  ["Ferramentas", "f0418"],
  ["Saúde", "885b4"],
  ["Esportes e Fitness", "89456"],
  ["Moda", "94a1b"],
];
interface CartItem {
  product: Product;
  quantity: number;
}
function readCart(): CartItem[] {
  try {
    const data = JSON.parse(localStorage.getItem("econverse-cart") || "[]");
    return Array.isArray(data)
      ? data.filter(
          (item: CartItem) =>
            item.product &&
            typeof item.product.productName === "string" &&
            Number.isFinite(item.product.price) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 99,
        )
      : [];
  } catch {
    return [];
  }
}

function Panel({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current!.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      className="info-panel"
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="panel-title"
    >
      <div>
        <button className="panel-close" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
        <h2 id="panel-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

function Partners({ target }: { target: string }) {
  return (
    <section className="partners container" aria-label="Nossos parceiros">
      {[0, 1].map((index) => (
        <article className="partner" key={index}>
          <div className="partner-image">
            <img
              src="/assets/7ed17.png"
              alt="Loja de tecnologia parceira"
              loading="lazy"
            />
          </div>
          <div className="partner-shade" />
          <div className="partner-content">
            <h2>Parceiros</h2>
            <p>Lorem ipsum dolor sit amet, consectetur</p>
            <a className="button yellow" href={`#${target}`}>
              Confira
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("Celular");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const [panel, setPanel] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    loadProducts(controller.signal, "/api/produtos")
      .then((result) => {
        setProducts(result.products);
        setOffline(result.offline);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar os produtos. Tente novamente.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    try {
      localStorage.setItem("econverse-cart", JSON.stringify(cart));
    } catch {
      /* A sacola continua disponível na sessão sem armazenamento. */
    }
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  const visible = useMemo(
    () =>
      products
        .filter((p) =>
          p.productName
            .toLocaleLowerCase("pt-BR")
            .includes(search.trim().toLocaleLowerCase("pt-BR")),
        )
        .filter(() => filter === "Celular" || filter === "Ver todos"),
    [products, search, filter],
  );
  const changeFilter = (value: string) => {
    setFilter(value);
    if (value === "Ver todos") setSearch("");
  };
  const onSearch = (value: string) => {
    setSearch(value);
    setFilter("Ver todos");
  };
  function buy(product: Product, quantity: number) {
    setCart((items) => {
      const existing = items.find(
        (item) => item.product.productName === product.productName,
      );
      return existing
        ? items.map((item) =>
            item === existing
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item,
          )
        : [...items, { product, quantity }];
    });
    setSelected(null);
    setToast(`${product.productName} adicionado à sacola.`);
  }
  const shelfProps = {
    products: visible,
    onSelect: setSelected,
    filter,
    onFilter: changeFilter,
    loading,
    error,
    onRetry: () => setAttempt((a) => a + 1),
  };
  return (
    <>
      <Header
        onSearch={onSearch}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onCart={() => setPanel("Sua sacola")}
        onInfo={setPanel}
      />
      <main id="conteudo">
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="/assets/ae594.png"
            alt=""
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="container hero-content">
            <h1 id="hero-title">
              Venha conhecer nossas <br />
              promoções
            </h1>
            <p>
              <strong>50% Off</strong> nos produtos
            </p>
            <a className="button yellow" href="#produtos">
              Ver produto
            </a>
          </div>
        </section>
        <section
          className="categories"
          id="categorias"
          aria-label="Compre por categoria"
        >
          {categories.map(([name, file], index) => (
            <a
              key={name}
              href="#produtos"
              className={index === 0 ? "selected" : ""}
              onClick={() => {
                setFilter(index === 0 ? "Celular" : name);
                setSearch("");
              }}
            >
              <span>
                <img
                  src={`/assets/${file}.png`}
                  alt=""
                  width={index === 6 ? 63 : 61}
                  height={index === 6 ? 63 : 61}
                />
              </span>
              {name}
            </a>
          ))}
        </section>
        {offline && (
          <p className="offline-note container" role="status">
            Catálogo exibido a partir da última cópia disponível.{" "}
            <button onClick={() => setAttempt((a) => a + 1)}>Atualizar</button>
          </p>
        )}
        {search && (
          <p className="search-summary container">
            Resultados para “{search}”{" "}
            <button onClick={() => onSearch("")}>Limpar busca ×</button>
          </p>
        )}
        <ProductShelf {...shelfProps} first id="produtos" />
        <Partners target="selecao" />
        <ProductShelf {...shelfProps} id="selecao" />
        <Partners target="mais-produtos" />
        <section className="brands container" aria-labelledby="brands-title">
          <h2 id="brands-title">Navegue por marcas</h2>
          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <a
                key={index}
                href="#mais-produtos"
                aria-label={`Ver produtos Econverse, seleção ${index + 1}`}
                onClick={() => changeFilter("Ver todos")}
              >
                <img src="/assets/c273b.svg" alt="Econverse" />
              </a>
            ))}
          </div>
        </section>
        <ProductShelf {...shelfProps} id="mais-produtos" />
      </main>
      <Footer onInfo={setPanel} />
      {selected && (
        <ProductModal
          key={selected.productName}
          product={selected}
          onClose={() => setSelected(null)}
          onBuy={buy}
        />
      )}
      {panel && (
        <Panel title={panel} onClose={() => setPanel("")}>
          {panel === "Sua sacola" ? (
            cart.length ? (
              <>
                <ul className="cart-items">
                  {cart.map((item) => (
                    <li key={item.product.productName}>
                      <img src={item.product.photo} alt="" />
                      <div>
                        <strong>{item.product.productName}</strong>
                        <p>
                          {item.quantity} × {money(item.product.price)}
                        </p>
                        <button
                          onClick={() =>
                            setCart((items) => items.filter((i) => i !== item))
                          }
                        >
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="cart-total">
                  Total{" "}
                  <strong>
                    {money(
                      cart.reduce(
                        (total, item) =>
                          total + item.product.price * item.quantity,
                        0,
                      ),
                    )}
                  </strong>
                </p>
                <p className="panel-note">
                  Sacola demonstrativa. Nenhum pagamento é realizado.
                </p>
              </>
            ) : (
              <p>Sua sacola está vazia. Escolha um produto para começar.</p>
            )
          ) : (
            <>
              <p>
                Esta página faz parte de uma demonstração de interface. O
                serviço de {panel.toLocaleLowerCase("pt-BR")} não está
                conectado.
              </p>
              <a
                className="button"
                href="https://www.econverse.com.br/"
                target="_blank"
                rel="noreferrer"
              >
                Conhecer a Econverse
              </a>
            </>
          )}
        </Panel>
      )}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        {toast}
      </div>
    </>
  );
}
