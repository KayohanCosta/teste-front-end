import { useState, type FormEvent } from "react";
interface Props {
  onSearch: (value: string) => void;
  cartCount: number;
  onCart: () => void;
  onInfo: (title: string) => void;
}
const icon = (file: string) => `/assets/${file}.svg`;
export default function Header({ onSearch, cartCount, onCart, onInfo }: Props) {
  const [search, setSearch] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch(search);
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <header className="site-header container">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="benefits">
        <span>
          <img src={icon("289f6")} alt="" />
          Compra <b>100% segura</b>
        </span>
        <span>
          <img src={icon("29326")} alt="" />
          <b>Frete grátis</b> acima de R$ 200
        </span>
        <span>
          <img src={icon("c2340")} alt="" />
          <b>Parcele</b> suas compras
        </span>
      </div>
      <div className="main-header">
        <a href="#" aria-label="Econverse, início">
          <img className="header-logo" src={icon("5bfa2")} alt="Econverse" />
        </a>
        <form className="search" role="search" onSubmit={submit}>
          <input
            aria-label="Buscar produtos"
            placeholder="O que você está buscando?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
          />
          <button aria-label="Pesquisar">
            <img src={icon("72aed")} alt="" />
          </button>
        </form>
        <div className="header-actions">
          <button
            className="orders-action"
            aria-label="Meus pedidos"
            onClick={() => onInfo("Meus pedidos")}
          >
            <img src={icon("b0cde")} alt="" />
          </button>
          <button aria-label="Favoritos" onClick={() => onInfo("Favoritos")}>
            <img src={icon("17fdf")} alt="" />
          </button>
          <button
            aria-label="Minha conta"
            onClick={() => onInfo("Minha conta")}
          >
            <img src={icon("9bc67")} alt="" />
          </button>
          <button aria-label={`Sacola, ${cartCount} itens`} onClick={onCart}>
            <img src={icon("bff02")} alt="" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navegação principal">
        {[
          "Todas categorias",
          "Supermercado",
          "Livros",
          "Moda",
          "Lançamentos",
          "Ofertas do dia",
        ].map((label) => (
          <a
            key={label}
            className={label === "Ofertas do dia" ? "active" : ""}
            href={label === "Todas categorias" ? "#categorias" : "#produtos"}
            onClick={() => onSearch("")}
          >
            {label}
          </a>
        ))}
        <button
          onClick={() =>
            document
              .getElementById("newsletter")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <img src={icon("6edb7")} alt="" />
          Assinatura
        </button>
      </nav>
    </header>
  );
}
